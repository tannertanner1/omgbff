import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// Initializes NextAuth with authConfig object and exports the auth property
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
