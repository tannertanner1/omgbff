'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AuthButton({
  session,
  logout
}: {
  session: boolean
  logout: () => Promise<void>
}) {
  const pathname = usePathname()

  if (session) {
    return (
      <form action={logout}>
        <button type='submit'>Sign out</button>
      </form>
    )
  }

  if (pathname === '/login') {
    return null
  }

  return (
    <Link href='/login' prefetch={false}>
      Sign in
    </Link>
  )
}
