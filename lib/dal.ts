'use server'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

const verifySession = cache(async () => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/signin')
  }

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

  if (!user || user.length === 0) {
    redirect('/signin')
  }

  return { isAuth: true, user: user[0] }
})

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

export { verifySession, getUser }

/**
 * @see https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal
 * We recommend creating a DAL to centralize your data requests and authorization logic.
 * Create a separate file for your DAL that includes a verifySession() function. Then use React's cache API to memoize the return value of the function during a React render pass.
 * You can then invoke the verifySession() function in your data requests, Server Actions, Route Handlers.
 */
