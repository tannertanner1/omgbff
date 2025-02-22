'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'
import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
import { Section } from './section'

export function Address({
  id,
  name,
  defaultValue,
  required,
  disabled
}: {
  id: string
  name: string
  defaultValue?: any
  required?: boolean
  disabled?: boolean
}) {
  const [addresses, setAddresses] = React.useState<any[]>(
    defaultValue || [
      {
        label: ADDRESS[0],
        line1: '',
        line2: '',
        city: '',
        region: '',
        postal: '',
        country: COUNTRY[0]
      }
    ]
  )

  const addAddress = () => {
    if (addresses.length < ADDRESS.length) {
      setAddresses([
        ...addresses,
        {
          label: ADDRESS[addresses.length],
          line1: '',
          line2: '',
          city: '',
          region: '',
          postal: '',
          country: COUNTRY[0]
        }
      ])
    }
  }

  const removeAddress = (index: number) => {
    if (index === 0) return // Prevent removing primary address
    setAddresses(addresses.filter((_, i) => i !== index))
  }

  const updateAddress = (index: number, field: string, value: string) => {
    const newAddresses = [...addresses]
    newAddresses[index] = { ...newAddresses[index], [field]: value }

    // Set default region based on country
    if (field === 'country') {
      newAddresses[index].region =
        value === 'Canada' ? 'British Columbia' : 'California'
    }

    setAddresses(newAddresses)
  }

  return (
    <div className={cn('w-full max-w-[338px] space-y-4')}>
      {addresses.map((address, index) => (
        <Section
          key={index}
          title={address.label}
          summary={
            address.line1
              ? `${address.line1}${address.line2 ? `, ${address.line2}` : ''}`
              : ''
          }
          onRemove={index > 0 ? () => removeAddress(index) : undefined}
        >
          <div className='space-y-6'>
            <div className='-mt-4'>
              <Label htmlFor={`${id}-${index}-line1`}>Street</Label>
              <Input
                id={`${id}-${index}-line1`}
                name={`${name}.${index}.line1`}
                value={address.line1}
                onChange={e => updateAddress(index, 'line1', e.target.value)}
                required={required}
                disabled={disabled}
                className='mt-2'
              />
            </div>

            <div>
              <Input
                id={`${id}-${index}-line2`}
                name={`${name}.${index}.line2`}
                value={address.line2}
                onChange={e => updateAddress(index, 'line2', e.target.value)}
                disabled={disabled}
              />
            </div>

            <div>
              <Label htmlFor={`${id}-${index}-city`}>City</Label>
              <Input
                id={`${id}-${index}-city`}
                name={`${name}.${index}.city`}
                value={address.city}
                onChange={e => updateAddress(index, 'city', e.target.value)}
                required={required}
                disabled={disabled}
                className='mt-2'
              />
            </div>

            <div>
              <Label htmlFor={`${id}-${index}-region`}>State/Province</Label>
              <Select
                name={`${name}.${index}.region`}
                value={address.region}
                onValueChange={value => updateAddress(index, 'region', value)}
                disabled={disabled}
              >
                <SelectTrigger id={`${id}-${index}-region`} className='mt-2'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {address.country === 'Canada'
                    ? PROVINCE.map(region => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))
                    : STATE.map(region => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`${id}-${index}-postal`}>Zip/Postal Code</Label>
              <IMaskInput
                id={`${id}-${index}-postal`}
                name={`${name}.${index}.postal`}
                value={address.postal}
                onAccept={value =>
                  updateAddress(index, 'postal', value.toUpperCase())
                }
                mask={address.country === 'Canada' ? 'A0A 0A0' : '00000-0000'}
                definitions={{
                  A: /[A-Za-z]/,
                  '0': /[0-9]/
                }}
                className='mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required={required}
                disabled={disabled}
              />
            </div>

            <div>
              <Label htmlFor={`${id}-${index}-country`}>Country</Label>
              <Select
                name={`${name}.${index}.country`}
                value={address.country}
                onValueChange={value => updateAddress(index, 'country', value)}
                disabled={disabled}
              >
                <SelectTrigger id={`${id}-${index}-country`} className='mt-2'>
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
      ))}

      {addresses.length < ADDRESS.length && (
        <Button
          variant='outline'
          className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
          onClick={addAddress}
          disabled={disabled}
        >
          Add
        </Button>
      )}
    </div>
  )
}

// 'use client'

// import * as React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { ChevronDown } from 'lucide-react'
// import { IMaskInput } from 'react-imask'
// import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
// import { cn } from '@/lib/utils'

// const Section = ({
//   title,
//   summary,
//   children,
//   onRemove
// }: {
//   title: string
//   summary: string
//   children: React.ReactNode
//   onRemove?: () => void
// }) => {
//   const [isOpen, setIsOpen] = React.useState(false)

//   return (
//     <div className='w-full overflow-hidden rounded-lg border bg-background shadow-sm'>
//       <button
//         type='button'
//         className='flex w-full items-center justify-between px-4 py-3 text-left'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='flex w-[calc(100%-1.25rem)] items-center gap-2 py-1'>
//           <Badge className='flex-shrink-0 border border-accent bg-accent text-primary'>
//             {title}
//           </Badge>
//           <div className={cn('min-w-0 max-w-sm flex-1')}>
//             <p className='truncate text-sm text-muted-foreground'>{summary}</p>
//           </div>
//         </div>
//         <div className='flex-shrink-0'>
//           <ChevronDown
//             className={cn(
//               'h-5 w-5 transition-transform duration-200',
//               isOpen && 'rotate-180'
//             )}
//           />
//         </div>
//       </button>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0 }}
//             animate={{ height: 'auto' }}
//             exit={{ height: 0 }}
//             transition={{ duration: 0.2 }}
//             className='overflow-hidden'
//           >
//             <div className='w-full max-w-full space-y-4 p-4'>
//               {children}
//               {onRemove && (
//                 <Button
//                   variant='outline'
//                   className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
//                   onClick={onRemove}
//                 >
//                   Remove
//                 </Button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

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
//                 className='mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
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
