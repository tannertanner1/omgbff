'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconLoader, IconCirclePlus } from '@tabler/icons-react'
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
import { useMediaQuery } from '@/hooks/use-media-query'
import { createAction } from './actions'

interface CreateOrganizationFormProps {
  userId: string
}

export function CreateOrganizationForm({
  userId
}: CreateOrganizationFormProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createAction(formData)
      if (result.success) {
        setOpen(false)
        router.refresh()
        if (result.organizationId) {
          router.push(`/${userId}/${result.organizationId}`)
        }
      }
    })
  }

  const FormContent = (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='Enter organization name'
          required
        />
      </div>
      <Button type='submit' className='w-full' disabled={isPending}>
        {isPending ? (
          <>
            <IconLoader className='mr-2 h-4 w-4 animate-spin' />
            Creating...
          </>
        ) : (
          'Create Organization'
        )}
      </Button>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <IconCirclePlus className='mr-2 h-4 w-4' />
            Create Organization
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          {FormContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <IconCirclePlus className='mr-2 h-4 w-4' />
          Create Organization
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Organization</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>{FormContent}</div>
      </DrawerContent>
    </Drawer>
  )
}

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { createAction } from './actions'
// import { IconLoader, IconPlus } from '@tabler/icons-react'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog'

// interface CreateOrganizationFormProps {
//   userId: string
// }

// export function CreateOrganizationForm({
//   userId
// }: CreateOrganizationFormProps) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [isPending, startTransition] = React.useTransition()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     startTransition(async () => {
//       const result = await createAction(formData)
//       if (result.success) {
//         setOpen(false)
//         router.refresh()
//       }
//     })
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <IconPlus className='mr-2 h-4 w-4' />
//           Create Organization
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Organization</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className='space-y-4'>
//           <div className='space-y-2'>
//             <Label htmlFor='name'>Name</Label>
//             <Input
//               id='name'
//               name='name'
//               placeholder='Enter organization name'
//               required
//             />
//           </div>
//           <Button type='submit' className='w-full' disabled={isPending}>
//             {isPending ? (
//               <>
//                 <IconLoader className='mr-2 h-4 w-4 animate-spin' />
//                 Creating...
//               </>
//             ) : (
//               'Create Organization'
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { createAction } from './actions'
// import { IconLoader, IconPlus } from '@tabler/icons-react'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog'

// interface CreateOrganizationFormProps {
//   userId: string
// }

// export function CreateOrganizationForm({
//   userId
// }: CreateOrganizationFormProps) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [isPending, startTransition] = React.useTransition()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     startTransition(async () => {
//       const result = await createAction(formData)
//       if (result.success) {
//         setOpen(false)
//         router.refresh()
//       }
//     })
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <IconPlus className='mr-2 h-4 w-4' />
//           Create Organization
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Organization</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className='space-y-4'>
//           <div className='space-y-2'>
//             <Label htmlFor='name'>Name</Label>
//             <Input
//               id='name'
//               name='name'
//               placeholder='Enter organization name'
//               required
//             />
//           </div>
//           <Button type='submit' className='w-full' disabled={isPending}>
//             {isPending ? (
//               <>
//                 <IconLoader className='mr-2 h-4 w-4 animate-spin' />
//                 Creating...
//               </>
//             ) : (
//               'Create Organization'
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
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
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import { createAction } from './actions'
// import { IconLoader } from '@tabler/icons-react'

// interface FormProps {
//   userId: string
//   children: React.ReactNode
// }

// export function Form({ userId, children }: FormProps) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [isPending, startTransition] = React.useTransition()
//   const isDesktop = useMediaQuery('(min-width: 768px)')

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     startTransition(async () => {
//       const result = await createAction(formData)
//       if (result.success) {
//         router.refresh()
//         setOpen(false)
//       }
//     })
//   }

//   const form = (
//     <form onSubmit={handleSubmit} className='space-y-4'>
//       <div className='space-y-2'>
//         <Label htmlFor='name'>Name</Label>
//         <Input
//           id='name'
//           name='name'
//           placeholder='Enter organization name'
//           required
//         />
//       </div>
//       <Button type='submit' className='w-full' disabled={isPending}>
//         {isPending ? (
//           <>
//             <IconLoader className='mr-2 h-4 w-4 animate-spin' />
//             Creating...
//           </>
//         ) : (
//           'Create Organization'
//         )}
//       </Button>
//     </form>
//   )

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>{children}</DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create Organization</DialogTitle>
//           </DialogHeader>
//           {form}
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>{children}</DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Create Organization</DrawerTitle>
//         </DrawerHeader>
//         <div className='p-4'>{form}</div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
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
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import { createAction, updateAction, deleteAction } from './actions'
// import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons-react'

// interface FormProps {
//   userId: string
//   organization?: {
//     id: string
//     name: string
//   }
// }

// export function Form({ userId, organization }: FormProps) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [isPending, startTransition] = React.useTransition()
//   const isDesktop = useMediaQuery('(min-width: 768px)')

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     startTransition(async () => {
//       if (organization) {
//         formData.append('id', organization.id)
//         await updateAction(formData)
//       } else {
//         await createAction(formData)
//       }
//       router.refresh()
//       setOpen(false)
//     })
//   }

//   const handleDelete = async () => {
//     if (!organization) return

//     startTransition(async () => {
//       const formData = new FormData()
//       formData.append('id', organization.id)
//       await deleteAction(formData)
//       router.refresh()
//       setOpen(false)
//     })
//   }

//   const title = organization ? 'Edit Organization' : 'Create Organization'
//   const buttonText = organization ? 'Update' : 'Create'

//   const trigger = organization ? (
//     <div className='flex gap-2'>
//       <Button variant='ghost' size='icon' className='h-8 w-8'>
//         <IconEdit className='h-4 w-4' />
//         <span className='sr-only'>Edit Organization</span>
//       </Button>
//       <Button
//         variant='ghost'
//         size='icon'
//         className='h-8 w-8 text-destructive'
//         onClick={e => {
//           e.stopPropagation()
//           handleDelete()
//         }}
//       >
//         <IconTrash className='h-4 w-4' />
//         <span className='sr-only'>Delete Organization</span>
//       </Button>
//     </div>
//   ) : (
//     <Button variant='outline' size='icon' className='h-9 w-9'>
//       <IconCirclePlus className='h-5 w-5' />
//       <span className='sr-only'>Create Organization</span>
//     </Button>
//   )

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>{trigger}</DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{title}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div className='space-y-2'>
//               <Label htmlFor='name'>Name</Label>
//               <Input
//                 id='name'
//                 name='name'
//                 defaultValue={organization?.name}
//                 required
//               />
//             </div>
//             <div className='flex justify-end gap-2'>
//               {organization && (
//                 <Button
//                   type='button'
//                   variant='destructive'
//                   disabled={isPending}
//                   onClick={handleDelete}
//                 >
//                   Delete
//                 </Button>
//               )}
//               <Button type='submit' disabled={isPending}>
//                 {isPending ? 'Saving...' : buttonText}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>{trigger}</DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>{title}</DrawerTitle>
//         </DrawerHeader>
//         <div className='p-4'>
//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div className='space-y-2'>
//               <Label htmlFor='name'>Name</Label>
//               <Input
//                 id='name'
//                 name='name'
//                 defaultValue={organization?.name}
//                 required
//               />
//             </div>
//             <div className='flex justify-end gap-2'>
//               {organization && (
//                 <Button
//                   type='button'
//                   variant='destructive'
//                   disabled={isPending}
//                   onClick={handleDelete}
//                 >
//                   Delete
//                 </Button>
//               )}
//               <Button type='submit' className='w-full' disabled={isPending}>
//                 {isPending ? 'Saving...' : buttonText}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
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
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import { createAction } from './actions'

// interface FormProps {
//   userId: string
//   children?: React.ReactNode
// }

// export function Form({ userId, children }: FormProps) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [isPending, startTransition] = React.useTransition()
//   const isDesktop = useMediaQuery('(min-width: 768px)')

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     startTransition(async () => {
//       await createAction(formData)
//       router.refresh()
//       setOpen(false)
//     })
//   }

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>{children}</DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create Organization</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div className='space-y-2'>
//               <Label htmlFor='name'>Name</Label>
//               <Input id='name' name='name' required />
//             </div>
//             <Button type='submit' className='w-full' disabled={isPending}>
//               {isPending ? 'Creating...' : 'Create'}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>{children}</DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Create Organization</DrawerTitle>
//         </DrawerHeader>
//         <div className='p-4'>
//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div className='space-y-2'>
//               <Label htmlFor='name'>Name</Label>
//               <Input id='name' name='name' required />
//             </div>
//             <Button type='submit' className='w-full' disabled={isPending}>
//               {isPending ? 'Creating...' : 'Create'}
//             </Button>
//           </form>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { IconPlus } from '@tabler/icons-react'
// import { createAction, updateAction } from './actions'

// export function Form({
//   userId,
//   organization
// }: {
//   userId: string
//   organization?: {
//     id: string
//     name: string
//   }
// }) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [isPending, startTransition] = React.useTransition()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     startTransition(async () => {
//       if (organization) {
//         formData.append('id', organization.id)
//         await updateAction(formData)
//       } else {
//         await createAction(formData)
//       }
//       router.refresh()
//       setOpen(false)
//     })
//   }

//   const title = organization ? 'Edit' : 'Create'

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <IconPlus className='mr-2 h-4 w-4' />
//           {organization ? 'Edit' : 'Create'}
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className='space-y-4'>
//           <div className='space-y-2'>
//             <Label htmlFor='name'>Name</Label>
//             <Input
//               id='name'
//               name='name'
//               defaultValue={organization?.name}
//               required
//             />
//           </div>
//           <Button type='submit' className='w-full' disabled={isPending}>
//             {isPending ? 'Saving...' : organization ? 'Update' : 'Create'}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
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
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import { IconPlus } from '@tabler/icons-react'
// import { createAction, updateAction } from './actions'

// export function Form({
//   userId,
//   organization
// }: {
//   userId: string
//   organization?: {
//     id: string
//     name: string
//   }
// }) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//   const [isPending, startTransition] = React.useTransition()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     startTransition(async () => {
//       if (organization) {
//         formData.append('id', organization.id)
//         await updateAction(formData)
//       } else {
//         await createAction(formData)
//       }
//       router.refresh()
//       setOpen(false)
//     })
//   }

//   const title = organization ? 'Edit' : 'Create'
//   const FormContent = (
//     <form onSubmit={handleSubmit} className='space-y-4 p-4'>
//       <div className='space-y-2'>
//         <Label htmlFor='name'>Name</Label>
//         <Input
//           id='name'
//           name='name'
//           defaultValue={organization?.name}
//           required
//         />
//       </div>
//       <Button type='submit' className='w-full' disabled={isPending}>
//         {isPending ? 'Saving...' : organization ? 'Update' : 'Create'}
//       </Button>
//     </form>
//   )

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button>
//             <IconPlus className='mr-2 h-4 w-4' />
//             {organization ? 'Edit' : 'Create'}
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{title}</DialogTitle>
//           </DialogHeader>
//           {FormContent}
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button>
//           <IconPlus className='mr-2 h-4 w-4' />
//           {organization ? 'Edit' : 'Create'}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>{title}</DrawerTitle>
//         </DrawerHeader>
//         {FormContent}
//       </DrawerContent>
//     </Drawer>
//   )
// }
