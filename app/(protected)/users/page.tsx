import { notFound, redirect } from 'next/navigation'
import { getAllUsers } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'
import type { User } from './columns'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'users', 'view')) {
    redirect('/')
  }
  if (user.role !== 'admin' && user.role !== 'owner') {
    notFound()
  }

  const usersData = await getAllUsers()

  const users: User[] =
    usersData?.map(user => ({
      ...user,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.toISOString()
          : user.createdAt,
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt.toISOString()
          : user.updatedAt,
      email: user.email || '',
      role: user.role,
      name: user.name || ''
    })) || []

  return <Component users={users} userId={user.id} />
}
