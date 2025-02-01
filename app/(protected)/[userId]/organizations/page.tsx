import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserOrganizations } from '@/db/queries'
import { Component } from './component'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
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

  return <Component organizations={organizations} userId={userId} />
}

// import type React from 'react'
// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'
// import { getUserOrganizations } from '@/db/queries'
// import { Table } from '@/components/data-table/table'
// import { Button } from '@/components/ui/button'
// import { IconPlus } from '@tabler/icons-react'
// import { getColumns, type Organization } from './columns'

// export default async function Page({
//   params,
//   children
// }: {
//   params: { userId: string }
//   children: React.ReactNode
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const { userId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   const userOrganizations = await getUserOrganizations()
//   const organizations: Organization[] = userOrganizations.map(uo => ({
//     ...uo.organization,
//     userId
//   }))

//   const columns = getColumns(userId, { refresh: () => {} })

//   return (
//     <div className='min-h-screen'>
//       <div className='mx-auto max-w-5xl p-4'>
//         <div className='mb-8 flex items-center justify-between'>
//           <h1 className='text-2xl font-semibold'>Organizations</h1>
//           <Link href={`/${userId}/organizations/new`} passHref>
//             <Button>
//               <IconPlus className='mr-2 h-4 w-4' />
//               Create Organization
//             </Button>
//           </Link>
//         </div>
//         <Table
//           data={organizations}
//           columns={columns}
//           link={row => `/${userId}/organizations/${row.id}`}
//         />
//       </div>
//       {children}
//     </div>
//   )
// }
