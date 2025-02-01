'use client'

import Link from 'next/link'
import { Table } from '@/components/data-table/table'
import { IconCirclePlus } from '@tabler/icons-react'
import { getColumns, type Organization } from './columns'
import { useRouter } from 'next/navigation'

export function Component({
  organizations,
  userId
}: {
  organizations: Organization[]
  userId: string
}) {
  const router = useRouter()
  const columns = getColumns(userId, { refresh: () => router.refresh() })

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-5xl p-4'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Organizations</h1>
          <Link href={`/${userId}/organizations/new`} passHref>
            <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>
        <Table
          data={organizations}
          columns={columns}
          link={row => `/${userId}/organizations/${row.id}`}
        />
      </div>
    </div>
  )
}
