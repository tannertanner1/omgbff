import { auth } from '@/lib/auth'
import { Menu } from '@/components/menu'

import { Header } from '@/components/header'
import { Landing } from '@/components/landing'

export default async function Page() {
  const session = await auth()

  return (
    <>
      <div className='relative min-h-screen'>
        <div className='inset-ring-background inset-ring relative flex min-h-screen flex-col'>
          <Header />
          <main className='container mx-auto w-full max-w-5xl grow px-6'>
            <div className='py-10'>
              <div className='space-y-32'>
                <Landing />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
