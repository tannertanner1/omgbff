// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { IconLoader } from '@tabler/icons-react'

// import { schema } from './schema'
// import { createAction } from './actions'
// import type { ActionResponse } from './types'

// export function CreateForm({ userId }: { userId: string }) {
//   const router = useRouter()
//   const [isPending, setPending] = useState(false)
//   const [actionResponse, setActionResponse] = useState<ActionResponse | null>(
//     null
//   )

//   const form = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       name: ''
//     }
//   })

//   async function onSubmit(data: { name: string }) {
//     setPending(true)
//     try {
//       const formData = new FormData()
//       formData.append('name', data.name)
//       const result = await createAction(userId, null, formData)
//       setActionResponse(result)
//       if (result.success) {
//         router.refresh()
//         router.push(`/${userId}/organizations`)
//       } else {
//         // Handle error
//         console.error(result.message)
//         form.setError('name', { type: 'manual', message: result.message })
//       }
//     } catch (error) {
//       console.error('Failed to create organization:', error)
//       setActionResponse({
//         success: false,
//         message: 'An unexpected error occurred. Please try again.'
//       })
//     } finally {
//       setPending(false)
//     }
//   }

//   return (
//     <div className='space-y-6'>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
//           <FormField
//             control={form.control}
//             name='name'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type='submit' className='w-full' disabled={isPending}>
//             {isPending ? (
//               <IconLoader className='mr-2 h-4 w-4 animate-spin' />
//             ) : (
//               'Create'
//             )}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   )
// }
