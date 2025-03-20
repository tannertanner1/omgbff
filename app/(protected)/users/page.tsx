import { notFound, redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { hasPermission, type User } from '@/lib/abac'
import { Component } from './component'
import { getAllUsers } from '@/db/queries'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'users', 'view')) {
    redirect('/')
  }
  if (user.role !== 'admin' && user.role !== 'owner') {
    notFound()
  }

  const usersData = await getAllUsers()

  const users =
    usersData?.map(userData => {
      // Access the invitation data using type assertion
      // TypeScript doesn't know about invitations but it's in the data
      const rawUserData = userData as any
      const invitation = rawUserData.invitations?.[0]

      // Extract the inviter's name or email
      const invitedBy = invitation?.user?.name || invitation?.user?.email || ''

      return {
        ...userData,
        email: userData.email || '',
        name: userData.name || '',
        createdAt:
          userData.createdAt instanceof Date
            ? userData.createdAt
            : new Date(userData.createdAt),
        updatedAt:
          userData.updatedAt instanceof Date
            ? userData.updatedAt
            : new Date(userData.updatedAt),
        emailVerified:
          userData.emailVerified instanceof Date
            ? userData.emailVerified
            : userData.emailVerified
              ? new Date(userData.emailVerified)
              : null,
        invitedBy
      } as User
    }) || []

  return <Component users={users} userId={user.id} />
}
