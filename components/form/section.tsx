'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconCircleX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface SectionProps {
  title: string
  summary: string
  children: React.ReactNode
  onRemove?: () => void
  error?: {
    type: string
    message?: string
  } | null
  defaultOpen?: boolean
}

export function Section({
  title,
  summary,
  children,
  onRemove,
  error,
  defaultOpen = false
}: SectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div
      className={cn('overflow-hidden rounded-lg bg-background', error && '')}
    >
      <button
        type='button'
        className='flex w-full items-center justify-between py-3 text-left'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={cn('flex items-center gap-2')}>
          <Badge
            className={cn(
              'border border-accent bg-accent text-primary',
              error && 'border-[#DB4437] bg-background text-[#DB4437]'
            )}
          >
            {title}
          </Badge>
          <span className='truncate text-sm text-muted-foreground'>
            {summary}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div
              // className='space-y-4'
              className={cn('space-y-4', error && '')}
            >
              {children}
              {/* {error?.message && (
                <Alert className='border-[#DB4437] text-[#DB4437]'>
                  <div className='flex items-start gap-2'>
                    <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
                    <AlertDescription className='text-[#DB4437]'>
                      {error.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )} */}
              {onRemove && (
                <div className='py-2'>
                  <Button
                    type='button'
                    variant='outline'
                    // className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
                    className='w-full border border-[#DB4437] bg-[#DB4437] text-background hover:bg-background hover:text-[#DB4437]'
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// @note

// 'use client'

// import * as React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from '@/components/ui/button'
// import { ChevronDown } from 'lucide-react'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { IconCircleX } from '@tabler/icons-react'
// import { cn } from '@/lib/utils'

// interface SectionProps {
//   title: string
//   summary: string
//   children: React.ReactNode
//   onRemove?: () => void
//   error?: {
//     type: string
//     message?: string
//   } | null
//   defaultOpen?: boolean
// }

// export function Section({
//   title,
//   summary,
//   children,
//   onRemove,
//   error,
//   defaultOpen = false
// }: SectionProps) {
//   const [isOpen, setIsOpen] = React.useState(defaultOpen)

//   return (
//     <div
//       className={cn(
//         'overflow-hidden rounded-lg border bg-background shadow-sm',
//         error && 'border-[#DB4437]'
//       )}
//     >
//       <button
//         type='button'
//         className='flex w-full items-center justify-between px-4 py-3 text-left'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='flex items-center gap-2'>
//           <div
//             className={cn(
//               'rounded-md px-2 py-1 text-sm font-medium',
//               error
//                 ? 'bg-destructive/10 text-destructive'
//                 : 'bg-muted text-foreground'
//             )}
//           >
//             {title}
//           </div>
//           <span className='truncate text-sm text-muted-foreground'>
//             {summary}
//           </span>
//         </div>
//         <ChevronDown
//           className={cn(
//             'h-5 w-5 transition-transform duration-200',
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
//               {error?.message && (
//                 <Alert className='border-[#DB4437] text-[#DB4437]'>
//                   <div className='flex items-start gap-2'>
//                     <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
//                     <AlertDescription className='text-[#DB4437]'>
//                       {error.message}
//                     </AlertDescription>
//                   </div>
//                 </Alert>
//               )}
//               {onRemove && (
//                 <Button
//                   type='button'
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

// @note

// 'use client'

// import * as React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from '@/components/ui/button'
// import { ChevronDown } from 'lucide-react'
// import { cn } from '@/lib/utils'

// interface SectionProps {
//   title: string
//   summary: string
//   children: React.ReactNode
//   onRemove?: () => void
//   error?: {
//     type: string
//     message?: string
//   } | null
//   defaultOpen?: boolean
// }

// export function Section({
//   title,
//   summary,
//   children,
//   onRemove,
//   error,
//   defaultOpen = false
// }: SectionProps) {
//   const [isOpen, setIsOpen] = React.useState(defaultOpen)

//   return (
//     <div
//       className={cn(
//         'overflow-hidden rounded-lg border bg-background shadow-sm',
//         error && 'border-destructive'
//       )}
//     >
//       <button
//         type='button'
//         className='flex w-full items-center justify-between px-4 py-3 text-left'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='flex items-center gap-2'>
//           <div
//             className={cn(
//               'rounded-md px-2 py-1 text-sm font-medium',
//               error
//                 ? 'bg-destructive/10 text-destructive'
//                 : 'bg-muted text-foreground'
//             )}
//           >
//             {title}
//           </div>
//           <span className='truncate text-sm text-muted-foreground'>
//             {summary}
//           </span>
//         </div>
//         <ChevronDown
//           className={cn(
//             'h-5 w-5 transition-transform duration-200',
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
//               {error?.message && (
//                 <p className='text-sm text-destructive'>{error.message}</p>
//               )}
//               {onRemove && (
//                 <Button
//                   type='button'
//                   variant='outline'
//                   className='w-full border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground'
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

// @note

// 'use client'

// import * as React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { ChevronDown } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import type { FieldError } from 'react-hook-form'

// export function Section({
//   title,
//   summary,
//   children,
//   onRemove,
//   error,
//   defaultOpen = false
// }: {
//   title: string
//   summary: string
//   children: React.ReactNode
//   onRemove?: () => void
//   error?: FieldError
//   defaultOpen?: boolean
// }) {
//   const [isOpen, setIsOpen] = React.useState(defaultOpen)

//   return (
//     <div
//       className={cn(
//         'overflow-hidden rounded-lg border bg-background shadow-sm',
//         error && 'border-destructive'
//       )}
//     >
//       <button
//         type='button'
//         className='flex w-full items-center justify-between px-4 py-3 text-left'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='flex items-center gap-2'>
//           <Badge
//             className={cn(
//               'border border-accent bg-accent text-primary',
//               error && 'border-destructive bg-destructive/10 text-destructive'
//             )}
//           >
//             {title}
//           </Badge>
//           <span className='truncate text-sm text-muted-foreground'>
//             {summary}
//           </span>
//         </div>
//         <ChevronDown
//           className={cn(
//             'h-5 w-5 transition-transform duration-200',
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
//               {error && (
//                 <p className='text-sm text-destructive'>{error.message}</p>
//               )}
//               {onRemove && (
//                 <Button
//                   type='button'
//                   variant='outline'
//                   className='w-full border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground'
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

// @note

// 'use client'

// import * as React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { ChevronDown } from 'lucide-react'
// import { cn } from '@/lib/utils'

// export function Section({
//   title,
//   summary,
//   children,
//   onRemove,
//   defaultOpen = false
// }: {
//   title: string
//   summary: string
//   children: React.ReactNode
//   onRemove?: () => void
//   defaultOpen?: boolean
// }) {
//   const [isOpen, setIsOpen] = React.useState(defaultOpen)

//   return (
//     <div className='overflow-hidden rounded-lg border bg-background shadow-sm'>
//       <button
//         type='button'
//         className='flex w-full items-center justify-between px-4 py-3 text-left'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='flex items-center gap-2'>
//           <Badge className='border border-accent bg-accent text-primary'>
//             {title}
//           </Badge>
//           <span className='truncate text-sm text-muted-foreground'>
//             {summary}
//           </span>
//         </div>
//         <ChevronDown
//           className={cn(
//             'h-5 w-5 transition-transform duration-200',
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
