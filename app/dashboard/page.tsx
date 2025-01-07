import { auth, signOut } from '@/lib/auth'
import { Header } from '@/components/header'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  return (
    <main className='container mx-auto w-full max-w-5xl flex-grow'>
      <Header />
      <div className='flex flex-col items-center py-12'>
        {!session ? redirect('/') : <Component />}
      </div>
    </main>
  )
}

function Component() {
  return (
    <div className='flex items-center gap-2 self-center font-medium'>
      <form
        action={async (formData: FormData) => {
          'use server'
          await signOut()
        }}
      >
        <button type='submit'>Sign out</button>
      </form>
    </div>
  )
}
