import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Menu } from '@/components/menu'

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.id) {
    redirect(`/${session.user.id}`)
  }

  return (
    <div className='flex h-screen'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl'>
          <div className='mb-8 flex flex-col items-center px-4'>
            <Menu />
          </div>
        </div>
      </div>
    </div>
  )
}
