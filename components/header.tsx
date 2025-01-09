'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme'

import { PageWrapper } from '@/components/page-wrapper'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <PageWrapper>
      <header className='flex h-20 w-full items-center justify-between rounded-full'>
        <div>
          {pathname !== '/' && pathname !== '/dashboard' ? (
            <button
              className='relative -ml-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50'
              onClick={() => router.back()}
            >
              <ChevronLeft className='mr-1 h-5 w-5' aria-hidden='true' />
              Back
            </button>
          ) : (
            <Link
              href='/'
              prefetch={false}
              className='relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50'
            >
              <Fish className='h-8 w-8' aria-hidden='true' />
            </Link>
          )}
        </div>
        <div>
          <ThemeToggle aria-label='Toggle theme' />
        </div>
      </header>
    </PageWrapper>
  )
}

export { Header }

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

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
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
      <path d='M15 6l-6 6l6 6' />
    </svg>
  )
}
