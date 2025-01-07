import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

// TypeScript module augmentation
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: string
      emailVerified?: Date | null
    } & DefaultSession['user']
  }
  interface User {
    id?: string
    role?: string
    emailVerified?: Date | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // OpenID Connect claims
    idToken?: string
    role?: string
    emailVerified?: Date | null
  }
}
