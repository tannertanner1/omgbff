'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { IconBuilding, IconCirclePlus } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'

import { createOrganization } from './actions'
import { ActionResponse } from './types'

function Create({ userId }: { userId: string }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size='sm' className='flex items-center gap-2'>
            <IconCirclePlus className='h-4 w-4' />
            <span className='sr-only'>Add</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <Form userId={userId} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button size='sm' className='flex items-center gap-2'>
          <IconCirclePlus className='h-4 w-4' />
          <span className='sr-only'>Add</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Organization</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <Form userId={userId} onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function Read({
  organizations,
  userId
}: {
  organizations: Array<{
    id: string
    name: string
    createdAt: Date
  }>
  userId: string
}) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Organizations</h1>
        <Create userId={userId} />
      </div>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map(organization => (
              <TableRow key={organization.id}>
                <TableCell className='font-medium'>
                  <Link
                    href={`/${userId}/${organization.id}`}
                    className='flex items-center gap-2 hover:underline'
                  >
                    <IconBuilding className='h-4 w-4' />
                    {organization.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(organization.createdAt), {
                    addSuffix: true
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function Form({
  userId,
  onSuccess
}: {
  userId: string
  onSuccess: () => void
}) {
  const router = useRouter()
  const initialState: ActionResponse = {
    success: false,
    message: '',
    errors: undefined,
    inputs: { name: '' }
  }
  const [state, action, isPending] = React.useActionState(
    createOrganization,
    initialState
  )

  React.useEffect(() => {
    if (state?.success && state.organizationId) {
      onSuccess()
      router.push(`/${userId}/${state.organizationId}`)
    }
  }, [state, router, userId, onSuccess])

  return (
    <Card className='w-full max-w-sm border-0'>
      <form action={action}>
        <CardContent className='flex flex-col gap-6'>
          <div className='grid gap-2'>
            <Label
              htmlFor='name'
              className="after:ml-0.5 after:text-[#DB4437] after:content-['*']"
            >
              Organization Name
            </Label>
            <Input
              id='name'
              name='name'
              aria-describedby='name-error'
              className={state?.errors?.name ? 'border-[#DB4437]' : 'mb-7'}
              defaultValue={state?.inputs?.name}
            />
            {state?.errors?.name && (
              <p id='name-error' className='text-sm text-[#DB4437]'>
                {state.errors.name[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button
            type='submit'
            variant='outline'
            className='w-full'
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending ? (
              <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
            ) : (
              'Create'
            )}
          </Button>
        </CardFooter>
      </form>
      {state?.message && (
        <Alert
          className={cn(
            'w-full',
            state.success
              ? 'border-[#0F9D58] text-[#0F9D58]'
              : 'border-[#DB4437] text-[#DB4437]'
          )}
        >
          <div className='flex items-start gap-2'>
            {state.success ? (
              <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
            ) : (
              <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
            )}
            <AlertDescription
              className={cn(
                'w-full',
                state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
              )}
            >
              {state.message}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </Card>
  )
}

export { Create, Read, Form }

// @note warning

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog'
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger
// } from '@/components/ui/drawer'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { IconBuilding, IconCirclePlus } from '@tabler/icons-react'
// import { formatDistanceToNow } from 'date-fns'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { cn } from '@/lib/utils'
// import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'

// import { createOrganization } from './actions'
// import { ActionResponse } from './types'

// export function Read({
//   organizations,
//   userId
// }: {
//   organizations: Array<{
//     id: string
//     name: string
//     createdAt: Date
//   }>
//   userId: string
// }) {
//   const [open, setOpen] = React.useState(false)

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-xl font-semibold'>Organizations</h1>
//         <Button
//           size='sm'
//           className='flex items-center gap-2'
//           onClick={() => setOpen(true)}
//         >
//           <IconCirclePlus className='h-4 w-4' />
//           <span className='sr-only'>Add</span>
//         </Button>
//       </div>
//       <div className='rounded-lg border'>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Created</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {organizations.map(organization => (
//               <TableRow key={organization.id}>
//                 <TableCell className='font-medium'>
//                   <Link
//                     href={`/${userId}/${organization.id}`}
//                     className='flex items-center gap-2 hover:underline'
//                   >
//                     <IconBuilding className='h-4 w-4' />
//                     {organization.name}
//                   </Link>
//                 </TableCell>
//                 <TableCell>
//                   {formatDistanceToNow(new Date(organization.createdAt), {
//                     addSuffix: true
//                   })}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       <Create open={open} setOpen={setOpen} userId={userId} />
//     </div>
//   )
// }

// export function Create({
//   open,
//   setOpen,
//   userId
// }: {
//   open: boolean
//   setOpen: (open: boolean) => void
//   userId: string
// }) {
//   const isDesktop = useMediaQuery('(min-width: 768px)')

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Organization</DialogTitle>
//           </DialogHeader>
//           <Form userId={userId} />
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Organization</DrawerTitle>
//         </DrawerHeader>
//         <div className='p-4'>
//           <Form userId={userId} />
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// function Form({
//   className,
//   userId
// }: React.ComponentProps<typeof Card> & { userId: string }) {
//   const router = useRouter()
//   const initialState: ActionResponse = {
//     success: false,
//     message: '',
//     errors: undefined,
//     inputs: { name: '' }
//   }
//   const [state, action, isPending] = React.useActionState(
//     createOrganization,
//     initialState
//   )

//   React.useEffect(() => {
//     if (state?.success && state.organizationId) {
//       router.push(`/${userId}/${state.organizationId}`)
//     }
//   }, [state, router, userId])

//   return (
//     <div className={cn('w-full max-w-sm')}>
//       <Card className={cn('w-full max-w-sm border-0', className)}>
//         <CardHeader className='-mt-8'>
//           <CardTitle></CardTitle>
//           <CardDescription></CardDescription>
//         </CardHeader>
//         <form action={action}>
//           <CardContent className='flex flex-col gap-6'>
//             <div className='grid gap-2'>
//               <Label
//                 htmlFor='name'
//                 className="after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//               >
//                 Organization
//               </Label>
//               <Input
//                 id='name'
//                 name='name'
//                 aria-describedby='name-error'
//                 className={state?.errors?.name ? 'border-[#DB4437]' : 'mb-7'}
//                 defaultValue={state?.inputs?.name}
//               />
//               {state?.errors?.name && (
//                 <p id='name-error' className='text-sm text-[#DB4437]'>
//                   {state.errors.name[0]}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter className='flex flex-col gap-4'>
//             <Button
//               type='submit'
//               variant='outline'
//               className='w-full'
//               disabled={isPending}
//               aria-disabled={isPending}
//             >
//               {isPending ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Create'
//               )}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//       {state?.message && (
//         <div className='mx-auto mt-7 w-full max-w-sm px-6'>
//           <Alert
//             className={cn(
//               'w-full',
//               state.success
//                 ? 'border-[#0F9D58] text-[#0F9D58]'
//                 : 'border-[#DB4437] text-[#DB4437]'
//             )}
//           >
//             <div className='flex items-start gap-2'>
//               {state.success ? (
//                 <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
//               ) : (
//                 <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
//               )}
//               <AlertDescription
//                 className={cn(
//                   'w-full',
//                   state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
//                 )}
//               >
//                 {state.message}
//               </AlertDescription>
//             </div>
//           </Alert>
//         </div>
//       )}
//     </div>
//   )
// }
