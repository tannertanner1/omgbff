import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { IconCirclePlus } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/abac'
import { getUserOrganizations } from '@/db/queries'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const userId = params.userId as string

  if (session.user.id !== userId) {
    redirect(`/${session.user.id}/organizations`)
  }

  if (!hasPermission(session.user, 'organizations', 'view')) {
    return <div>You don&apos;t have permission to view organizations.</div>
  }

  const userOrganizations = await getUserOrganizations()

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Organizations</h1>
        {hasPermission(session.user, 'organizations', 'create') && (
          <Button asChild>
            <Link
              href={`/${userId}/organizations/new`}
              className='flex items-center hover:bg-transparent'
            >
              <IconCirclePlus className='h-4 w-4' />
            </Link>
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={userOrganizations.map(uo => ({
          ...uo.organization,
          userId
        }))}
        filterColumn='name'
      />
    </div>
  )
}
