import { Nav } from '@/components/nav'
import { ThemeToggle } from '@/components/theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen px-2'>
      {/* Side nav */}
      <div className='hidden w-[16rem] flex-col lg:flex'>
        <div className='flex h-14 items-center px-4 pt-2'>
          <h2 className='flex items-center gap-2 text-lg font-semibold'>
            <Fish className='h-8 w-8' /> <span>OMGBFF</span>
          </h2>
        </div>
        <div className='relative flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
          {/* Vertical top */}
          <div className='pointer-events-none absolute left-0 top-0 z-20 h-8 w-full bg-gradient-to-b from-background to-transparent' />
          {/* Vertical bottom */}
          <div className='pointer-events-none absolute bottom-0 left-0 z-20 h-8 w-full bg-gradient-to-t from-background to-transparent' />
          <div className='scrollbar-none flex-1 overflow-y-auto'>
            <Nav />
          </div>
        </div>
      </div>
      {/* Top nav */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex h-14 items-center justify-between'>
          <div className='relative flex flex-1 items-center overflow-x-auto pt-2'>
            <h2 className='flex shrink-0 items-center gap-2 px-4 text-lg font-semibold lg:hidden'>
              <Fish className='h-8 w-8' />
            </h2>
            {/* Horizontal left */}
            <div className='pointer-events-none absolute left-[4rem] top-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent lg:hidden' />
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

function Fish(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571' />
      <path d='M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504' />
      <path d='M18 11v.01' />
      <path d='M11.5 10.5c-.667 1 -.667 2 0 3' />
    </svg>
  )
}
