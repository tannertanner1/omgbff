import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'

export async function Auth() {
  const session = await auth()

  async function logout() {
    'use server'
    await signOut({ redirectTo: '/' })
  }

  return (
    <>
      {!session ? (
        <Link href='/login' prefetch={false}>
          Sign in
        </Link>
      ) : (
        <form action={logout}>
          <button type='submit'>Sign out</button>
        </form>
      )}
    </>
  )
}

/**

import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'

async function Auth() {
  const session = await auth()

  return (
    <>
      {!session ? (
        <Link href='/login' prefetch={false}>
          Sign in
        </Link>
      ) : (
        <Component />
      )}
    </>
  )
}

export { Auth }

function Component() {
  return (
    <form
      action={async (formData: FormData) => {
        'use server'
        await signOut()
      }}
    >
      <button type='submit'>Sign out</button>
    </form>
  )
}

*/
