import Link from 'next/link'
import { redirect } from 'next/navigation'
import { IconCat } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { Form, type Field } from '@/components/form'
import { login } from './actions'

export default async function Page() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  const fields: Field[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true
    }
  ]

  return (
    <>
      <div className='mt-12 flex h-fit flex-col items-center gap-2'>
        <Link href='/' className='flex flex-col items-center gap-2 font-medium'>
          <div className='flex items-center justify-center rounded-md'>
            <IconCat className='h-12 w-12' />
          </div>
          <span className='sr-only'>OMG BFF</span>
        </Link>
        <h1 className='mb-2 text-2xl font-bold'>Welcome</h1>
      </div>
      <Form fields={fields} action={login} button='Continue' />
      {/* <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        By clicking continue, you agree to our
        <a href='#'>Terms of Service</a>{' '}and <a href='#'>Privacy Policy</a>.
      </div> */}
      <div className='container mx-auto mt-7 text-balance text-center text-xs text-muted-foreground'>
        <div>By clicking continue, you agree to our</div>
        <div>
          <Link
            href='/terms'
            className='relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:bg-muted-foreground after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/privacy'
            className='relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:bg-muted-foreground after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0'
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </>
  )
}

/**
 * @see https://ui.shadcn.com/blocks/authentication#login-05
 * @see https://v0.dev/chat/CiFWYqPHKvT?b=b_0...&f=0
 * @see https://nextjs.org/docs/app/building-your-application/routing/redirecting
 */
