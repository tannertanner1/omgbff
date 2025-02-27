'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
import { Section } from './section'
import { cn } from '@/lib/utils'
import { IMaskInput } from 'react-imask'
import type { NestedFieldErrors } from '@/types/forms'

export function Address({
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
        Address
      </Label>
      {controlledFields.map((field, index) => {
        const error = fieldErrors?.[index] as NestedFieldErrors | undefined
        const hasErrors = !!error
        const selectedCountry = watch(`${name}.${index}.country`) || 'Canada'
        const regionOptions = selectedCountry === 'Canada' ? PROVINCE : STATE

        return (
          <Section
            key={field.fieldId}
            title={`${field.label || ADDRESS[index] || 'Address'}`}
            summary={cn(
              '',
              field.line1
                ? field.line2
                  ? `${field.line1}, ${field.line2}`
                  : field.line1
                : ''
            )}
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
                    <SelectValue placeholder='Select label' />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDRESS.filter(
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
                  Street line 1
                </Label>
                <Input
                  {...register(`${name}.${index}.line1`)}
                  className={cn('mb-1', error?.line1 ? 'border-[#DB4437]' : '')}
                />
              </div>

              <div>
                <Label className='mb-2'>Street line 2</Label>
                <Input
                  {...register(`${name}.${index}.line2`)}
                  className={cn('mb-1', error?.line2 ? 'border-[#DB4437]' : '')}
                />
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
                  City
                </Label>
                <Input
                  {...register(`${name}.${index}.city`)}
                  className={cn('mb-1', error?.city ? 'border-[#DB4437]' : '')}
                />
              </div>

              <div className='pt-4'>
                <Label
                  className={cn(
                    'mb-2',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  {selectedCountry === 'Canada' ? 'Province' : 'State'}
                </Label>
                <Select
                  onValueChange={value => {
                    setValue(`${name}.${index}.region`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                  value={
                    field.region ||
                    (selectedCountry === 'Canada'
                      ? 'British Columbia'
                      : 'California')
                  }
                >
                  <SelectTrigger
                    className={cn(
                      'mb-1',
                      error?.region ? 'border-[#DB4437]' : ''
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
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
                  {selectedCountry === 'Canada' ? 'Postal code' : 'ZIP code'}
                </Label>
                <IMaskInput
                  {...register(`${name}.${index}.postal`)}
                  mask={selectedCountry === 'Canada' ? 'a9a 9a9' : '99999-9999'}
                  definitions={{
                    a: /[A-Za-z]/,
                    '9': /[0-9]/
                  }}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    error?.postal ? 'border-[#DB4437]' : 'mb-1'
                  )}
                  value={field.postal || ''}
                  onAccept={value => {
                    setValue(`${name}.${index}.postal`, value.toUpperCase(), {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                />
              </div>

              <div className='pt-2'>
                <Label
                  className={cn(
                    'mb-2',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  Country
                </Label>
                <Select
                  onValueChange={value => {
                    setValue(`${name}.${index}.country`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                    setValue(
                      `${name}.${index}.region`,
                      value === 'Canada' ? 'British Columbia' : 'California',
                      {
                        shouldValidate: true,
                        shouldDirty: true
                      }
                    )
                  }}
                  value={field.country || 'Canada'}
                >
                  <SelectTrigger
                    className={cn(
                      'mb-1',
                      error?.country ? 'border-[#DB4437]' : ''
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>
        )
      })}

      {fields.length < ADDRESS.length && (
        <Button
          type='button'
          variant='outline'
          className='w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
          onClick={() =>
            append({
              label: ADDRESS[fields.length],
              line1: '',
              line2: '',
              city: '',
              region: 'British Columbia',
              postal: '',
              country: 'Canada'
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
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
// import { Section } from './section'
// import { cn } from '@/lib/utils'
// import { IMaskInput } from 'react-imask'
// import type { NestedFieldErrors } from '@/types/forms'

// export function Address({
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
//         Address
//       </Label>
//       {controlledFields.map((field, index) => {
//         const error = fieldErrors?.[index] as NestedFieldErrors | undefined
//         const hasErrors = !!error
//         const selectedCountry = watch(`${name}.${index}.country`) || 'Canada'
//         const regionOptions = selectedCountry === 'Canada' ? PROVINCE : STATE

//         return (
//           <Section
//             key={field.fieldId}
//             title={`${field.label || ADDRESS[index] || 'Address'}`}
//             summary={cn(
//               '',
//               field.line1
//                 ? field.line2
//                   ? `${field.line1}, ${field.line2}`
//                   : field.line1
//                 : ''
//             )}
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
//                     <SelectValue placeholder='Select label' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {ADDRESS.filter(
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
//                   Street line 1
//                 </Label>
//                 <Input
//                   {...register(`${name}.${index}.line1`)}
//                   className={cn(error?.line1 ? 'border-[#DB4437]' : 'mb-7')}
//                 />
//               </div>

//               <div>
//                 <Label>Street line 2</Label>
//                 <Input
//                   {...register(`${name}.${index}.line2`)}
//                   className={cn(error?.line2 ? 'border-[#DB4437]' : 'mb-7')}
//                 />
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
//                   City
//                 </Label>
//                 <Input
//                   {...register(`${name}.${index}.city`)}
//                   className={cn(error?.city ? 'border-[#DB4437]' : 'mb-7')}
//                 />
//               </div>

//               <div className='pt-4'>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   {selectedCountry === 'Canada' ? 'Province' : 'State'}
//                 </Label>
//                 <Select
//                   onValueChange={value => {
//                     setValue(`${name}.${index}.region`, value, {
//                       shouldValidate: true,
//                       shouldDirty: true
//                     })
//                   }}
//                   value={
//                     field.region ||
//                     (selectedCountry === 'Canada'
//                       ? 'British Columbia'
//                       : 'California')
//                   }
//                 >
//                   <SelectTrigger
//                     className={cn(error?.region ? 'border-[#DB4437]' : 'mb-7')}
//                   >
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {regionOptions.map(region => (
//                       <SelectItem key={region} value={region}>
//                         {region}
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
//                   {selectedCountry === 'Canada' ? 'Postal code' : 'ZIP code'}
//                 </Label>
//                 <IMaskInput
//                   {...register(`${name}.${index}.postal`)}
//                   mask={selectedCountry === 'Canada' ? 'a9a 9a9' : '99999-9999'}
//                   definitions={{
//                     a: /[A-Za-z]/,
//                     '9': /[0-9]/
//                   }}
//                   className={cn(
//                     'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
//                     error?.postal ? 'border-[#DB4437]' : 'mb-7'
//                   )}
//                   value={field.postal || ''}
//                   onAccept={value => {
//                     setValue(`${name}.${index}.postal`, value.toUpperCase(), {
//                       shouldValidate: true,
//                       shouldDirty: true
//                     })
//                   }}
//                 />
//               </div>

//               <div className='pt-2'>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   Country
//                 </Label>
//                 <Select
//                   onValueChange={value => {
//                     setValue(`${name}.${index}.country`, value, {
//                       shouldValidate: true,
//                       shouldDirty: true
//                     })
//                     setValue(
//                       `${name}.${index}.region`,
//                       value === 'Canada' ? 'British Columbia' : 'California',
//                       {
//                         shouldValidate: true,
//                         shouldDirty: true
//                       }
//                     )
//                   }}
//                   value={field.country || 'Canada'}
//                 >
//                   <SelectTrigger
//                     className={cn(error?.country ? 'border-[#DB4437]' : 'mb-7')}
//                   >
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {COUNTRY.map(country => (
//                       <SelectItem key={country} value={country}>
//                         {country}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < ADDRESS.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={() =>
//             append({
//               label: ADDRESS[fields.length],
//               line1: '',
//               line2: '',
//               city: '',
//               region: 'British Columbia',
//               postal: '',
//               country: 'Canada'
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
// import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
// import { Section } from './section'
// import { cn } from '@/lib/utils'
// import { IMaskInput } from 'react-imask'
// import type { NestedFieldErrors } from '@/types/forms'

// export function Address({
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
//     setValue,
//     getValues
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
//         Address
//       </Label>
//       {controlledFields.map((field, index) => {
//         const error = fieldErrors?.[index] as NestedFieldErrors | undefined
//         const hasErrors = !!error
//         const selectedCountry = watch(`${name}.${index}.country`) || 'Canada'

//         // Get region options based on country
//         const regionOptions = selectedCountry === 'Canada' ? PROVINCE : STATE

//         return (
//           <Section
//             key={field.id}
//             title={`${field.label || ADDRESS[index] || 'Address'}`}
//             summary={cn(
//               '',
//               field.line1
//                 ? field.line2
//                   ? `${field.line1}, ${field.line2}`
//                   : field.line1
//                 : ''
//             )}
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
//                     <SelectValue placeholder='Select label' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {ADDRESS.filter(
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
//                   Street line 1
//                 </Label>
//                 <Input
//                   {...register(`${name}.${index}.line1`)}
//                   className={cn(error?.line1 ? 'border-[#DB4437]' : 'mb-7')}
//                 />
//               </div>

//               <div>
//                 <Label
//                 // className={cn(
//                 //   '',
//                 //   required
//                 //     ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                 //     : ''
//                 // )}
//                 >
//                   Street line 2
//                 </Label>
//                 <Input
//                   {...register(`${name}.${index}.line2`)}
//                   className={cn(error?.line2 ? 'border-[#DB4437]' : 'mb-7')}
//                 />
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
//                   City
//                 </Label>
//                 <Input
//                   {...register(`${name}.${index}.city`)}
//                   className={cn(error?.city ? 'border-[#DB4437]' : 'mb-7')}
//                 />
//               </div>

//               <div className='pt-4'>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   {selectedCountry === 'Canada' ? 'Province' : 'State'}
//                 </Label>
//                 <Select
//                   onValueChange={value => {
//                     const event = {
//                       target: { name: `${name}.${index}.region`, value }
//                     }
//                     register(`${name}.${index}.region`).onChange(event)
//                   }}
//                   value={
//                     field.region ||
//                     (selectedCountry === 'Canada'
//                       ? 'British Columbia'
//                       : 'California')
//                   }
//                 >
//                   <SelectTrigger
//                     className={cn(error?.region ? 'border-[#DB4437]' : 'mb-7')}
//                   >
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {regionOptions.map(region => (
//                       <SelectItem key={region} value={region}>
//                         {region}
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
//                   {selectedCountry === 'Canada' ? 'Postal code' : 'ZIP code'}
//                 </Label>
//                 <IMaskInput
//                   {...register(`${name}.${index}.postal`)}
//                   mask={selectedCountry === 'Canada' ? 'a9a 9a9' : '99999-9999'}
//                   definitions={{
//                     a: /[A-Za-z]/,
//                     '9': /[0-9]/
//                   }}
//                   className={cn(
//                     'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
//                     error?.postal ? 'border-[#DB4437]' : 'mb-7'
//                   )}
//                   value={field.postal || ''}
//                   onAccept={value => {
//                     setValue(`${name}.${index}.postal`, value.toUpperCase())
//                   }}
//                 />
//               </div>

//               <div className='pt-2'>
//                 <Label
//                   className={cn(
//                     '',
//                     required
//                       ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
//                       : ''
//                   )}
//                 >
//                   Country
//                 </Label>
//                 <Select
//                   onValueChange={value => {
//                     const event = {
//                       target: { name: `${name}.${index}.country`, value }
//                     }
//                     register(`${name}.${index}.country`).onChange(event)
//                     setValue(
//                       `${name}.${index}.region`,
//                       value === 'Canada' ? 'British Columbia' : 'California'
//                     )
//                   }}
//                   value={field.country || 'Canada'}
//                 >
//                   <SelectTrigger
//                     className={cn(error?.country ? 'border-[#DB4437]' : 'mb-7')}
//                   >
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {COUNTRY.map(country => (
//                       <SelectItem key={country} value={country}>
//                         {country}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < ADDRESS.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={() =>
//             append({
//               label: ADDRESS[fields.length],
//               line1: '',
//               line2: '',
//               city: '',
//               region: 'British Columbia',
//               postal: '',
//               country: 'Canada'
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
// import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
// import { Section } from './section'
// import { cn } from '@/lib/utils'
// import type { NestedFieldErrors } from '@/types/forms'

// export function Address({ name }: { name: string }) {
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
//         const selectedCountry = watch(`${name}.${index}.country`)

//         // Get region options based on country
//         const regionOptions = selectedCountry === 'Canada' ? PROVINCE : STATE

//         return (
//           <Section
//             key={field.id}
//             title={`${field.label || ADDRESS[index] || 'Address'}`}
//             summary={
//               field.line1
//                 ? `${field.line1}${field.line2 ? `, ${field.line2}` : ''}, ${field.city}, ${field.region} ${
//                     field.postal
//                   }, ${field.country}`
//                 : 'No address'
//             }
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
//                     {ADDRESS.map(label => (
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
//                 <Label>Street Address</Label>
//                 <Input
//                   {...register(`${name}.${index}.line1`)}
//                   className={cn(error?.line1 && 'border-[#DB4437]')}
//                   placeholder='123 Main St'
//                 />
//                 {error?.line1 && (
//                   <p className='text-xs text-[#DB4437]'>
//                     {error.line1.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label>Apartment, suite, etc.</Label>
//                 <Input
//                   {...register(`${name}.${index}.line2`)}
//                   className={cn(error?.line2 && 'border-[#DB4437]')}
//                   placeholder='Apt 4B'
//                 />
//                 {error?.line2 && (
//                   <p className='text-xs text-[#DB4437]'>
//                     {error.line2.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label>City</Label>
//                 <Input
//                   {...register(`${name}.${index}.city`)}
//                   className={cn(error?.city && 'border-[#DB4437]')}
//                   placeholder='New York'
//                 />
//                 {error?.city && (
//                   <p className='text-xs text-[#DB4437]'>
//                     {error.city.message as string}
//                   </p>
//                 )}
//               </div>

//               <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                   <Label>Country</Label>
//                   <Select
//                     onValueChange={value => {
//                       const event = {
//                         target: { name: `${name}.${index}.country`, value }
//                       }
//                       register(`${name}.${index}.country`).onChange(event)
//                       // Reset region when country changes
//                       setValue(`${name}.${index}.region`, '')
//                     }}
//                     value={field.country || ''}
//                   >
//                     <SelectTrigger
//                       className={cn(error?.country && 'border-[#DB4437]')}
//                     >
//                       <SelectValue placeholder='Select country' />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {COUNTRY.map(country => (
//                         <SelectItem key={country} value={country}>
//                           {country}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {error?.country && (
//                     <p className='text-xs text-[#DB4437]'>
//                       {error.country.message as string}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>
//                     {selectedCountry === 'Canada' ? 'Province' : 'State'}
//                   </Label>
//                   <Select
//                     onValueChange={value => {
//                       const event = {
//                         target: { name: `${name}.${index}.region`, value }
//                       }
//                       register(`${name}.${index}.region`).onChange(event)
//                     }}
//                     value={field.region || ''}
//                     disabled={!selectedCountry}
//                   >
//                     <SelectTrigger
//                       className={cn(error?.region && 'border-[#DB4437]')}
//                     >
//                       <SelectValue
//                         placeholder={`Select ${selectedCountry === 'Canada' ? 'province' : 'state'}`}
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {regionOptions.map(region => (
//                         <SelectItem key={region} value={region}>
//                           {region}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {error?.region && (
//                     <p className='text-xs text-[#DB4437]'>
//                       {error.region.message as string}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label>
//                   {selectedCountry === 'Canada' ? 'Postal Code' : 'ZIP Code'}
//                 </Label>
//                 <Input
//                   {...register(`${name}.${index}.postal`)}
//                   className={cn(error?.postal && 'border-[#DB4437]')}
//                   placeholder={
//                     selectedCountry === 'Canada' ? 'A1A 1A1' : '12345'
//                   }
//                   onBlur={e => {
//                     const value = e.target.value
//                     if (selectedCountry === 'Canada') {
//                       const formatted = value
//                         .replace(/[^A-Za-z0-9]/g, '')
//                         .match(/^([A-Za-z]\d[A-Za-z]\d[A-Za-z]\d)$/)
//                       if (formatted) {
//                         const postalCode = `${formatted[1].slice(0, 3)} ${formatted[1].slice(3)}`
//                         setValue(
//                           `${name}.${index}.postal`,
//                           postalCode.toUpperCase()
//                         )
//                       }
//                     } else {
//                       const formatted = value
//                         .replace(/[^0-9-]/g, '')
//                         .match(/^(\d{5})(-\d{4})?$/)
//                       if (formatted) {
//                         setValue(`${name}.${index}.postal`, formatted[0])
//                       }
//                     }
//                   }}
//                 />
//                 {error?.postal && (
//                   <p className='text-xs text-[#DB4437]'>
//                     {error.postal.message as string}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < ADDRESS.length && (
//         <Button
//           type='button'
//           variant='outline'
//           onClick={() =>
//             append({
//               label: ADDRESS[fields.length],
//               line1: '',
//               line2: '',
//               city: '',
//               region: '',
//               postal: '',
//               country: COUNTRY[0]
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
// import { useFormContext, useFieldArray, type ArrayPath } from 'react-hook-form'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { IMaskInput } from 'react-imask'
// import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
// import { Section } from './section'
// import type { Region, Country } from '@/data/customer-fields'
// import { cn } from '@/lib/utils'

// type AddressField = {
//   id: string
//   label: (typeof ADDRESS)[number]
//   line1: string
//   line2?: string
//   city: string
//   region: Region
//   postal: string
//   country: Country
// }

// type FormValues = {
//   [key: string]: AddressField[]
// }

// export function Address({ name }: { name: ArrayPath<FormValues> }) {
//   const { control, watch, setValue } = useFormContext<FormValues>()
//   const { fields, append, remove } = useFieldArray<FormValues>({
//     control,
//     name
//   })

//   // Watch each full address object so we have live values
//   // Fallback to the field snapshot if not yet updated
//   return (
//     <div className='space-y-4'>
//       {fields.map((field, index) => {
//         const currentField =
//           (watch(`${name}.${index}`) as AddressField) || field

//         const isCanada = currentField.country === 'Canada'
//         const regions = isCanada ? PROVINCE : STATE
//         const regionLabel = isCanada ? 'Province' : 'State'
//         const postalLabel = isCanada ? 'Postal Code' : 'ZIP Code'
//         const postalMask = isCanada ? 'a9a 9a9' : '99999-9999'

//         return (
//           <Section
//             key={field.id}
//             title={field.label}
//             summary={currentField.line1}
//             onRemove={index > 0 ? () => remove(index) : undefined}
//           >
//             <div className='space-y-4'>
//               {/* Country Select */}
//               <div>
//                 <Label>Country</Label>
//                 <Select
//                   value={currentField.country}
//                   onValueChange={value => {
//                     setValue(`${name}.${index}.country`, value as Country)
//                     setValue(
//                       `${name}.${index}.region`,
//                       value === 'Canada' ? 'British Columbia' : 'California'
//                     )
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder='Select country' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {COUNTRY.map(country => (
//                       <SelectItem key={country} value={country}>
//                         {country}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* State/Province */}
//               <div>
//                 <Label>{regionLabel}</Label>
//                 <Select
//                   value={currentField.region}
//                   onValueChange={value =>
//                     setValue(`${name}.${index}.region`, value as Region)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder={`Select ${regionLabel}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {regions.map(region => (
//                       <SelectItem key={region} value={region}>
//                         {region}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Postal/ZIP Code */}
//               <div>
//                 <Label>{postalLabel}</Label>
//                 <IMaskInput
//                   value={currentField.postal}
//                   onAccept={value =>
//                     setValue(`${name}.${index}.postal`, value.toUpperCase())
//                   }
//                   className={cn(
//                     'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
//                     'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
//                     'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
//                   )}
//                   mask={postalMask}
//                   definitions={{
//                     a: /[A-Za-z]/,
//                     '9': /[0-9]/
//                   }}
//                 />
//               </div>

//               {/* Other fields */}
//               <div>
//                 <Label>Street line 1</Label>
//                 <Input
//                   value={currentField.line1}
//                   onChange={e =>
//                     setValue(`${name}.${index}.line1`, e.target.value)
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Street line 2</Label>
//                 <Input
//                   value={currentField.line2 || ''}
//                   onChange={e =>
//                     setValue(`${name}.${index}.line2`, e.target.value)
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>City</Label>
//                 <Input
//                   value={currentField.city}
//                   onChange={e =>
//                     setValue(`${name}.${index}.city`, e.target.value)
//                   }
//                 />
//               </div>
//             </div>
//           </Section>
//         )
//       })}

//       {fields.length < ADDRESS.length && (
//         <Button
//           type='button'
//           variant='outline'
//           className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={() =>
//             append({
//               id: Date.now().toString(),
//               label: ADDRESS[fields.length],
//               line1: '',
//               line2: '',
//               city: '',
//               region: 'British Columbia',
//               postal: '',
//               country: 'Canada'
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
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { IMaskInput } from 'react-imask'
// import { cn } from '@/lib/utils'
// import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
// import { Section } from './section'

// export function Address({
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
//   const [addresses, setAddresses] = React.useState<any[]>(
//     defaultValue || [
//       {
//         label: ADDRESS[0],
//         line1: '',
//         line2: '',
//         city: '',
//         region: '',
//         postal: '',
//         country: COUNTRY[0]
//       }
//     ]
//   )

//   const addAddress = () => {
//     if (addresses.length < ADDRESS.length) {
//       setAddresses([
//         ...addresses,
//         {
//           label: ADDRESS[addresses.length],
//           line1: '',
//           line2: '',
//           city: '',
//           region: '',
//           postal: '',
//           country: COUNTRY[0]
//         }
//       ])
//     }
//   }

//   const removeAddress = (index: number) => {
//     if (index === 0) return // Prevent removing primary address
//     setAddresses(addresses.filter((_, i) => i !== index))
//   }

//   const updateAddress = (index: number, field: string, value: string) => {
//     const newAddresses = [...addresses]
//     newAddresses[index] = { ...newAddresses[index], [field]: value }

//     // Set default region based on country
//     if (field === 'country') {
//       newAddresses[index].region =
//         value === 'Canada' ? 'British Columbia' : 'California'
//     }

//     setAddresses(newAddresses)
//   }

//   return (
//     <div className={cn('w-full max-w-[338px] space-y-4')}>
//       {addresses.map((address, index) => (
//         <Section
//           key={index}
//           title={address.label}
//           summary={
//             address.line1
//               ? `${address.line1}${address.line2 ? `, ${address.line2}` : ''}`
//               : ''
//           }
//           onRemove={index > 0 ? () => removeAddress(index) : undefined}
//         >
//           <div className='space-y-6'>
//             <div className='-mt-4'>
//               <Label htmlFor={`${id}-${index}-line1`}>Street</Label>
//               <Input
//                 id={`${id}-${index}-line1`}
//                 name={`${name}.${index}.line1`}
//                 value={address.line1}
//                 onChange={e => updateAddress(index, 'line1', e.target.value)}
//                 required={required}
//                 disabled={disabled}
//                 className='mt-2'
//               />
//             </div>

//             <div>
//               <Input
//                 id={`${id}-${index}-line2`}
//                 name={`${name}.${index}.line2`}
//                 value={address.line2}
//                 onChange={e => updateAddress(index, 'line2', e.target.value)}
//                 disabled={disabled}
//               />
//             </div>

//             <div>
//               <Label htmlFor={`${id}-${index}-city`}>City</Label>
//               <Input
//                 id={`${id}-${index}-city`}
//                 name={`${name}.${index}.city`}
//                 value={address.city}
//                 onChange={e => updateAddress(index, 'city', e.target.value)}
//                 required={required}
//                 disabled={disabled}
//                 className='mt-2'
//               />
//             </div>

//             <div>
//               <Label htmlFor={`${id}-${index}-region`}>State/Province</Label>
//               <Select
//                 name={`${name}.${index}.region`}
//                 value={address.region}
//                 onValueChange={value => updateAddress(index, 'region', value)}
//                 disabled={disabled}
//               >
//                 <SelectTrigger id={`${id}-${index}-region`} className='mt-2'>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {address.country === 'Canada'
//                     ? PROVINCE.map(region => (
//                         <SelectItem key={region} value={region}>
//                           {region}
//                         </SelectItem>
//                       ))
//                     : STATE.map(region => (
//                         <SelectItem key={region} value={region}>
//                           {region}
//                         </SelectItem>
//                       ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor={`${id}-${index}-postal`}>Zip/Postal Code</Label>
//               <IMaskInput
//                 id={`${id}-${index}-postal`}
//                 name={`${name}.${index}.postal`}
//                 value={address.postal}
//                 onAccept={value =>
//                   updateAddress(index, 'postal', value.toUpperCase())
//                 }
//                 mask={address.country === 'Canada' ? 'A0A 0A0' : '00000-0000'}
//                 definitions={{
//                   A: /[A-Za-z]/,
//                   '0': /[0-9]/
//                 }}
//                 className='mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
//                 required={required}
//                 disabled={disabled}
//               />
//             </div>

//             <div>
//               <Label htmlFor={`${id}-${index}-country`}>Country</Label>
//               <Select
//                 name={`${name}.${index}.country`}
//                 value={address.country}
//                 onValueChange={value => updateAddress(index, 'country', value)}
//                 disabled={disabled}
//               >
//                 <SelectTrigger id={`${id}-${index}-country`} className='mt-2'>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {COUNTRY.map(country => (
//                     <SelectItem key={country} value={country}>
//                       {country}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Section>
//       ))}

//       {addresses.length < ADDRESS.length && (
//         <Button
//           variant='outline'
//           className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
//           onClick={addAddress}
//           disabled={disabled}
//         >
//           Add
//         </Button>
//       )}
//     </div>
//   )
// }
