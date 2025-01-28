import { Table } from '@/components/data-table/table'

const data = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Owner'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Admin'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'm.brown@company.com',
    role: 'Admin'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@company.com',
    role: 'Admin'
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'j.wilson@company.com',
    role: 'User'
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'l.anderson@company.com',
    role: 'User'
  },
  {
    id: 7,
    name: 'Robert Taylor',
    email: 'r.taylor@company.com',
    role: 'User'
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    email: 'j.martinez@company.com',
    role: 'User'
  },
  {
    id: 9,
    name: 'William Lee',
    email: 'w.lee@company.com',
    role: 'User'
  },
  {
    id: 10,
    name: 'Patricia Clark',
    email: 'p.clark@company.com',
    role: 'User'
  },
  {
    id: 11,
    name: 'David Rodriguez',
    email: 'd.rodriguez@company.com',
    role: 'User'
  },
  {
    id: 12,
    name: 'Elizabeth White',
    email: 'e.white@company.com',
    role: 'User'
  }
]

export default function Page() {
  return (
    <div className='flex h-screen'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl px-4'>
          <Table data={data} />
        </div>
      </div>
    </div>
  )
}

// import Link from 'next/link'
// import { IconPaw } from '@tabler/icons-react'
// import { auth } from '@/lib/auth'
// import { Menu } from '@/components/menu'

// export default async function Page() {
//   const session = await auth()

//   return (
//     <div className='flex h-screen'>
//       <div className='flex min-w-0 flex-1 flex-col'>
//         <div className='mx-auto w-full max-w-5xl'>
//           {session ? (
//             <div className='mb-8 flex flex-col items-center px-4'>
//               <Menu id={session.user.id} />
//             </div>
//           ) : (
//             <div className='flex flex-col items-center py-12'>
//               <Link
//                 href='/login'
//                 className='flex items-center gap-2 self-center font-medium'
//               >
//                 <IconPaw className='h-12 w-12' aria-hidden='true' />
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
