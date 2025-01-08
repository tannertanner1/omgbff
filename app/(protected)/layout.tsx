import { IconFish } from '@tabler/icons-react'
import { Nav } from '@/components/nav'
import { ThemeToggle } from '@/components/theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen px-2'>
      <div className='hidden w-[16rem] flex-col lg:flex'>
        <div className='flex h-14 items-center px-4 pt-2'>
          <h2 className='flex items-center gap-2 text-lg font-semibold'>
            <IconFish className='h-8 w-8' /> <span>OMGBFF</span>
          </h2>
        </div>
        <div className='relative flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden'>
          {/* Vertical top */}
          <div className='pointer-events-none absolute left-0 top-0 z-20 h-8 w-full bg-gradient-to-b from-background to-transparent' />
          {/* Vertical bottom */}
          <div className='pointer-events-none absolute bottom-0 left-0 z-20 h-8 w-full bg-gradient-to-t from-background to-transparent' />
          <div className='scrollbar-none flex-1 overflow-y-auto'>
            <Nav />
          </div>
        </div>
      </div>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex h-14 items-center justify-between'>
          <div className='relative flex flex-1 items-center overflow-x-auto pt-2'>
            <h2 className='flex shrink-0 items-center gap-2 px-4 text-lg font-semibold lg:hidden'>
              <IconFish className='h-8 w-8' />
              {/* <span>OMGBFF</span> */}
            </h2>
            {/* Horizontal left */}
            <div
              className='pointer-events-none absolute left-[4rem] top-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent lg:hidden'
              // className='pointer-events-none absolute left-[8.5rem] top-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent lg:hidden'
            />
            {/* Horizontal right */}
            <div className='pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-background to-transparent' />
            <Nav isHorizontal />
          </div>
          <div className='shrink-0 px-4 pt-3.5'>
            <ThemeToggle aria-label='Toggle theme' />
          </div>
        </div>
        <main className='mx-auto w-full max-w-[1200px] flex-1 overflow-auto px-4 py-2 lg:-ml-2'>
          {children}
        </main>
      </div>
    </div>
  )
}
