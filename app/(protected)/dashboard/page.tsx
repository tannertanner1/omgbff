import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'

export default async function Page() {
  const session = await auth()

  return (
    <main className='mx-auto w-full max-w-5xl flex-grow'>
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
