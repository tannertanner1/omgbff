'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PHONE } from '@/data/customer-fields'
import { Section } from './section'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'
import type { NestedFieldErrors } from '@/types/forms'

export function Phone({
  name,
  required
}: {
  name: string
  required?: boolean
}) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: 'fieldId' // Important: Use a different key name to avoid conflicts
  })

  const watchFieldArray = watch(name)
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index]
  }))

  const fieldErrors = errors[name] as NestedFieldErrors | undefined
  const usedLabels = controlledFields.map(field => field.label)

  return (
    <div className='w-full max-w-[338px] pt-4'>
      <Label
        className={cn(
          'mb-2',
          required
            ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
            : ''
        )}
      >
        Phone
      </Label>
      {controlledFields.map((field, index) => {
        const error = fieldErrors?.[index] as NestedFieldErrors | undefined
        const hasErrors = !!error

        return (
          <Section
            key={field.fieldId}
            title={`${field.label || PHONE[index] || 'Phone'}`}
            summary={field.number || ''}
            onRemove={index > 0 ? () => remove(index) : undefined}
            error={
              hasErrors
                ? {
                    type: 'validation',
                    message: 'Required'
                  }
                : undefined
            }
            defaultOpen={hasErrors}
          >
            <div className='space-y-4'>
              <div className='pt-4'>
                <Label
                  className={cn(
                    'mb-2',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  Label
                </Label>
                <Select
                  onValueChange={value => {
                    setValue(`${name}.${index}.label`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                  value={field.label || ''}
                >
                  <SelectTrigger
                    className={cn(
                      'mb-1',
                      error?.label ? 'border-[#DB4437]' : ''
                    )}
                  >
                    <SelectValue placeholder='' />
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE.filter(
                      label =>
                        !usedLabels.includes(label) || field.label === label
                    ).map(label => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  className={cn(
                    'mb-2',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  Number
                </Label>
                <IMaskInput
                  {...register(`${name}.${index}.number`)}
                  mask='(000) 000-0000'
                  definitions={{
                    '0': /[0-9]/
                  }}
                  className={cn(
                    'mb-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    error?.number ? 'border-[#DB4437]' : ''
                  )}
                  value={field.number || ''}
                  onAccept={value => {
                    setValue(`${name}.${index}.number`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                />
              </div>
            </div>
          </Section>
        )
      })}

      {fields.length < PHONE.length && (
        <Button
          type='button'
          variant='outline'
          className='w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
          onClick={() =>
            append({
              label: PHONE[fields.length],
              number: ''
            })
          }
        >
          Add
        </Button>
      )}
    </div>
  )
}

// @note

// 'use client'

// import { useFieldArray, useFormContext } from 'react-hook-form'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { PHONE } from '@/data/customer-fields'
// import { Section } from './section'
// import { IMaskInput } from 'react-imask'
// import { cn } from '@/lib/utils'
// import type { NestedFieldErrors } from '@/types/forms'

// export function Phone({
//   name,
//   required
// }: {
//   name: string
//   required?: boolean
// }) {
//   const {
//     control,
//     register,
//     formState: { errors },
//     watch,
//     setValue
//   } = useFormContext()

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name,
//     keyName: 'fieldId' // Important: Use a different key name to avoid conflicts
//   })

//   const watchFieldArray = watch(name)
//   const controlledFields = fields.map((field, index) => ({
//     ...field,
//     ...watchFieldArray[index]
//   }))

//   const fieldErrors = errors[name] as NestedFieldErrors | undefined
//   const usedLabels = controlledFields.map(field => field.label)

//   return (
//     <div className='w-full max-w-[338px] pt-4'>
//       <Label
//         className={cn(
//           '',
//           required
//             ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//             : ''
//         )}
//       >
//         Phone
//       </Label>
//       {controlledFields.map((field, index) => {
//         const error = fieldErrors?.[index] as NestedFieldErrors | undefined
//         const hasErrors = !!error

//         return (
//           <Section
//             key={field.fieldId}
//             title={`${field.label || PHONE[index] || 'Phone'}`}
//             summary={field.number || ''}
//             onRemove={index > 0 ? () => remove(index) : undefined}
//             error={
//               hasErrors
//                 ? {
//                     type: 'validation',
//                     message: 'Please complete all required fields'
//                   }
//                 : undefined
//             }
//             defaultOpen={hasErrors}
//           >
//             <div className='space-y-4'>
//               <div className='pt-4'>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   Label
//                 </Label>
//                 <Select
//                   onValueChange={value => {
//                     setValue(`${name}.${index}.label`, value, {
//                       shouldValidate: true,
//                       shouldDirty: true
//                     })
//                   }}
//                   value={field.label || ''}
//                 >
//                   <SelectTrigger
//                     className={cn(error?.label ? 'border-[#DB4437]' : 'mb-7')}
//                   >
//                     <SelectValue placeholder='' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PHONE.filter(
//                       label =>
//                         !usedLabels.includes(label) || field.label === label
//                     ).map(label => (
//                       <SelectItem key={label} value={label}>
//                         {label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   Number
//                 </Label>
//                 <IMaskInput
//                   {...register(`${name}.${index}.number`)}
//                   mask='(000) 000-0000'
//                   definitions={{
//                     '0': /[0-9]/
//                   }}
//                   className={cn(
//                     'mb-7 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
//                     error?.number ? 'border-[#DB4437]' : ''
//                   )}
//                   value={field.number || ''}
//                   onAccept={value => {
//                     setValue(`${name}.${index}.number`, value, {
//                       shouldValidate: true,
//                       shouldDirty: true
//                     })
//                   }}
//                 />
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < PHONE.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={() =>
//             append({
//               label: PHONE[fields.length],
//               number: ''
//             })
//           }
//         >
//           Add
//         </Button>
//       )}
//     </div>
//   )
// }

// @note

// 'use client'

// import { useFieldArray, useFormContext } from 'react-hook-form'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { PHONE } from '@/data/customer-fields'
// import { Section } from './section'
// import { IMaskInput } from 'react-imask'
// import { cn } from '@/lib/utils'
// import type { NestedFieldErrors } from '@/types/forms'

// export function Phone({
//   name,
//   required
// }: {
//   name: string
//   required?: boolean
// }) {
//   const {
//     control,
//     register,
//     formState: { errors },
//     watch,
//     setValue
//   } = useFormContext()

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name
//   })

//   const watchFieldArray = watch(name)
//   const controlledFields = fields.map((field, index) => ({
//     ...field,
//     ...watchFieldArray[index]
//   }))

//   const fieldErrors = errors[name] as NestedFieldErrors | undefined

//   // Get currently used labels
//   const usedLabels = controlledFields.map(field => field.label)

//   return (
//     <div className='w-full max-w-[338px] pt-4'>
//       <Label
//         className={cn(
//           '',
//           required
//             ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//             : ''
//         )}
//       >
//         Phone
//       </Label>
//       {controlledFields.map((field, index) => {
//         const error = fieldErrors?.[index] as NestedFieldErrors | undefined
//         const hasErrors = !!error

//         return (
//           <Section
//             key={field.id}
//             title={`${field.label || PHONE[index] || 'Phone'}`}
//             summary={field.number || ''}
//             onRemove={index > 0 ? () => remove(index) : undefined}
//             error={
//               hasErrors
//                 ? {
//                     type: 'validation',
//                     message: 'Please complete all required fields'
//                   }
//                 : undefined
//             }
//             defaultOpen={hasErrors}
//           >
//             <div className='space-y-4'>
//               <div className='pt-4'>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   Label
//                 </Label>
//                 <Select
//                   onValueChange={value => {
//                     const event = {
//                       target: { name: `${name}.${index}.label`, value }
//                     }
//                     register(`${name}.${index}.label`).onChange(event)
//                   }}
//                   value={field.label || ''}
//                 >
//                   <SelectTrigger
//                     className={cn(error?.label ? 'border-[#DB4437]' : 'mb-7')}
//                   >
//                     <SelectValue placeholder='' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PHONE.filter(
//                       label =>
//                         !usedLabels.includes(label) || field.label === label
//                     ).map(label => (
//                       <SelectItem key={label} value={label}>
//                         {label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   Number
//                 </Label>
//                 <IMaskInput
//                   {...register(`${name}.${index}.number`)}
//                   mask='(000) 000-0000'
//                   definitions={{
//                     '0': /[0-9]/
//                   }}
//                   className={cn(
//                     'mb-7 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
//                     error?.number ? 'border-[#DB4437]' : ''
//                   )}
//                   value={field.number || ''}
//                   onAccept={value => {
//                     setValue(`${name}.${index}.number`, value)
//                   }}
//                 />
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < PHONE.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={() =>
//             append({
//               label: PHONE[fields.length],
//               number: ''
//             })
//           }
//         >
//           Add
//         </Button>
//       )}
//     </div>
//   )
// }

// @note

// 'use client'

// import { useFieldArray, useFormContext } from 'react-hook-form'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { PHONE } from '@/data/customer-fields'
// import { Section } from './section'
// import { cn } from '@/lib/utils'
// import type { NestedFieldErrors } from '@/types/forms'

// export function Phone({ name }: { name: string }) {
//   const {
//     control,
//     register,
//     formState: { errors },
//     watch,
//     setValue
//   } = useFormContext()

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name
//   })

//   const watchFieldArray = watch(name)
//   const controlledFields = fields.map((field, index) => ({
//     ...field,
//     ...watchFieldArray[index]
//   }))

//   const fieldErrors = errors[name] as NestedFieldErrors | undefined

//   return (
//     <div className='space-y-4'>
//       {controlledFields.map((field, index) => {
//         const error = fieldErrors?.[index] as NestedFieldErrors | undefined
//         const hasErrors = !!error

//         return (
//           <Section
//             key={field.id}
//             title={`${field.label || PHONE[index] || 'Phone'}`}
//             summary={field.number || 'No number'}
//             onRemove={index > 0 ? () => remove(index) : undefined}
//             error={
//               hasErrors
//                 ? {
//                     type: 'validation',
//                     message: 'Please complete all required fields'
//                   }
//                 : undefined
//             }
//             defaultOpen={hasErrors}
//           >
//             <div className='space-y-4'>
//               <div>
//                 <Label>Label</Label>
//                 <Select
//                   onValueChange={value => {
//                     const event = {
//                       target: { name: `${name}.${index}.label`, value }
//                     }
//                     register(`${name}.${index}.label`).onChange(event)
//                   }}
//                   value={field.label || ''}
//                 >
//                   <SelectTrigger
//                     className={cn(error?.label && 'border-[#DB4437]')}
//                   >
//                     <SelectValue placeholder='Select label' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PHONE.map(label => (
//                       <SelectItem key={label} value={label}>
//                         {label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {error?.label && (
//                   <p className='text-xs text-[#DB4437]'>
//                     {error.label.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label>Number</Label>
//                 <Input
//                   {...register(`${name}.${index}.number`)}
//                   className={cn(error?.number && 'border-[#DB4437]')}
//                   placeholder='(555) 555-5555'
//                   onBlur={e => {
//                     const value = e.target.value
//                     const formatted = value
//                       .replace(/[^0-9]/g, '')
//                       .match(/^(\d{3})(\d{3})(\d{4})$/)
//                     if (formatted) {
//                       setValue(
//                         `${name}.${index}.number`,
//                         `(${formatted[1]}) ${formatted[2]}-${formatted[3]}`
//                       )
//                     }
//                   }}
//                 />
//                 {error?.number && (
//                   <p className='text-xs text-[#DB4437]'>
//                     {error.number.message as string}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < PHONE.length && (
//         <Button
//           type='button'
//           variant='outline'
//           onClick={() =>
//             append({
//               label: PHONE[fields.length],
//               number: ''
//             })
//           }
//         >
//           Add
//         </Button>
//       )}
//     </div>
//   )
// }

// @note

// 'use client'

// import {
//   useFormContext,
//   useFieldArray,
//   type FieldError,
//   type ArrayPath
// } from 'react-hook-form'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { IMaskInput } from 'react-imask'
// import { PHONE } from '@/data/customer-fields'
// import { Section } from './section'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { cn } from '@/lib/utils'

// type PhoneField = {
//   label: (typeof PHONE)[number]
//   number: string
// }

// type FormValues = {
//   [key: string]: PhoneField[]
// }

// export function Phone({
//   id,
//   name,
//   defaultValue,
//   required,
//   disabled
// }: {
//   id: string
//   name: string
//   defaultValue?: any
//   required?: boolean
//   disabled?: boolean
// }) {
//   const {
//     control,
//     formState: { errors }
//   } = useFormContext<FormValues>()

//   const { fields, append, remove } = useFieldArray<FormValues>({
//     control,
//     name: name as ArrayPath<FormValues>
//   })

//   return (
//     <div className='space-y-4'>
//       {fields.map((field, index) => (
//         <Section
//           key={field.id}
//           title={field.label}
//           summary={field.number}
//           onRemove={index > 0 ? () => remove(index) : undefined}
//           error={errors[name]?.[index] as FieldError | undefined}
//         >
//           <div className='space-y-4'>
//             <div>
//               <Label htmlFor={`${name}.${index}.label`}>Type</Label>
//               <Select
//                 name={`${name}.${index}.label`}
//                 defaultValue={field.label}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder='Select phone type' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {PHONE.map(type => (
//                     <SelectItem key={type} value={type}>
//                       {type}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor={`${name}.${index}.number`}>Number</Label>
//               <IMaskInput
//                 id={`${name}.${index}.number`}
//                 name={`${name}.${index}.number`}
//                 className={cn(
//                   'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
//                   errors[name]?.[index]?.number && 'border-destructive'
//                 )}
//                 mask='(000) 000-0000'
//                 placeholder=''
//                 defaultValue={field.number}
//               />
//               {/* <IMaskInput
//                 id={`${name}.${index}.number`}
//                 name={`${name}.${index}.number`}
//                 mask='(000) 000-0000'
//                 placeholder='(555) 555-5555'
//                 defaultValue={field.number}
//               /> */}
//             </div>
//           </div>
//         </Section>
//       ))}

//       {fields.length < PHONE.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={() =>
//             append({
//               label: PHONE[fields.length],
//               number: ''
//             })
//           }
//         >
//           Add
//         </Button>
//       )}
//     </div>
//   )
// }

// @note

// 'use client'

// import * as React from 'react'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { cn } from '@/lib/utils'
// import { IMaskInput } from 'react-imask'
// import { PHONE } from '@/data/customer-fields'
// import { Section } from './section'

// export function Phone({
//   id,
//   name,
//   defaultValue,
//   required,
//   disabled
// }: {
//   id: string
//   name: string
//   defaultValue?: any
//   required?: boolean
//   disabled?: boolean
// }) {
//   const [phones, setPhones] = React.useState<any[]>(
//     defaultValue || [{ label: PHONE[0], number: '' }]
//   )

//   const addPhone = () => {
//     if (phones.length < PHONE.length) {
//       setPhones([...phones, { label: PHONE[phones.length], number: '' }])
//     }
//   }

//   const removePhone = (index: number) => {
//     if (index === 0) return // Prevent removing primary phone
//     setPhones(phones.filter((_, i) => i !== index))
//   }

//   const updatePhone = (index: number, value: string) => {
//     const newPhones = [...phones]
//     newPhones[index] = { ...newPhones[index], number: value }
//     setPhones(newPhones)
//   }

//   return (
//     <div className='space-y-4'>
//       {phones.map((phone, index) => (
//         <Section
//           key={index}
//           title={phone.label}
//           summary={phone.number || ''}
//           onRemove={index > 0 ? () => removePhone(index) : undefined}
//         >
//           <input
//             type='hidden'
//             name={`${name}.${index}.label`}
//             value={phone.label}
//           />
//           <div className={cn('-mt-4 grid gap-2')}>
//             <Label htmlFor={`${id}-${index}-number`}>Number</Label>
//             <IMaskInput
//               id={`${id}-${index}-number`}
//               name={`${name}.${index}.number`}
//               value={phone.number}
//               onAccept={value => updatePhone(index, value)}
//               mask='(000) 000-0000'
//               required={required}
//               disabled={disabled}
//               className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
//             />
//           </div>
//         </Section>
//       ))}

//       {phones.length < PHONE.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={addPhone}
//           disabled={disabled}
//         >
//           Add
//         </Button>
//       )}
//     </div>
//   )
// }
