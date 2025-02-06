import { cache } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export const verifySession = cache(async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session.user
})

/** @see https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal */
