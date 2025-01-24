import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  IconCirclePlus,
  IconCircleChevronLeft,
  IconDotsCircleHorizontal
} from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/abac'
import { getUserOrganizations } from '@/db/queries'
import { DataTable } from '@/components/data-table/table'
import { columns } from './columns'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const userId = params.userId

  if (session.user.id !== userId) {
    redirect(`/${session.user.id}/organizations`)
  }

  if (!hasPermission(session.user, 'organizations', 'view')) {
    return <div>You don&apos;t have permission to view organizations.</div>
  }

  const userOrganizations = await getUserOrganizations()

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/'>
              <IconCircleChevronLeft className='h-6 w-6 text-primary' />
            </Link>
            <h1 className='text-xl font-medium'>Organizations</h1>
          </div>
          <div className='flex items-center gap-2'>
            {hasPermission(session.user, 'organizations', 'create') && (
              <Link href={`/${userId}/organizations/new`}>
                <IconCirclePlus className='h-6 w-6 text-primary' />
              </Link>
            )}
            <IconDotsCircleHorizontal className='h-6 w-6 text-primary' />
          </div>
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
    </div>
  )
}
