import { redirect } from 'next/navigation'
import { getAllOrganizations } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'organizations', 'view')) {
    redirect('/')
  }

  const organizationsData = await getAllOrganizations()

  const organizations = organizationsData.map(organization => ({
    ...organization,
    userId: user.id,
    createdAt:
      organization.createdAt instanceof Date
        ? organization.createdAt.toISOString()
        : organization.createdAt,
    updatedAt:
      organization.updatedAt instanceof Date
        ? organization.updatedAt.toISOString()
        : organization.updatedAt
  }))

  return <Component organizations={organizations} userId={user.id} />
}
