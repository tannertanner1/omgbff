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

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/dashboard')

  return (
    <div className='w-full flex-grow'>
      <div className='flex w-full flex-col items-center py-2'>
        <div className='flex items-center gap-2 self-center'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Create Invoice</CardTitle>
              {/* <CardDescription></CardDescription> */}
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Billing Name
                </label>
                <Input className='mt-2' placeholder='' />
              </div>
              <div>
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Billing Email
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
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
