import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations, userOrganizations } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import { DataTable } from '@/components/data-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function OrganizationsPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.id) {
    redirect(`/${session.user.id}/organizations`)
  }

  const userOrgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      createdAt: organizations.createdAt,
      userId: userOrganizations.userId // Add this line
    })
    .from(organizations)
    .innerJoin(
      userOrganizations,
      eq(userOrganizations.organizationId, organizations.id)
    )
    .where(eq(userOrganizations.userId, params.id))
    .orderBy(organizations.createdAt)

  return (
    <div className='space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Organizations</h1>
        <Button asChild>
          <Link href={`/${params.id}/organizations/new`}>
            Create Organization
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={userOrgs} filterColumn='name' />
    </div>
  )
}
