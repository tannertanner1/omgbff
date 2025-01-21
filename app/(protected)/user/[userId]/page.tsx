import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { IconFolder } from '@tabler/icons-react'
import { organizations, userOrganizations } from '@/db/schema/users'
import { Create, Read } from './component'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const userId = params.userId

  // Verify the user is accessing their own page
  if (session.user.id !== userId) {
    redirect(`/${session.user.id}`)
  }

  // Get all organizations for the user using the junction table
  const userOrgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      createdAt: organizations.createdAt
    })
    .from(organizations)
    .innerJoin(
      userOrganizations,
      eq(userOrganizations.organizationId, organizations.id)
    )
    .where(eq(userOrganizations.userId, userId))
    .orderBy(organizations.createdAt)

  return (
    <main className='mx-auto w-full max-w-5xl p-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Organizations</h1>
        <Create userId={userId} />
      </div>
      {userOrgs.length === 0 ? (
        <div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50'>
          <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
              <IconFolder className='h-10 w-10' />
            </div>
            <h2 className='mt-6 text-xl font-semibold'>No Organizations</h2>
            <p className='mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground'>
              You haven&apos;t created any organizations yet. Create your first
              organization to start managing invoices.
            </p>
            <Create userId={userId} />
          </div>
        </div>
      ) : (
        <Read organizations={userOrgs} userId={userId} />
      )}
    </main>
  )
}

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { eq } from 'drizzle-orm'
// import { IconFolder } from '@tabler/icons-react'
// import { users, organizations } from '@/db/schema/users'
// import { Create, Read } from './component'
// // import { Nav } from '@/components/nav'

// export default async function Page({ params }: { params: { userId: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   // Verify the user is accessing their own page
//   if (session.user.id !== params.userId) {
//     redirect(`/${session.user.id}`)
//   }

//   // Get all organizations for the user
//   const userOrganizations = await db
//     .select({
//       id: organizations.id,
//       name: organizations.name,
//       createdAt: organizations.createdAt
//     })
//     .from(organizations)
//     .innerJoin(users, eq(users.organizationId, organizations.id))
//     .where(eq(users.id, params.userId))
//     .orderBy(organizations.createdAt)

//   // const navUser = {
//   //   email: session.user.email || '',
//   //   image: session.user.image || null
//   // }

//   return (
//     <main className='mx-auto w-full max-w-5xl p-4'>
//       {/* <Nav user={navUser} /> */}
//       <div className='mb-6 flex items-center justify-between'>
//         <h1 className='text-3xl font-semibold'>Organizations</h1>
//         <Create userId={params.userId} />
//       </div>
//       {userOrganizations.length === 0 ? (
//         <div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50'>
//           <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
//             <div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
//               <IconFolder className='h-10 w-10' />
//             </div>
//             <h2 className='mt-6 text-xl font-semibold'>No Organizations</h2>
//             <p className='mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground'>
//               You haven&apos;t created any organizations yet. Create your first
//               organization to start managing invoices.
//             </p>
//             <Create userId={params.userId} />
//           </div>
//         </div>
//       ) : (
//         <Read organizations={userOrganizations} userId={params.userId} />
//       )}
//     </main>
//   )
// }

// import { redirect } from 'next/navigation'
// import { auth } from '@/lib/auth'

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   return (
//     <div className='mx-auto w-full max-w-5xl flex-grow'>
//       <div className='flex flex-col items-center'>
//         <div className='flex items-center gap-2 self-center'></div>
//       </div>
//     </div>
//   )
// }
