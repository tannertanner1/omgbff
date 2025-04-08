import { auth } from '@/lib/auth'
import { Menu } from '@/components/menu'
// import Link from 'next/link'
// import { IconPaw } from '@tabler/icons-react'

import { ThemeSelector } from '@/components/theme-selector'
import { ModeSwitcher } from '@/components/mode-switcher'
import { Landing } from '@/components/landing'

export default async function Page() {
  const session = await auth()

  return (
    // <div className='flex h-fit'>
    //   <div className='flex min-w-0 flex-1 flex-col'>
    //     <div className='mx-auto w-full max-w-5xl'>
    //       {session ? (
    //         <div className='mb-8 flex flex-col items-center px-4'>
    //           {/* <Menu /> */}
    //           <Menu user={session.user} />
    //         </div>
    //       ) : (
    //         <div className='flex flex-col items-center py-12'>
    //           {/* <Link
    //             href='/login'
    //             className='flex items-center gap-2 self-center font-medium'
    //           >
    //             <IconPaw className='h-12 w-12' aria-hidden='true' />
    //           </Link> */}
    //           <Heatmap />
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <>
      <div className='relative min-h-screen'>
        <div className='inset-ring-background inset-ring relative flex min-h-screen flex-col'>
          <header className='sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b bg-background'>
            <div className='flex h-14 w-full items-center gap-2 px-4'>
              {/* <SidebarTrigger className="-ml-1.5" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <NavHeader /> */}
              <div className='ml-auto flex items-center gap-2'>
                <ThemeSelector />
                <ModeSwitcher />
                {/* <Themes /> */}
              </div>
            </div>
          </header>
          <main className='container mx-auto w-full max-w-5xl flex-grow px-6'>
            {/* <div className='py-10'>
              <div className='space-y-32'>
                <Landing />
              </div>
            </div> */}
            {session ? (
              <div className='mb-8 flex flex-col items-center px-4'>
                {/* <Menu /> */}
                <Menu user={session.user} />
              </div>
            ) : (
              <div className='flex flex-col items-center py-12'>
                {/* <Link
                href='/login'
                className='flex items-center gap-2 self-center font-medium'
              >
                <IconPaw className='h-12 w-12' aria-hidden='true' />
              </Link> */}
                <div className='space-y-32'>
                  <Landing />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
