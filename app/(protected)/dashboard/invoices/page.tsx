import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/dashboard')

  return (
    <div className='min-w-sm container mx-auto w-full max-w-lg'>
      <div className='flex items-center gap-2 self-center'>
        <Card className={cn('w-full shadow-none backdrop-blur-sm')}>
          <CardHeader>
            <CardTitle>Invoice</CardTitle>
          </CardHeader>
          <CardContent className='mt-6 space-y-4'>
            <div>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Name
              </label>
              <Input
                className={cn('mt-2 w-full shadow-none focus-visible:ring-0')}
                placeholder=''
              />
            </div>
            <div>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Email
              </label>
              <Input className='mt-2' placeholder='' />
            </div>
            <div>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Value
              </label>
              <Input className='mt-2' placeholder='' />
            </div>
            <div>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Description
              </label>
              <Input className='mt-2' placeholder='' />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end gap-4'>
            <Button variant='ghost'>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
