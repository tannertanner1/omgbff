import { db } from "@/db"
import {
  accounts,
  invitations,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema/users"
import InviteEmail from "@/emails/invite-email"
import LoginEmail from "@/emails/login-email"
import VerifyEmail from "@/emails/verify-email"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { and, eq, gt, sql } from "drizzle-orm"
import NextAuth, { type DefaultSession } from "next-auth"
// Database adapter
import type { Adapter } from "next-auth/adapters"
// Session strategy
import { JWT } from "next-auth/jwt"
import Resend from "next-auth/providers/resend"
// Auth provider
import { Resend as ResendClient } from "resend"
import { DOMAIN, ROUTES } from "@/data/public-routes"
import type { Role } from "@/data/system-roles"

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
declare module "next-auth" {
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

declare module "next-auth/jwt" {
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
  pages: { signIn: "/login", error: "/error" },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_RESEND_EMAIL,
      async sendVerificationRequest({ identifier: email, url }) {
        console.log("Sending verification request to:", email)
        console.log("URL:", url)

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        })

        console.log("User found:", user ? "Yes" : "No")

        // If user exists and has pending status, update to active
        if (user && user.status === "pending") {
          await db
            .update(users)
            .set({
              status: "active",
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
        }

        // Check if this is an invitation by looking for a recent invitation record
        const invitation = await db.query.invitations.findFirst({
          where: and(
            eq(invitations.email, email),
            // Only consider non-expired invitations
            gt(invitations.expiresAt, new Date())
          ),
          with: {
            user: true, // Get inviter details
          },
          orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
        })

        const isInvitation = invitation !== undefined && invitation !== null
        console.log("Is invitation:", isInvitation ? "Yes" : "No")

        let subject = DOMAIN
        let emailTemplate

        if (isInvitation && invitation) {
          // Set subject with inviter's email
          subject = `Invitation from ${invitation.user?.email || DOMAIN}`

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
            react: emailTemplate,
          })
          console.log("Email sent successfully")
        } catch (error) {
          console.error("Error sending email:", error)
          throw new Error("Failed to send verification email")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: and(
            eq(users.id, sql`${user.id}::text`),
            sql`${users.id} IS NOT NULL`
          ),
        })

        if (dbUser) {
          ;(token.id = dbUser.id),
            (token.email = dbUser.email || ""),
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
          ),
        })
        if (!dbUser) {
          console.error(`User ${token.id} not found`)
          // Return a minimal session instead of throwing an error
          return {
            ...session,
            user: {
              id: token.id,
              email: token.email || "",
              role: "user",
              name: token.name,
              emailVerified: token.emailVerified,
              image: token.image,
            },
          }
        }

        // If user has pending status, update to active
        if (dbUser.status === "pending") {
          await db
            .update(users)
            .set({
              status: "active",
              updatedAt: new Date(),
            })
            .where(eq(users.id, dbUser.id))

          // Update the dbUser object to reflect the change
          dbUser.status = "active"
        }

        // Check if there are any pending invitations for this user and delete them
        // This ensures that once a user logs in, they won't be treated as having pending invitations
        if (dbUser.email) {
          try {
            await db
              .delete(invitations)
              .where(eq(invitations.email, dbUser.email))
            console.log(
              "Deleted any pending invitations for user:",
              dbUser.email
            )
          } catch (error) {
            console.error("Error deleting invitations:", error)
          }
        }

        return {
          ...session,
          user: {
            id: dbUser.id,
            email: dbUser.email || "",
            role: dbUser.role,
            name: dbUser.name,
            emailVerified: dbUser.emailVerified,
            image: dbUser.image,
          },
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
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        await db
          .update(users)
          .set({
            role: "user" as Role,
            updatedAt: new Date(),
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
            status: "active",
            updatedAt: new Date(),
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
      if (user.id && user.email) {
        // Update user status to active when they sign in
        await db
          .update(users)
          .set({
            status: "active",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(users.id, sql`${user.id}::text`),
              sql`${users.id} IS NOT NULL`
            )
          )

        // Delete any invitations for this user when they sign in
        // This ensures that once a user accepts an invitation, they won't receive invitation emails again
        try {
          await db.delete(invitations).where(eq(invitations.email, user.email))
          console.log("Deleted invitations for user on sign in:", user.email)
        } catch (error) {
          console.error("Error deleting invitations on sign in:", error)
        }
      }
    },
  },
})
