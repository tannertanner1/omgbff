import { cache } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import type { User } from '@/lib/abac'

export const verifySession = cache(async (): Promise<User> => {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session.user as User
})

/** @see https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal */
