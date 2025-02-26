import Link from 'next/link'
import { IconPaw } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { Menu } from '@/components/menu'
import { Heatmap } from '@/components/heatmap'
import { Tabs } from '@/components/tabs'

const tabs = [
  {
    title: 'Customers',
    content: (
      <div>
        <h2 className='mb-2 text-xl font-semibold'>Customers</h2>
        <p>
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit...
        </p>
      </div>
    )
  },
  {
    title: 'Invoices',
    content: (
      <div>
        <h2 className='mb-2 text-xl font-semibold'>Invoices</h2>
        <p>Lorem ipsum dolor sit amet...</p>
      </div>
    )
  }
]

export default async function Page() {
  const session = await auth()

  return (
    <div className='flex h-fit'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl'>
          {session ? (
            <div className='mb-8 flex flex-col items-center px-4'>
              <Menu />
            </div>
          ) : (
            <div className='flex flex-col items-center py-12'>
              {/* <Link
                href='/login'
                className='flex items-center gap-2 self-center font-medium'
              >
                <IconPaw className='h-12 w-12' aria-hidden='true' />
              </Link> */}
              <Heatmap />
              {/* <Tabs tabs={tabs} /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
