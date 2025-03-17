import NextAuth, { type DefaultSession } from 'next-auth'
// Database adapter
import type { Adapter } from 'next-auth/adapters'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import {
  sessions,
  users,
  accounts,
  verificationTokens,
  invitations
} from '@/db/schema/users'
import { eq, and, sql } from 'drizzle-orm'
// Auth provider
import { Resend as ResendClient } from 'resend'
import Resend from 'next-auth/providers/resend'
import VerifyEmail from '@/emails/verify-email'
import LoginEmail from '@/emails/login-email'
import InviteEmail from '@/emails/invite-email'
import type { Role } from '@/data/system-roles'
import { ROUTES } from '@/data/public-routes'
// Session strategy
import { JWT } from 'next-auth/jwt'

interface DatabaseUser {
  id: string
  email: string | null
  role: Role
  name: string | null
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
  image: string | null
}

// TypeScript module augmentation
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      role: Role
      name: string | null
      emailVerified: Date | null
      image: string | null
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
  // debug: process.env.NODE_ENV !== "production",
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/login', error: '/error' },
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
        console.log('Sending verification request to:', email)
        console.log('URL:', url)

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email)
        })

        console.log('User found:', user ? 'Yes' : 'No')

        // If user exists and has pending status, update to active
        if (user && user.status === 'pending') {
          await db
            .update(users)
            .set({
              status: 'active',
              updatedAt: new Date()
            })
            .where(eq(users.id, user.id))
        }

        // Check if this is an invitation by looking for a recent invitation record
        const invitation = await db.query.invitations.findFirst({
          where: eq(invitations.email, email),
          with: {
            user: true // Get inviter details
          },
          orderBy: (invitations, { desc }) => [desc(invitations.createdAt)]
        })

        const isInvitation = invitation !== undefined && invitation !== null
        console.log('Is invitation:', isInvitation ? 'Yes' : 'No')

        let subject = 'tannertanner.me'
        let emailTemplate

        if (isInvitation && invitation) {
          // Set subject with inviter's email
          subject = `Invitation from ${invitation.user?.email || 'tannertanner.me'}`

          // Use InviteEmail for all invitations, whether new user or existing
          emailTemplate = InviteEmail({ url })
        } else {
          // Not an invitation, use standard login flow
          emailTemplate = user?.emailVerified
            ? LoginEmail({ url })
            : VerifyEmail({ url })
        }

        try {
          await resend.emails.send({
            from: process.env.AUTH_RESEND_EMAIL!,
            to: email,
            subject,
            react: emailTemplate
          })
          console.log('Email sent successfully')
        } catch (error) {
          console.error('Error sending email:', error)
          throw new Error('Failed to send verification email')
        }
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
          ;(token.id = dbUser.id),
            (token.email = dbUser.email || ''),
            (token.role = dbUser.role),
            (token.name = dbUser.name),
            (token.emailVerified = dbUser.emailVerified),
            (token.image = dbUser.image)
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
          console.error(`User ${token.id} not found`)
          // Return a minimal session instead of throwing an error
          return {
            ...session,
            user: {
              id: token.id,
              email: token.email || '',
              role: 'user',
              name: token.name,
              emailVerified: token.emailVerified,
              image: token.image
            }
          }
        }

        // If user has pending status, update to active
        if (dbUser.status === 'pending') {
          await db
            .update(users)
            .set({
              status: 'active',
              updatedAt: new Date()
            })
            .where(eq(users.id, dbUser.id))

          // Update the dbUser object to reflect the change
          dbUser.status = 'active'
        }

        return {
          ...session,
          user: {
            id: dbUser.id,
            email: dbUser.email || '',
            role: dbUser.role,
            name: dbUser.name,
            emailVerified: dbUser.emailVerified,
            image: dbUser.image
          }
        }
      }
      return session
    },
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl
      // Allow access to public routes
      if (ROUTES.includes(pathname)) {
        return true
      }
      // Require authentication for all other routes
      return !!auth
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
        // Set status to active when account is linked
        await db
          .update(users)
          .set({
            emailVerified: new Date(),
            status: 'active',
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
    async signIn({ user }) {
      if (user.id) {
        // Update user status to active when they sign in
        await db
          .update(users)
          .set({
            status: 'active',
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

// @note

// import NextAuth, { type DefaultSession } from 'next-auth'
// // Database adapter
// import type { Adapter } from 'next-auth/adapters'
// import { DrizzleAdapter } from '@auth/drizzle-adapter'
// import { db } from '@/db'
// import {
//   sessions,
//   users,
//   accounts,
//   verificationTokens,
//   invitations
// } from '@/db/schema/users'
// import { eq, and, sql } from 'drizzle-orm'
// // Auth provider
// import { Resend as ResendClient } from 'resend'
// import Resend from 'next-auth/providers/resend'
// import VerifyEmail from '@/emails/verify-email'
// import LoginEmail from '@/emails/login-email'
// import InviteEmail from '@/emails/invite-email'
// import type { Role } from '@/data/system-roles'
// import { ROUTES } from '@/data/public-routes'
// // Session strategy
// import { JWT } from 'next-auth/jwt'

// interface DatabaseUser {
//   id: string
//   email: string | null
//   role: Role
//   name: string | null
//   emailVerified: Date | null
//   createdAt: Date
//   updatedAt: Date
//   image: string | null
// }

// // TypeScript module augmentation
// declare module 'next-auth' {
//   interface Session extends DefaultSession {
//     user: {
//       id: string
//       email: string
//       role: Role
//       name: string | null
//       emailVerified: Date | null
//       image: string | null
//     }
//   }
//   interface User extends DatabaseUser {}
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string
//     email: string
//     name: string | null
//     image: string | null
//     role: Role
//     emailVerified: Date | null
//   }
// }

// const resend = new ResendClient(process.env.AUTH_RESEND_KEY)

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   // debug: process.env.NODE_ENV !== 'production',
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: '/login', error: '/error' },
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
//         console.log('Sending verification request to:', email)
//         console.log('URL:', url)

//         const user = await db.query.users.findFirst({
//           where: (users, { eq }) => eq(users.email, email)
//         })

//         console.log('User found:', user ? 'Yes' : 'No')

//         // If user exists and has pending status, update to active
//         if (user && user.status === 'pending') {
//           await db
//             .update(users)
//             .set({
//               status: 'active',
//               updatedAt: new Date()
//             })
//             .where(eq(users.id, user.id))
//         }

//         const isNewUser =
//           user && user.status === 'pending' && !user.emailVerified
//         console.log('Is new user:', isNewUser ? 'Yes' : 'No')

//         let subject = 'tannertanner.me'

//         if (isNewUser && user) {
//           // Find the most recent invitation for this user
//           const invitation = await db.query.invitations.findFirst({
//             where: eq(invitations.email, email),
//             with: {
//               user: true // This will get us the inviter's details
//             },
//             orderBy: (invitations, { desc }) => [desc(invitations.createdAt)]
//           })

//           if (invitation?.user?.email) {
//             subject = `Invitation from ${invitation.user.email}`
//           } else {
//             subject = 'tannertanner.me'
//           }
//         }

//         try {
//           await resend.emails.send({
//             from: process.env.AUTH_RESEND_EMAIL!,
//             to: email,
//             subject,
//             react: isNewUser
//               ? InviteEmail({ url })
//               : user?.emailVerified
//                 ? LoginEmail({ url })
//                 : VerifyEmail({ url })
//           })
//           console.log('Email sent successfully')
//         } catch (error) {
//           console.error('Error sending email:', error)
//           throw new Error('Failed to send verification email')
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         const dbUser = await db.query.users.findFirst({
//           where: and(
//             eq(users.id, sql`${user.id}::text`),
//             sql`${users.id} IS NOT NULL`
//           )
//         })

//         if (dbUser) {
//           ;(token.id = dbUser.id),
//             (token.email = dbUser.email || ''),
//             (token.role = dbUser.role),
//             (token.name = dbUser.name),
//             (token.emailVerified = dbUser.emailVerified),
//             (token.image = dbUser.image)
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (token && token.id) {
//         const dbUser = await db.query.users.findFirst({
//           where: and(
//             eq(users.id, sql`${token.id}::text`),
//             sql`${users.id} IS NOT NULL`
//           )
//         })
//         if (!dbUser) {
//           console.error(`User ${token.id} not found`)
//           // Return a minimal session instead of throwing an error
//           return {
//             ...session,
//             user: {
//               id: token.id,
//               email: token.email || '',
//               role: 'user',
//               name: token.name,
//               emailVerified: token.emailVerified,
//               image: token.image
//             }
//           }
//         }

//         // If user has pending status, update to active
//         if (dbUser.status === 'pending') {
//           await db
//             .update(users)
//             .set({
//               status: 'active',
//               updatedAt: new Date()
//             })
//             .where(eq(users.id, dbUser.id))

//           // Update the dbUser object to reflect the change
//           dbUser.status = 'active'
//         }

//         return {
//           ...session,
//           user: {
//             id: dbUser.id,
//             email: dbUser.email || '',
//             role: dbUser.role,
//             name: dbUser.name,
//             emailVerified: dbUser.emailVerified,
//             image: dbUser.image
//           }
//         }
//       }
//       return session
//     },
//     authorized: async ({ auth, request }) => {
//       const { pathname } = request.nextUrl
//       // Allow access to public routes
//       if (ROUTES.includes(pathname)) {
//         return true
//       }
//       // Require authentication for all other routes
//       return !!auth
//     }
//   },
//   events: {
//     async createUser({ user }) {
//       if (user.id) {
//         await db
//           .update(users)
//           .set({
//             role: 'user' as Role,
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     },
//     async linkAccount({ user }) {
//       if (user.id) {
//         // Set status to active when account is linked
//         await db
//           .update(users)
//           .set({
//             emailVerified: new Date(),
//             status: 'active',
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     },
//     async signIn({ user }) {
//       if (user.id) {
//         // Update user status to active when they sign in
//         await db
//           .update(users)
//           .set({
//             status: 'active',
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     }
//   }
// })

// @note YE

// import NextAuth, { type DefaultSession } from 'next-auth'
// // Database adapter
// import type { Adapter } from 'next-auth/adapters'
// import { DrizzleAdapter } from '@auth/drizzle-adapter'
// import { db } from '@/db'
// import {
//   sessions,
//   users,
//   accounts,
//   verificationTokens
// } from '@/db/schema/users'
// import { eq, and, sql } from 'drizzle-orm'
// // Auth provider
// import { Resend as ResendClient } from 'resend'
// import Resend from 'next-auth/providers/resend'
// import VerifyEmail from '@/emails/verify-email'
// import LoginEmail from '@/emails/login-email'
// import InviteEmail from '@/emails/invite-email'
// import type { Role } from '@/data/system-roles'
// import { ROUTES } from '@/data/public-routes'
// import { userOrganizations } from '@/db/schema/users'
// // Session strategy
// import { JWT } from 'next-auth/jwt'

// interface DatabaseUser {
//   id: string
//   email: string | null
//   role: Role
//   name: string | null
//   emailVerified: Date | null
//   createdAt: Date
//   updatedAt: Date
//   image: string | null
// }

// // TypeScript module augmentation
// declare module 'next-auth' {
//   interface Session extends DefaultSession {
//     user: {
//       id: string
//       email: string
//       role: Role
//       name: string | null
//       emailVerified: Date | null
//       image: string | null
//     }
//   }
//   interface User extends DatabaseUser {}
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string
//     email: string
//     name: string | null
//     image: string | null
//     role: Role
//     emailVerified: Date | null
//   }
// }

// const resend = new ResendClient(process.env.AUTH_RESEND_KEY)

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   debug: process.env.NODE_ENV !== 'production',
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: '/login', error: '/error' },
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
//         console.log('Sending verification request to:', email)
//         console.log('URL:', url)

//         const user = await db.query.users.findFirst({
//           where: (users, { eq }) => eq(users.email, email)
//         })

//         console.log('User found:', user ? 'Yes' : 'No')

//         // If user exists and has pending status, update to active
//         if (user && user.status === 'pending') {
//           await db
//             .update(users)
//             .set({
//               status: 'active',
//               updatedAt: new Date()
//             })
//             .where(eq(users.id, user.id))
//         }

//         // ALWAYS send InviteEmail for new users created through the users/actions.ts
//         // This is a more reliable approach than trying to detect from the URL
//         const isNewUser =
//           user && user.status === 'pending' && !user.emailVerified
//         console.log('Is new user:', isNewUser ? 'Yes' : 'No')

//         // Get organization name if available
//         let orgName = 'our organization'
//         if (user) {
//           const userOrg = await db.query.userOrganizations.findFirst({
//             where: eq(userOrganizations.userId, user.id),
//             with: {
//               organization: true
//             }
//           })
//           if (userOrg?.organization?.name) {
//             orgName = userOrg.organization.name
//           }
//         }

//         console.log(
//           'Sending email template:',
//           isNewUser
//             ? 'InviteEmail'
//             : user?.emailVerified
//               ? 'LoginEmail'
//               : 'VerifyEmail'
//         )

//         await resend.emails.send({
//           from: process.env.AUTH_RESEND_EMAIL!,
//           to: email,
//           subject: isNewUser
//             ? `Invitation to join ${orgName}`
//             : 'tannertanner.me',
//           react: isNewUser
//             ? InviteEmail({ url })
//             : user?.emailVerified
//               ? LoginEmail({ url })
//               : VerifyEmail({ url })
//         })
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         const dbUser = await db.query.users.findFirst({
//           where: and(
//             eq(users.id, sql`${user.id}::text`),
//             sql`${users.id} IS NOT NULL`
//           )
//         })

//         if (dbUser) {
//           ;(token.id = dbUser.id),
//             (token.email = dbUser.email || ''),
//             (token.role = dbUser.role),
//             (token.name = dbUser.name),
//             (token.emailVerified = dbUser.emailVerified),
//             (token.image = dbUser.image)
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (token && token.id) {
//         const dbUser = await db.query.users.findFirst({
//           where: and(
//             eq(users.id, sql`${token.id}::text`),
//             sql`${users.id} IS NOT NULL`
//           )
//         })
//         if (!dbUser) {
//           console.error(`User ${token.id} not found`)
//           // Return a minimal session instead of throwing an error
//           return {
//             ...session,
//             user: {
//               id: token.id,
//               email: token.email || '',
//               role: 'user',
//               name: token.name,
//               emailVerified: token.emailVerified,
//               image: token.image
//             }
//           }
//         }

//         // If user has pending status, update to active
//         if (dbUser.status === 'pending') {
//           await db
//             .update(users)
//             .set({
//               status: 'active',
//               updatedAt: new Date()
//             })
//             .where(eq(users.id, dbUser.id))

//           // Update the dbUser object to reflect the change
//           dbUser.status = 'active'
//         }

//         return {
//           ...session,
//           user: {
//             id: dbUser.id,
//             email: dbUser.email || '',
//             role: dbUser.role,
//             name: dbUser.name,
//             emailVerified: dbUser.emailVerified,
//             image: dbUser.image
//           }
//         }
//       }
//       return session
//     },
//     authorized: async ({ auth, request }) => {
//       const { pathname } = request.nextUrl
//       // Allow access to public routes
//       if (ROUTES.includes(pathname)) {
//         return true
//       }
//       // Require authentication for all other routes
//       return !!auth
//     }
//   },
//   events: {
//     async createUser({ user }) {
//       if (user.id) {
//         await db
//           .update(users)
//           .set({
//             role: 'user' as Role,
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     },
//     async linkAccount({ user }) {
//       if (user.id) {
//         // Set status to active when account is linked
//         await db
//           .update(users)
//           .set({
//             emailVerified: new Date(),
//             status: 'active',
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     },
//     async signIn({ user }) {
//       if (user.id) {
//         // Update user status to active when they sign in
//         await db
//           .update(users)
//           .set({
//             status: 'active',
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     }
//   }
// })

// @note

// import NextAuth, { DefaultSession } from 'next-auth'
// import { Adapter } from 'next-auth/adapters'
// import { DrizzleAdapter } from '@auth/drizzle-adapter'
// import { db } from '@/db'
// import {
//   sessions,
//   users,
//   accounts,
//   verificationTokens
// } from '@/db/schema/users'
// import { eq, and, sql } from 'drizzle-orm'
// import { Resend as ResendClient } from 'resend'
// import Resend from 'next-auth/providers/resend'
// import VerifyEmail from '@/emails/verify-email'
// import LoginEmail from '@/emails/login-email'
// import { ROUTES } from '@/data/public-routes'
// import { JWT } from 'next-auth/jwt'

// import type { Role } from '@/data/system-roles'

// interface DatabaseUser {
//   id: string
//   email: string | null
//   role: Role
//   name: string | null
//   emailVerified: Date | null
//   createdAt: Date
//   updatedAt: Date
//   image: string | null
// }

// declare module 'next-auth' {
//   interface Session extends DefaultSession {
//     user: {
//       id: string
//       email: string
//       role: Role
//       name: string | null
//       emailVerified: Date | null
//       image: string | null
//     }
//   }
//   interface User extends DatabaseUser {}
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string
//     email: string
//     name: string | null
//     image: string | null
//     role: Role
//     emailVerified: Date | null
//   }
// }

// const resend = new ResendClient(process.env.AUTH_RESEND_KEY)

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   // debug: process.env.NODE_ENV !== 'production',
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: '/login', error: '/error' },
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
//           subject: 'tannertanner.me',
//           // subject: user?.emailVerified
//           //   ? 'Sign in to your account'
//           //   : 'Verify your email',
//           react: user?.emailVerified
//             ? LoginEmail({ url })
//             : VerifyEmail({ url })
//         })
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         const dbUser = await db.query.users.findFirst({
//           where: and(
//             eq(users.id, sql`${user.id}::text`),
//             sql`${users.id} IS NOT NULL`
//           )
//         })

//         if (dbUser) {
//           ;(token.id = dbUser.id),
//             (token.email = dbUser.email || ''),
//             (token.role = dbUser.role),
//             (token.name = dbUser.name),
//             (token.emailVerified = dbUser.emailVerified),
//             (token.image = dbUser.image)
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (token && token.id) {
//         const dbUser = await db.query.users.findFirst({
//           where: and(
//             eq(users.id, sql`${token.id}::text`),
//             sql`${users.id} IS NOT NULL`
//           )
//         })
//         if (!dbUser) {
//           throw new Error('User not found')
//         }
//         return {
//           ...session,
//           user: {
//             id: dbUser.id,
//             email: dbUser.email || '',
//             role: dbUser.role,
//             name: dbUser.name,
//             emailVerified: dbUser.emailVerified,
//             image: dbUser.image
//           }
//         }
//       }
//       return session
//     },
//     authorized: async ({ auth, request }) => {
//       const { pathname } = request.nextUrl
//       // Allow access to public routes
//       if (ROUTES.includes(pathname)) {
//         return true
//       }
//       // Require authentication for all other routes
//       return !!auth
//     }
//   },
//   events: {
//     async createUser({ user }) {
//       if (user.id) {
//         await db
//           .update(users)
//           .set({
//             role: 'user' as Role,
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     },
//     async linkAccount({ user }) {
//       if (user.id) {
//         await db
//           .update(users)
//           .set({
//             emailVerified: new Date(),
//             updatedAt: new Date()
//           })
//           .where(
//             and(
//               eq(users.id, sql`${user.id}::text`),
//               sql`${users.id} IS NOT NULL`
//             )
//           )
//       }
//     }
//   }
// })

// @note

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
