import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { IconBuilding } from '@tabler/icons-react'
import { users, organizations } from '@/db/schema/users'
import { Create, Read } from './component'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.userId) {
    redirect(`/${session.user.id}`)
  }

  // Get user's organizations
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, params.userId))
    .limit(1)

  if (!user) {
    redirect('/login')
  }

  const userOrganizations = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, user.organizationId as string))

  return (
    <main className='mx-auto w-full max-w-5xl p-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Organizations</h1>
        <Create userId={params.userId} />
      </div>
      {userOrganizations.length === 0 ? (
        <div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50'>
          <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
              <IconBuilding className='h-10 w-10' />
            </div>
            <h2 className='mt-6 text-xl font-semibold'>No Organizations</h2>
            <p className='mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground'>
              You haven&apos;t created any organizations yet. Create your first
              organization to start managing invoices.
            </p>
            <Create userId={params.userId} />
          </div>
        </div>
      ) : (
        <Read organizations={userOrganizations} userId={params.userId} />
      )}
    </main>
  )
}

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
