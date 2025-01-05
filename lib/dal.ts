'use server'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

const getUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null

  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .execute()

    return user[0] || null
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
})

const verifySession = cache(async () => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/signin')
  }

  const user = await getUser()

  if (!user) {
    redirect('/signin')
  }

  return { isAuth: true, user }
})

export { getUser, verifySession }

/** @see https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal */
