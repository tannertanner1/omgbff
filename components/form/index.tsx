'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { IconLoader, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { FormProps, FormState } from './types'

export function Form({
  fields,
  action,
  button = 'Submit',
  redirectPath
}: FormProps) {
  const router = useRouter()
  const initialState: FormState = {
    success: false,
    message: '',
    errors: {},
    inputs: {}
  }

  const [state, formAction, isPending] = useActionState(action, initialState)

  React.useEffect(() => {
    if (state?.success && redirectPath) {
      router.push(redirectPath)
    }
  }, [state?.success, redirectPath, router])

  return (
    <div className={cn('w-full max-w-sm')}>
      <Card className={cn('w-full max-w-sm border-0')}>
        <CardHeader className='-mt-8'>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className='flex flex-col gap-6'>
            {fields.map(({ name, label, type = 'text', required }) => (
              <div key={name} className='grid gap-2'>
                <Label
                  htmlFor={name}
                  className={
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  }
                >
                  {label}
                </Label>
                {type === 'textarea' ? (
                  <Textarea
                    id={name}
                    name={name}
                    aria-describedby={`${name}-error`}
                    className={
                      state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'
                    }
                    defaultValue={state?.inputs?.[name]}
                  />
                ) : (
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    aria-describedby={`${name}-error`}
                    className={
                      state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'
                    }
                    defaultValue={state?.inputs?.[name]}
                  />
                )}
                {state?.errors?.[name] && (
                  <p id={`${name}-error`} className='text-sm text-[#DB4437]'>
                    {state.errors[name][0]}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button
              type='submit'
              variant='outline'
              className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
              ) : (
                button
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {state?.message && (
        <div className='mx-auto mt-7 w-full max-w-sm px-6'>
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
        </div>
      )}
    </div>
  )
}

// @note ACTUALLY BEST. no errors...

// 'use client'

// import * as React from 'react'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter
// } from '@/components/ui/card'
// import { IconLoader, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
// import { cn } from '@/lib/utils'
// import type { FormProps, FormState } from './types'

// export function Form({ fields, action, button = 'Submit' }: FormProps) {
//   const [state, setState] = React.useState<FormState>({
//     success: false,
//     message: '',
//     errors: {},
//     inputs: {}
//   })
//   const [isPending, startTransition] = React.useTransition()

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     const formData = new FormData(event.currentTarget)
//     startTransition(async () => {
//       const result = await action(state, formData)
//       setState(result)
//     })
//   }

//   return (
//     <div className={cn('w-full max-w-sm')}>
//       <Card className={cn('w-full max-w-sm border-0')}>
//         <CardHeader className='-mt-8'>
//           <CardTitle></CardTitle>
//           <CardDescription></CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className='flex flex-col gap-6'>
//             <div className='grid gap-2'>
//               {fields.map(({ name, label, type = 'text', required }) => (
//                 <div key={name} className='grid gap-2'>
//                   <Label
//                     htmlFor={name}
//                     className={
//                       required
//                         ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                         : ''
//                     }
//                   >
//                     {label}
//                   </Label>
//                   {type === 'textarea' ? (
//                     <Textarea
//                       id={name}
//                       name={name}
//                       aria-describedby={`${name}-error`}
//                       className={
//                         state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'
//                       }
//                       defaultValue={state?.inputs?.[name]}
//                     />
//                   ) : (
//                     <Input
//                       id={name}
//                       name={name}
//                       type={type}
//                       aria-describedby={`${name}-error`}
//                       className={
//                         state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'
//                       }
//                       defaultValue={state?.inputs?.[name]}
//                     />
//                   )}
//                   {state?.errors?.[name] && (
//                     <p id={`${name}-error`} className='text-sm text-[#DB4437]'>
//                       {state.errors[name]}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//           <CardFooter className='flex flex-col gap-4'>
//             <Button
//               type='submit'
//               variant='outline'
//               className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
//               disabled={isPending}
//               aria-disabled={isPending}
//             >
//               {isPending ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 button
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

// @note best ? ish.. still error

// 'use client'

// import * as React from 'react'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { IconLoader } from '@tabler/icons-react'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
// import { cn } from '@/lib/utils'

// interface Field {
//   name: string
//   label: string
//   type?: 'text' | 'email' | 'number' | 'textarea'
//   required?: boolean
// }

// interface FormProps {
//   fields: Field[]
//   action: (prevState: any, formData: FormData) => Promise<any>
//   button?: string
// }

// export function Form({ fields, action, button = 'Submit' }: FormProps) {
//   const [state, formAction, isPending] = React.useActionState(action, {
//     error: null
//   })

//   return (
//     <div className={cn('w-full max-w-sm')}>
//       <Card className={cn('w-full max-w-sm border-0')}>
//         <CardHeader className='-mt-8'>
//           <CardTitle></CardTitle>
//           <CardDescription></CardDescription>
//         </CardHeader>
//     <form action={formAction} className='space-y-4'>
//       <CardContent className='flex flex-col gap-6'>
//         <div className='grid gap-2'>
//         {fields.map(({ name, label, type = 'text', required }) => (
//           <Label
//             htmlFor={name}
//             className={
//               required
//                 ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                 : ''
//             }
//           >
//             {label}
//           </Label>
//           {type === 'textarea' ? (
//             <Textarea
//               id={name}
//               name={name}
//               aria-describedby={`${name}-error`}
//               className={state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'}
//               defaultValue={state?.inputs?.[name]}
//             />
//           ) : (
//             <Input
//               id={name}
//               name={name}
//               type={type}
//               aria-describedby={`${name}-error`}
//               className={state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'}
//               defaultValue={state?.inputs?.[name]}
//             />
//           )}
//           {state?.errors?.[name] && (
//             <p id={`${name}-error`} className='text-sm text-[#DB4437]'>
//               {state.errors[name]}
//             </p>
//           )}
//         ))}
//         </div>
//       </CardContent>
//       <CardFooter className='flex flex-col gap-4'>
//       <Button
//         type='submit'
//         variant='outline'
//         className={cn(
//           'w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background',
//           state?.errors?.message ? '' : ''
//         )}
//         disabled={isPending}
//         aria-disabled={isPending}
//       >
//         {isPending ? (
//           <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//         ) : (
//           'Send'
//         )}
//       </Button>
//     </CardFooter>
//       </form>
//       </Card>

//       // {state?.message && (
//       //   <div className='mx-auto mt-7 w-full max-w-sm px-6'>
//       //     <Alert
//       //       className={cn(
//       //         'w-full',
//       //         state.success
//       //           ? 'border-[#0F9D58] text-[#0F9D58]'
//       //           : 'border-[#DB4437] text-[#DB4437]'
//       //       )}
//       //     >
//       //       <div className='flex items-start gap-2'>
//       //         {state.success ? (
//       //           <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
//       //         ) : (
//       //           <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
//       //         )}
//       //         <AlertDescription
//       //           className={cn(
//       //             'w-full',
//       //             state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
//       //           )}
//       //         >
//       //           {state.message}
//       //         </AlertDescription>
//       //       </div>
//       //     </Alert>
//       //   </div>
//       // )}
//       </div>
//   )
// }

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { cn } from '@/lib/utils'
// import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'

// export interface Field {
//   name: string
//   label: string
//   type: 'text' | 'email' | 'number' | 'textarea'
//   required?: boolean
//   step?: string
// }

// interface FormState {
//   success: boolean
//   message: string
//   errors?: Record<string, string[]>
//   inputs?: Record<string, string>
// }

// interface FormProps {
//   title?: string
//   description?: string
//   fields: Field[]
//   action: (
//     prevState: FormState | null,
//     formData: FormData
//   ) => Promise<FormState>
//   redirect?: string
// }

// export function Form({
//   title,
//   description,
//   fields,
//   action,
//   redirect
// }: FormProps) {
//   const router = useRouter()
//   const [state, formAction, isPending] = React.useActionState(action, {
//     success: false,
//     message: ''
//   })

//   React.useEffect(() => {
//     if (state?.success && redirect) {
//       router.push(redirect)
//     }
//   }, [state?.success, redirect, router])

//   return (
//     <div className={cn('w-full max-w-sm')}>
//       <Card className={cn('w-full max-w-sm border-0')}>
//         <CardHeader className='-mt-8'>
//           {title && <CardTitle>{title}</CardTitle>}
//           {description && <CardDescription>{description}</CardDescription>}
//         </CardHeader>
//         <form action={formAction}>
//           <CardContent className='flex flex-col gap-6'>
//             {fields.map(field => (
//               <div key={field.name} className='grid gap-2'>
//                 <Label
//                   htmlFor={field.name}
//                   className={cn({
//                     "after:ml-0.5 after:text-[#DB4437] after:content-['*']":
//                       field.required
//                   })}
//                 >
//                   {field.label}
//                 </Label>
//                 {field.type === 'textarea' ? (
//                   <Textarea
//                     id={field.name}
//                     name={field.name}
//                     aria-describedby={`${field.name}-error`}
//                     className={cn({
//                       'border-[#DB4437]': state?.errors?.[field.name],
//                       'mb-7': !state?.errors?.[field.name]
//                     })}
//                     defaultValue={state?.inputs?.[field.name]}
//                   />
//                 ) : (
//                   <Input
//                     id={field.name}
//                     name={field.name}
//                     type={field.type}
//                     step={field.step}
//                     aria-describedby={`${field.name}-error`}
//                     className={cn({
//                       'border-[#DB4437]': state?.errors?.[field.name],
//                       'mb-7': !state?.errors?.[field.name]
//                     })}
//                     defaultValue={state?.inputs?.[field.name]}
//                   />
//                 )}
//                 {state?.errors?.[field.name] && (
//                   <p
//                     id={`${field.name}-error`}
//                     className='text-sm text-[#DB4437]'
//                   >
//                     {state.errors[field.name][0]}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </CardContent>
//           <CardFooter className='flex flex-col gap-4'>
//             <Button
//               type='submit'
//               variant='outline'
//               className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
//               disabled={isPending}
//               aria-disabled={isPending}
//             >
//               {isPending ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Submit'
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

// // 'use client'

// // import * as React from 'react'
// // import { useRouter } from 'next/navigation'
// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// //   CardContent,
// //   CardFooter
// // } from '@/components/ui/card'
// // import { Input } from '@/components/ui/input'
// // import { Label } from '@/components/ui/label'
// // import { Button } from '@/components/ui/button'
// // import { Textarea } from '@/components/ui/textarea'
// // import { Alert, AlertDescription } from '@/components/ui/alert'
// // import { cn } from '@/lib/utils'
// // import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'

// // interface Field {
// //   name: string
// //   label: string
// //   type: 'text' | 'email' | 'number' | 'textarea'
// //   required?: boolean
// //   step?: string
// // }

// // export function Form({
// //   title,
// //   description,
// //   fields,
// //   action,
// //   redirect
// // }: {
// //   title?: string
// //   description?: string
// //   fields: Field[]
// //   action: (prevState: any, formData: FormData) => Promise<any>
// //   redirect?: string
// // }) {
// //   const router = useRouter()
// //   const [state, formAction, isPending] = React.useActionState(action, {
// //     success: false,
// //     message: ''
// //   })

// //   React.useEffect(() => {
// //     if (state?.success && redirect) {
// //       router.push(redirect)
// //     }
// //   }, [state?.success, redirect, router])

// //   return (
// //     <div className={cn('w-full max-w-sm')}>
// //       <Card className={cn('w-full max-w-sm border-0')}>
// //         <CardHeader className='-mt-8'>
// //           {title && <CardTitle>{title}</CardTitle>}
// //           {description && <CardDescription>{description}</CardDescription>}
// //         </CardHeader>
// //         <form action={formAction}>
// //           <CardContent className='flex flex-col gap-6'>
// //             {fields.map(field => (
// //               <div key={field.name} className='grid gap-2'>
// //                 <Label
// //                   htmlFor={field.name}
// //                   className={cn({
// //                     "after:ml-0.5 after:text-[#DB4437] after:content-['*']":
// //                       field.required
// //                   })}
// //                 >
// //                   {field.label}
// //                 </Label>
// //                 {field.type === 'textarea' ? (
// //                   <Textarea
// //                     id={field.name}
// //                     name={field.name}
// //                     aria-describedby={`${field.name}-error`}
// //                     className={cn({
// //                       'border-[#DB4437]': state?.errors?.[field.name],
// //                       'mb-7': !state?.errors?.[field.name]
// //                     })}
// //                     defaultValue={state?.inputs?.[field.name]}
// //                   />
// //                 ) : (
// //                   <Input
// //                     id={field.name}
// //                     name={field.name}
// //                     type={field.type}
// //                     step={field.step}
// //                     aria-describedby={`${field.name}-error`}
// //                     className={cn({
// //                       'border-[#DB4437]': state?.errors?.[field.name],
// //                       'mb-7': !state?.errors?.[field.name]
// //                     })}
// //                     defaultValue={state?.inputs?.[field.name]}
// //                   />
// //                 )}
// //                 {state?.errors?.[field.name] && (
// //                   <p
// //                     id={`${field.name}-error`}
// //                     className='text-sm text-[#DB4437]'
// //                   >
// //                     {state.errors[field.name][0]}
// //                   </p>
// //                 )}
// //               </div>
// //             ))}
// //           </CardContent>
// //           <CardFooter className='flex flex-col gap-4'>
// //             <Button
// //               type='submit'
// //               variant='outline'
// //               className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
// //               disabled={isPending}
// //               aria-disabled={isPending}
// //             >
// //               {isPending ? (
// //                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
// //               ) : (
// //                 'Submit'
// //               )}
// //             </Button>
// //           </CardFooter>
// //         </form>
// //       </Card>
// //       {state?.message && (
// //         <div className='mx-auto mt-7 w-full max-w-sm px-6'>
// //           <Alert
// //             className={cn(
// //               'w-full',
// //               state.success
// //                 ? 'border-[#0F9D58] text-[#0F9D58]'
// //                 : 'border-[#DB4437] text-[#DB4437]'
// //             )}
// //           >
// //             <div className='flex items-start gap-2'>
// //               {state.success ? (
// //                 <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
// //               ) : (
// //                 <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
// //               )}
// //               <AlertDescription
// //                 className={cn(
// //                   'w-full',
// //                   state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
// //                 )}
// //               >
// //                 {state.message}
// //               </AlertDescription>
// //             </div>
// //           </Alert>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
