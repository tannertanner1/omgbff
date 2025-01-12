'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
import { updateInvoiceStatus, deleteInvoice } from './actions'
import type { Status } from '@/db/schema/invoices'

interface InvoiceProps {
  id: number
  status: Status
  value: number
  description: string
  customer: {
    name: string
    email: string
  }
}

export function Invoice({ invoice }: { invoice: InvoiceProps }) {
  const router = useRouter()
  const [state, updateAction] = React.useActionState(updateInvoiceStatus, {
    success: false,
    message: '',
    status: invoice.status
  })
  const [deleteState, deleteAction] = React.useActionState(deleteInvoice, {
    success: false,
    message: ''
  })

  React.useEffect(() => {
    if (state.success || deleteState.success) {
      router.refresh()
    }
  }, [state.success, deleteState.success, router])

  return (
    <div className='mx-auto w-full max-w-2xl'>
      <Card className='w-full border-0'>
        <CardContent className='pt-6'>
          <h1 className='mb-4 text-2xl font-bold'>Invoice #{invoice.id}</h1>
          <div className='grid gap-4'>
            <div>
              <strong>Status:</strong>{' '}
              <Badge
                className={cn(
                  'capitalize',
                  state.status === 'open' && 'bg-blue-500',
                  state.status === 'paid' && 'bg-green-600',
                  state.status === 'void' && 'bg-zinc-700',
                  state.status === 'uncollectible' && 'bg-red-600'
                )}
              >
                {state.status}
              </Badge>
            </div>
            <div>
              <strong>Amount:</strong> ${(invoice.value / 100).toFixed(2)}
            </div>
            <div>
              <strong>Description:</strong> {invoice.description}
            </div>
            <div>
              <strong>Customer:</strong> {invoice.customer.name}
            </div>
            <div>
              <strong>Email:</strong> {invoice.customer.email}
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <form action={updateAction} className='w-full'>
            <input type='hidden' name='invoiceId' value={invoice.id} />
            <select
              name='status'
              className='w-full rounded border p-2'
              defaultValue={invoice.status}
            >
              <option value='open'>Open</option>
              <option value='paid'>Paid</option>
              <option value='void'>Void</option>
              <option value='uncollectible'>Uncollectible</option>
            </select>
            <Button
              type='submit'
              className='mt-2 w-full'
              disabled={state.success === undefined}
            >
              {state.success === undefined ? (
                <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
              ) : (
                'Update Status'
              )}
            </Button>
          </form>
          <form action={deleteAction} className='w-full'>
            <input type='hidden' name='invoiceId' value={invoice.id} />
            <Button
              type='submit'
              variant='destructive'
              className='w-full'
              disabled={deleteState.success === undefined}
            >
              {deleteState.success === undefined ? (
                <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
              ) : (
                'Delete Invoice'
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
      {(state.message || deleteState.message) && (
        <Alert
          className={cn(
            'mt-4',
            state.success || deleteState.success
              ? 'border-[#0F9D58] text-[#0F9D58]'
              : 'border-[#DB4437] text-[#DB4437]'
          )}
        >
          <div className='flex items-start gap-2'>
            {state.success || deleteState.success ? (
              <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
            ) : (
              <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
            )}
            <AlertDescription
              className={cn(
                'w-full',
                state.success || deleteState.success
                  ? 'text-[#0F9D58]'
                  : 'text-[#DB4437]'
              )}
            >
              {state.message || deleteState.message}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  )
}

// @note SEEMS TO BE ONLY WORKING VERSION????

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Badge } from '@/components/ui/badge'
// import { cn } from '@/lib/utils'
// import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
// import { updateInvoiceStatus, deleteInvoice } from './actions'
// import { useFormState } from 'react-dom'
// import { Status } from '@/db/schema/invoices'

// interface InvoiceProps {
//   id: number
//   status: Status
//   value: number
//   description: string
//   customer: {
//     name: string
//     email: string
//   }
// }

// export function Invoice({ invoice }: { invoice: InvoiceProps }) {
//   const router = useRouter()
//   const [updateState, updateAction] = useFormState(updateInvoiceStatus, {
//     success: false,
//     message: '',
//     status: invoice.status
//   })
//   const [deleteState, deleteAction] = useFormState(deleteInvoice, {
//     success: false,
//     message: ''
//   })

//   React.useEffect(() => {
//     if (updateState.success || deleteState.success) {
//       router.refresh()
//     }
//   }, [updateState.success, deleteState.success, router])

//   return (
//     <div className='mx-auto w-full max-w-2xl'>
//       <Card className='w-full border-0'>
//         <CardContent className='pt-6'>
//           <h1 className='mb-4 text-2xl font-bold'>Invoice #{invoice.id}</h1>
//           <div className='grid gap-4'>
//             <div>
//               <strong>Status:</strong>{' '}
//               <Badge
//                 className={cn(
//                   'capitalize',
//                   updateState.status === 'open' && 'bg-blue-500',
//                   updateState.status === 'paid' && 'bg-green-600',
//                   updateState.status === 'void' && 'bg-zinc-700',
//                   updateState.status === 'uncollectible' && 'bg-red-600'
//                 )}
//               >
//                 {updateState.status}
//               </Badge>
//             </div>
//             <div>
//               <strong>Amount:</strong> ${(invoice.value / 100).toFixed(2)}
//             </div>
//             <div>
//               <strong>Description:</strong> {invoice.description}
//             </div>
//             <div>
//               <strong>Customer:</strong> {invoice.customer.name}
//             </div>
//             <div>
//               <strong>Email:</strong> {invoice.customer.email}
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className='flex flex-col gap-4'>
//           <form action={updateAction} className='w-full'>
//             <input type='hidden' name='invoiceId' value={invoice.id} />
//             <select
//               name='status'
//               className='w-full rounded border p-2'
//               defaultValue={invoice.status}
//             >
//               <option value='open'>Open</option>
//               <option value='paid'>Paid</option>
//               <option value='void'>Void</option>
//               <option value='uncollectible'>Uncollectible</option>
//             </select>
//             <Button type='submit' className='mt-2 w-full'>
//               Update Status
//             </Button>
//           </form>
//           <form action={deleteAction} className='w-full'>
//             <input type='hidden' name='invoiceId' value={invoice.id} />
//             <Button type='submit' variant='destructive' className='w-full'>
//               Delete Invoice
//             </Button>
//           </form>
//         </CardFooter>
//       </Card>
//       {(updateState.message || deleteState.message) && (
//         <Alert
//           className={cn(
//             'mt-4',
//             updateState.success || deleteState.success
//               ? 'border-[#0F9D58] text-[#0F9D58]'
//               : 'border-[#DB4437] text-[#DB4437]'
//           )}
//         >
//           <div className='flex items-start gap-2'>
//             {updateState.success || deleteState.success ? (
//               <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
//             ) : (
//               <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
//             )}
//             <AlertDescription
//               className={cn(
//                 'w-full',
//                 updateState.success || deleteState.success
//                   ? 'text-[#0F9D58]'
//                   : 'text-[#DB4437]'
//               )}
//             >
//               {updateState.message || deleteState.message}
//             </AlertDescription>
//           </div>
//         </Alert>
//       )}
//     </div>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Badge } from '@/components/ui/badge'
// import { cn } from '@/lib/utils'
// import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
// import { updateInvoiceStatus, deleteInvoice } from './actions'
// import type { invoices } from '@/db/schema/invoices'

// export function Invoice({
//   invoice
// }: {
//   invoice: typeof invoices & {
//     customer: {
//       name: string
//       email: string
//     }
//   }
// }) {
//   const router = useRouter()
//   const [state, updateAction] = React.useActionState(updateInvoiceStatus, {
//     success: false,
//     message: '',
//     status: invoice.status
//   })
//   const [deleteState, deleteAction] = React.useActionState(deleteInvoice, {
//     success: false,
//     message: ''
//   })

//   // Move state updates to an effect
//   React.useEffect(() => {
//     if (state.success || deleteState.success) {
//       router.refresh()
//     }
//   }, [state.success, deleteState.success, router])

//   return (
//     <div className='mx-auto w-full max-w-2xl'>
//       <Card className='w-full border-0'>
//         <CardContent className='pt-6'>
//           <h1 className='mb-4 text-2xl font-bold'>Invoice #{invoice.id}</h1>
//           <div className='grid gap-4'>
//             <div>
//               <strong>Status:</strong>{' '}
//               <Badge
//                 className={cn(
//                   'capitalize',
//                   state.status === 'open' && 'bg-blue-500',
//                   state.status === 'paid' && 'bg-green-600',
//                   state.status === 'void' && 'bg-zinc-700',
//                   state.status === 'uncollectible' && 'bg-red-600'
//                 )}
//               >
//                 {state.status}
//               </Badge>
//             </div>
//             <div>
//               <strong>Amount:</strong> ${(invoice.value / 100).toFixed(2)}
//             </div>
//             <div>
//               <strong>Description:</strong> {invoice.description}
//             </div>
//             <div>
//               <strong>Customer:</strong> {invoice.customer.name}
//             </div>
//             <div>
//               <strong>Email:</strong> {invoice.customer.email}
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className='flex flex-col gap-4'>
//           <form action={updateAction} className='w-full'>
//             <input type='hidden' name='invoiceId' value={invoice.id} />
//             <select
//               name='status'
//               className='w-full rounded border p-2'
//               defaultValue={invoice.status}
//             >
//               <option value='open'>Open</option>
//               <option value='paid'>Paid</option>
//               <option value='void'>Void</option>
//               <option value='uncollectible'>Uncollectible</option>
//             </select>
//             <Button
//               type='submit'
//               className='mt-2 w-full'
//               disabled={state.success === undefined}
//             >
//               {state.success === undefined ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Update Status'
//               )}
//             </Button>
//           </form>
//           <form action={deleteAction} className='w-full'>
//             <input type='hidden' name='invoiceId' value={invoice.id} />
//             <Button
//               type='submit'
//               variant='destructive'
//               className='w-full'
//               disabled={deleteState.success === undefined}
//             >
//               {deleteState.success === undefined ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Delete Invoice'
//               )}
//             </Button>
//           </form>
//         </CardFooter>
//       </Card>
//       {state.message && (
//         <Alert
//           className={cn(
//             'mt-4',
//             state.success
//               ? 'border-[#0F9D58] text-[#0F9D58]'
//               : 'border-[#DB4437] text-[#DB4437]'
//           )}
//         >
//           <div className='flex items-start gap-2'>
//             {state.success ? (
//               <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
//             ) : (
//               <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
//             )}
//             <AlertDescription
//               className={cn(
//                 'w-full',
//                 state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
//               )}
//             >
//               {state.message}
//             </AlertDescription>
//           </div>
//         </Alert>
//       )}
//     </div>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Badge } from '@/components/ui/badge'
// import { cn } from '@/lib/utils'
// import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
// import { updateInvoiceStatus, deleteInvoice } from './actions'
// import type { invoices } from '@/db/schema/invoices'

// export function Invoice({
//   invoice
// }: {
//   invoice: typeof invoices & {
//     customer: {
//       name: string
//       email: string
//     }
//   }
// }) {
//   const router = useRouter()
//   const [state, updateAction, isPendingUpdate] = React.useActionState(
//     updateInvoiceStatus,
//     {
//       success: false,
//       message: '',
//       status: invoice.status
//     }
//   )
//   const [, deleteAction, isPendingDelete] = React.useActionState(
//     deleteInvoice,
//     {
//       success: false,
//       message: ''
//     }
//   )

//   React.useEffect(() => {
//     if (state.success) {
//       router.refresh()
//     }
//   }, [state.success, router])

//   return (
//     <div className='mx-auto w-full max-w-2xl'>
//       <Card className='w-full border-0'>
//         <CardContent className='pt-6'>
//           <h1 className='mb-4 text-2xl font-bold'>Invoice #{invoice.id}</h1>
//           <div className='grid gap-4'>
//             <div>
//               <strong>Status:</strong>{' '}
//               <Badge
//                 className={cn(
//                   'capitalize',
//                   state.status === 'open' && 'bg-blue-500',
//                   state.status === 'paid' && 'bg-green-600',
//                   state.status === 'void' && 'bg-zinc-700',
//                   state.status === 'uncollectible' && 'bg-red-600'
//                 )}
//               >
//                 {state.status}
//               </Badge>
//             </div>
//             <div>
//               <strong>Amount:</strong> ${(invoices.value / 100).toFixed(2)}
//             </div>
//             <div>
//               <strong>Description:</strong> {invoices.description}
//             </div>
//             <div>
//               <strong>Customer:</strong> {invoice.customer.name}
//             </div>
//             <div>
//               <strong>Email:</strong> {invoice.customer.email}
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className='flex flex-col gap-4'>
//           <form action={updateAction} className='w-full'>
//             <input type='hidden' name='invoiceId' value={invoice.id} />
//             <select
//               name='status'
//               className='w-full rounded border p-2'
//               defaultValue={invoice.status}
//             >
//               <option value='open'>Open</option>
//               <option value='paid'>Paid</option>
//               <option value='void'>Void</option>
//               <option value='uncollectible'>Uncollectible</option>
//             </select>
//             <Button
//               type='submit'
//               className='mt-2 w-full'
//               disabled={isPendingUpdate}
//               aria-disabled={isPendingUpdate}
//             >
//               {isPendingUpdate ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Update Status'
//               )}
//             </Button>
//           </form>
//           <form action={deleteAction} className='w-full'>
//             <input type='hidden' name='invoiceId' value={invoice.id} />
//             <Button
//               type='submit'
//               variant='destructive'
//               className='w-full'
//               disabled={isPendingDelete}
//               aria-disabled={isPendingDelete}
//             >
//               {isPendingDelete ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Delete Invoice'
//               )}
//             </Button>
//           </form>
//         </CardFooter>
//       </Card>
//       {state.message && (
//         <Alert
//           className={cn(
//             'mt-4',
//             state.success
//               ? 'border-[#0F9D58] text-[#0F9D58]'
//               : 'border-[#DB4437] text-[#DB4437]'
//           )}
//         >
//           <div className='flex items-start gap-2'>
//             {state.success ? (
//               <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
//             ) : (
//               <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
//             )}
//             <AlertDescription
//               className={cn(
//                 'w-full',
//                 state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
//               )}
//             >
//               {state.message}
//             </AlertDescription>
//           </div>
//         </Alert>
//       )}
//     </div>
//   )
// }
