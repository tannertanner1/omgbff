"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Actions<T extends { id: string }>({
  row,
  onEdit,
  onDelete,
}: {
  row: T
  onEdit?: (row: T) => void
  onDelete?: (row: T) => Promise<void>
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      const returnTo = encodeURIComponent(pathname)
      const editUrl = `/organizations/${(row as any).organizationId}/customers/${row.id}/edit?returnTo=${returnTo}`
      router.push(editUrl)
    }
    setIsOpen(false)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) await onDelete(row)
    setIsOpen(false)
  }

  return (
    <div className="px-4 text-right">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            data-action-trigger
            className="group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <IconDots
              className={cn(
                "h-4 w-4 transition-colors",
                isOpen
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem
              onClick={handleEdit}
              className="hover:bg-secondary"
            >
              <IconPencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={handleDelete}
              className={cn(
                "text-[#DB4437] focus:bg-[#DB4437] focus:text-background"
              )}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// @note

// 'use client'

// import * as React from 'react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
// import { cn } from '@/lib/utils'
// import { usePathname, useRouter } from 'next/navigation'

// export function Actions<T extends { id: string; organizationId: string }>({
//   row,
//   onEdit,
//   onDelete
// }: {
//   row: T
//   onEdit?: (row: T) => void
//   onDelete?: (row: T) => Promise<void>
// }) {
//   const [isOpen, setIsOpen] = React.useState(false)
//   const pathname = usePathname()
//   const router = useRouter()

//   const handleEdit = (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (onEdit) {
//       const returnTo = encodeURIComponent(pathname)
//       const editUrl = `/organizations/${row.organizationId}/customers/${row.id}/edit?returnTo=${returnTo}`
//       router.push(editUrl)
//     }
//     setIsOpen(false)
//   }

//   const handleDelete = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (onDelete) await onDelete(row)
//     setIsOpen(false)
//   }

//   return (
//     <div className='px-4 text-right'>
//       <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//         <DropdownMenuTrigger asChild>
//           <button
//             data-action-trigger
//             className='group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors'
//             onClick={e => {
//               e.preventDefault()
//               e.stopPropagation()
//             }}
//           >
//             <IconDots
//               className={cn(
//                 'h-4 w-4 transition-colors',
//                 isOpen
//                   ? 'text-primary'
//                   : 'text-muted-foreground group-hover:text-primary'
//               )}
//             />
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align='end'>
//           {onEdit && (
//             <DropdownMenuItem
//               onClick={handleEdit}
//               className='hover:bg-secondary'
//             >
//               <IconPencil className='mr-2 h-4 w-4' />
//               Edit
//             </DropdownMenuItem>
//           )}
//           {onDelete && (
//             <DropdownMenuItem
//               onClick={handleDelete}
//               className={cn(
//                 'text-[#DB4437] focus:bg-[#DB4437] focus:text-background'
//               )}
//             >
//               <IconTrash className='mr-2 h-4 w-4' />
//               Delete
//             </DropdownMenuItem>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

// @note

// 'use client'

// import * as React from 'react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
// import { cn } from '@/lib/utils'

// export function Actions<T>({
//   row,
//   onEdit,
//   onDelete
// }: {
//   row: T
//   onEdit?: (row: T) => void
//   onDelete?: (row: T) => Promise<void>
// }) {
//   const [isOpen, setIsOpen] = React.useState(false)

//   const handleEdit = (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (onEdit) onEdit(row)
//     setIsOpen(false)
//   }

//   const handleDelete = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (onDelete) await onDelete(row)
//     setIsOpen(false)
//   }

//   return (
//     <div className='px-4 text-right'>
//       <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//         <DropdownMenuTrigger asChild>
//           <button
//             data-action-trigger
//             className='group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors'
//             onClick={e => {
//               e.preventDefault()
//               e.stopPropagation()
//             }}
//           >
//             <IconDots
//               className={cn(
//                 'h-4 w-4 transition-colors',
//                 isOpen
//                   ? 'text-primary'
//                   : 'text-muted-foreground group-hover:text-primary'
//               )}
//             />
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align='end'>
//           {onEdit && (
//             <DropdownMenuItem
//               onClick={handleEdit}
//               className='hover:bg-secondary'
//             >
//               <IconPencil className='mr-2 h-4 w-4' />
//               Edit
//             </DropdownMenuItem>
//           )}
//           {onDelete && (
//             <DropdownMenuItem
//               onClick={handleDelete}
//               className={cn(
//                 'text-[#DB4437] focus:bg-[#DB4437] focus:text-background'
//               )}
//             >
//               <IconTrash className='mr-2 h-4 w-4' />
//               Delete
//             </DropdownMenuItem>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }
