import { auth } from '@/lib/auth'
import { Header } from '@/components/header'
import { LoginForm } from './form'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  return (
    <main className='mx-auto w-full max-w-5xl flex-grow'>
      <Header />
      <div className='container flex flex-col items-center py-12'>
        {!session ? <LoginForm /> : redirect('/dashboard')}
      </div>
    </main>
  )
}
