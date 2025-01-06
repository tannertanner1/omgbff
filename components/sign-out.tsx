import { signOut } from '@/lib/auth'

export default function SignOut() {
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
