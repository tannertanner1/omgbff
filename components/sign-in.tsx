import { signIn } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SignIn() {
  return (
    <form
      action={async (formData: FormData) => {
        'use server'
        await signIn()
      }}
    >
      <Input
        className={cn('bg-background p-2')}
        type='text'
        name='email'
        placeholder='Email'
      />
      <button className='mt-2' type='submit'>
        Continue
      </button>
    </form>
  )
}
