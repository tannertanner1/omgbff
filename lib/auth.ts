import NextAuth, { DefaultSession } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import {
  sessions,
  users,
  accounts,
  verificationTokens
} from '@/db/schema/users'
import { eq, and, sql } from 'drizzle-orm'
import { Resend as ResendClient } from 'resend'
import Resend from 'next-auth/providers/resend'
import { VerifyEmail } from '@/lib/emails/verify-email'
import { LoginEmail } from '@/lib/emails/login-email'
import { JWT } from 'next-auth/jwt'

type Role = 'owner' | 'admin' | 'user'

interface DatabaseUser {
  id: string
  email: string | null
  emailVerified: Date | null
  name: string | null
  image: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string | null
      image: string | null
      role: Role
      emailVerified: Date | null
    }
  }

  interface User extends DatabaseUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string | null
    image: string | null
    role: Role
    emailVerified: Date | null
  }
}

const resend = new ResendClient(process.env.AUTH_RESEND_KEY)

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/login' },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }) as Adapter,
  session: { strategy: 'jwt' },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_RESEND_EMAIL,
      async sendVerificationRequest({ identifier: email, url }) {
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email)
        })
        await resend.emails.send({
          from: process.env.AUTH_RESEND_EMAIL!,
          to: email,
          subject: user?.emailVerified
            ? 'Sign in to your account'
            : 'Verify your email',
          react: user?.emailVerified
            ? LoginEmail({ url })
            : VerifyEmail({ url })
        })
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: and(
            eq(users.id, sql`${user.id}::text`),
            sql`${users.id} IS NOT NULL`
          )
        })

        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email || ''
          token.name = dbUser.name
          token.image = dbUser.image
          token.role = dbUser.role
          token.emailVerified = dbUser.emailVerified
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.id) {
        const dbUser = await db.query.users.findFirst({
          where: and(
            eq(users.id, sql`${token.id}::text`),
            sql`${users.id} IS NOT NULL`
          )
        })

        if (!dbUser) {
          throw new Error('User not found')
        }

        return {
          ...session,
          user: {
            id: dbUser.id,
            email: dbUser.email || '',
            name: dbUser.name,
            image: dbUser.image,
            role: dbUser.role,
            emailVerified: dbUser.emailVerified
          }
        }
      }
      return session
    },
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl
      if (pathname.startsWith('/dashboard')) {
        return !!auth
      }
      return true
    }
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        await db
          .update(users)
          .set({
            role: 'user' as Role,
            updatedAt: new Date()
          })
          .where(
            and(
              eq(users.id, sql`${user.id}::text`),
              sql`${users.id} IS NOT NULL`
            )
          )
      }
    },
    async linkAccount({ user }) {
      if (user.id) {
        await db
          .update(users)
          .set({
            emailVerified: new Date(),
            updatedAt: new Date()
          })
          .where(
            and(
              eq(users.id, sql`${user.id}::text`),
              sql`${users.id} IS NOT NULL`
            )
          )
      }
    }
  }
})

// import NextAuth, { DefaultSession } from 'next-auth'
// // Database adapter
// import { Adapter } from 'next-auth/adapters'
// import { DrizzleAdapter } from '@auth/drizzle-adapter'
// import { db } from '@/db'
// import {
//   sessions,
//   users,
//   accounts,
//   verificationTokens
// } from '@/db/schema/users'
// import { eq } from 'drizzle-orm'
// // Auth provider
// import { Resend as ResendClient } from 'resend'
// import Resend from 'next-auth/providers/resend'
// import { VerifyEmail } from '@/lib/emails/verify-email'
// import { LoginEmail } from '@/lib/emails/login-email'
// // Session strategy
// import { JWT } from 'next-auth/jwt'

// // TypeScript module augmentation
// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string
//       role?: string
//       emailVerified?: Date | null
//     } & DefaultSession['user']
//   }
//   interface User {
//     id?: string
//     role?: string
//     emailVerified?: Date | null
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     // OpenID Connect claims
//     idToken?: string
//     role?: string
//     emailVerified?: Date | null
//   }
// }

// const resend = new ResendClient(process.env.AUTH_RESEND_KEY)

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   debug: process.env.NODE_ENV !== 'production', // Debug in development only
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: '/login' },
//   adapter: DrizzleAdapter(db, {
//     usersTable: users,
//     accountsTable: accounts,
//     sessionsTable: sessions,
//     verificationTokensTable: verificationTokens
//   }) as Adapter,
//   session: { strategy: 'jwt' },
//   providers: [
//     Resend({
//       apiKey: process.env.AUTH_RESEND_KEY,
//       from: process.env.AUTH_RESEND_EMAIL,
//       async sendVerificationRequest({ identifier: email, url }) {
//         const user = await db.query.users.findFirst({
//           where: (users, { eq }) => eq(users.email, email)
//         })
//         await resend.emails.send({
//           from: process.env.AUTH_RESEND_EMAIL!,
//           to: email,
//           subject: user?.emailVerified
//             ? 'Sign in to your account'
//             : 'Verify your email',
//           react: user?.emailVerified
//             ? LoginEmail({ url })
//             : VerifyEmail({ url })
//         })
//       }
//     })
//   ],
//   callbacks: {
//     // The `user` argument is only available when using the `database` session strategy;
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role
//         token.emailVerified = user.emailVerified
//       }
//       return token
//     },
//     // the `token` argument is only available when using the `jwt` session strategy.
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           session: token.session,
//           role: token.role,
//           emailVerified: token.emailVerified
//         }
//       }
//     },
//     authorized: async ({ auth, request }) => {
//       const { pathname } = request.nextUrl
//       // Require authentication only for dashboard routes
//       if (pathname.startsWith('/dashboard')) {
//         return !!auth
//       }
//       // Allow access to all other routes
//       return true
//     }
//   },
//   events: {
//     async createUser({ user }) {
//       if (user.id) {
//         await db
//           .update(users)
//           .set({ role: 'user' })
//           .where(eq(users.id, user.id))
//       }
//     },
//     async linkAccount({ user }) {
//       if (user.id) {
//         await db
//           .update(users)
//           .set({ emailVerified: new Date() })
//           .where(eq(users.id, user.id))
//       }
//     }
//   }
// })
