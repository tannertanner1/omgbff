import Link from 'next/link'
import { redirect } from 'next/navigation'
import { IconCirclePlus } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/abac'
import { getUserOrganizations } from '@/db/queries'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'

export default async function Page({
  params: paramsPromise,
  searchParams
}: {
  params: Promise<{ userId: string }>
  searchParams: { query?: string }
}) {
  const [session, params] = await Promise.all([auth(), paramsPromise])
  if (!session) {
    redirect('/login')
  }

  const { userId } = params
  if (session.user.id !== userId) {
    redirect(`/${session.user.id}/organizations`)
  }

  const userOrganizations = await getUserOrganizations()
  const organizations = userOrganizations.map(uo => ({
    ...uo.organization,
    userId
  }))

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Organizations</h1>
          {hasPermission(session.user, 'organizations', 'create') && (
            <Link href={`/${userId}/organizations/new`}>
              <IconCirclePlus className='h-6 w-6' />
            </Link>
          )}
        </div>

        <DataTable
          columns={columns}
          data={organizations}
          filterColumn='name'
          filterPlaceholder='Filter organizations...'
        />
      </div>
    </div>
  )
}
