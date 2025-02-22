'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IMaskInput } from 'react-imask'
import { PHONE } from '@/data/customer-fields'
import { Section } from './section'

export function Phone({
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
  const [phones, setPhones] = React.useState<any[]>(
    defaultValue || [{ label: PHONE[0], number: '' }]
  )

  const addPhone = () => {
    if (phones.length < PHONE.length) {
      setPhones([...phones, { label: PHONE[phones.length], number: '' }])
    }
  }

  const removePhone = (index: number) => {
    if (index === 0) return // Prevent removing primary phone
    setPhones(phones.filter((_, i) => i !== index))
  }

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones]
    newPhones[index] = { ...newPhones[index], number: value }
    setPhones(newPhones)
  }

  return (
    <div className='space-y-4'>
      {phones.map((phone, index) => (
        <Section
          key={index}
          title={phone.label}
          summary={phone.number || ''}
          onRemove={index > 0 ? () => removePhone(index) : undefined}
        >
          <input
            type='hidden'
            name={`${name}.${index}.label`}
            value={phone.label}
          />
          <div className={cn('-mt-4 grid gap-2')}>
            <Label htmlFor={`${id}-${index}-number`}>Number</Label>
            <IMaskInput
              id={`${id}-${index}-number`}
              name={`${name}.${index}.number`}
              value={phone.number}
              onAccept={value => updatePhone(index, value)}
              mask='(000) 000-0000'
              required={required}
              disabled={disabled}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
        </Section>
      ))}

      {phones.length < PHONE.length && (
        <Button
          type='button'
          variant='outline'
          className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
          onClick={addPhone}
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
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { ChevronDown } from 'lucide-react'
// import { PHONE } from '@/data/customer-fields'
// import { cn } from '@/lib/utils'
// import { IMaskInput } from 'react-imask'

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
//     <div className='overflow-hidden rounded-lg border bg-background shadow-sm'>
//       <button
//         type='button'
//         className='flex w-full items-center justify-between px-4 py-3 text-left'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='mr-4 flex min-w-0 flex-1 items-center'>
//           <Badge className='shrink-0 border border-accent bg-accent text-primary'>
//             {title}
//           </Badge>
//           <div className='ml-2 min-w-0 flex-1'>
//             <span className='block truncate text-sm text-muted-foreground'>
//               {summary}
//             </span>
//           </div>
//         </div>
//         <ChevronDown
//           className={cn(
//             'h-5 w-5 shrink-0 transition-transform duration-200',
//             isOpen && 'rotate-180'
//           )}
//         />
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
//             <div className='space-y-4 p-4'>
//               {children}
//               {onRemove && (
//                 <Button
//                   type='button'
//                   variant='destructive'
//                   onClick={onRemove}
//                   className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
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

//           <div className=''>
//             <div className={cn('-mt-4 grid gap-2')}>
//               <Label htmlFor={`${id}-${index}-number`}>Number</Label>
//               <IMaskInput
//                 id={`${id}-${index}-number`}
//                 name={`${name}.${index}.number`}
//                 value={phone.number}
//                 onAccept={value => updatePhone(index, value)}
//                 mask='(000) 000-0000'
//                 required={required}
//                 disabled={disabled}
//                 className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
//               />
//             </div>
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
