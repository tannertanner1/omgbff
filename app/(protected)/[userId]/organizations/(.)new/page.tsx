import { Form } from '@/components/form'
import { createAction } from '../actions'

export default function Page() {
  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}

// import { Form } from '@/components/form'
// import { createAction } from '../actions'

// const fields = [
//   {
//     name: 'name',
//     label: 'Name',
//     type: 'text' as const,
//     required: true
//   }
// ]

// export default function Page() {
//   return <Form fields={fields} action={createAction} button='Create' />
// }

// "use client"

// import { Form } from "@/components/form"
// import { createAction } from "../actions"
// import { Back } from "@/components/back"
// import { IconX } from "@tabler/icons-react"
// import { useMediaQuery } from "@/hooks/use-media-query"
// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { Drawer, DrawerContent } from "@/components/ui/drawer"

// const fields = [
//   {
//     name: "name",
//     label: "Name",
//     type: "text" as const,
//     required: true,
//   },
// ]

// export default function Page() {
//   const isDesktop = useMediaQuery("(min-width: 768px)")

//   const FormContent = (
//     <div className="relative">
//       <Back className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
//         <IconX className="h-4 w-4" />
//         <span className="sr-only">Close</span>
//       </Back>
//       <Form fields={fields} action={createAction} button="Create" />
//     </div>
//   )

//   if (isDesktop) {
//     return (
//       <Dialog defaultOpen>
//         <DialogContent className="sm:max-w-[425px]">{FormContent}</DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer defaultOpen>
//       <DrawerContent>{FormContent}</DrawerContent>
//     </Drawer>
//   )
// }

// import { Form } from '@/components/form'
// import { createAction } from '../actions'

// const fields = [
//   {
//     name: 'name',
//     label: 'Name',
//     type: 'text' as const,
//     required: true
//   }
// ]

// export default function Page() {
//   return (
//     <div className='min-h-screen'>
//       <div className='mx-auto w-full max-w-5xl'>
//         <Form fields={fields} action={createAction} button='Create' />
//       </div>
//     </div>
//   )
// }

// import { Form } from '@/components/form'
// import { createAction } from '../actions'

// const fields = [
//   {
//     name: 'name',
//     label: 'Name',
//     type: 'text' as const,
//     required: true
//   }
// ]

// export default function Page() {
//   return <Form fields={fields} action={createAction} button='Create' />
// }

/**
import { Form } from '@/components/form'
import { createAction } from '@/app/(protected)/[userId]/organizations/actions'

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true
  }
]

export default function Page() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-5xl'>
        <Form fields={fields} action={createAction} button='Create' />
      </div>
    </div>
  )
}
*/
