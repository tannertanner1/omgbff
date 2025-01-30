'use client'

import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  IconSelector,
  IconArrowUp,
  IconArrowDown,
  IconEyeOff,
  IconDots,
  IconPencil,
  IconTrash
} from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const Actions = React.memo(({ row }: { row: any }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const item = row.original

  return (
    <div className='px-4 text-right'>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className='group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors'>
            <IconDots
              className={cn(
                'h-4 w-4 transition-colors',
                isOpen
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-primary'
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => console.log('Edit', item)}
            className='hover:bg-secondary'
          >
            <IconPencil className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log('Delete', item)}
            className={cn(
              'text-[#DB4437] focus:bg-[#DB4437] focus:text-background'
            )}
          >
            <IconTrash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
})
Actions.displayName = 'Actions'

const Header = React.memo(
  ({ column, label }: { column: any; label: string }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'flex cursor-pointer select-none items-center gap-2',
              'transition-colors hover:text-primary',
              isOpen && 'text-primary'
            )}
          >
            <span>{label}</span>
            <IconSelector className='h-4 w-4' />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='start'
          side='bottom'
          sticky='partial'
          className='w-[100px]'
          collisionPadding={12}
          updatePositionStrategy='always'
        >
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <IconArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <IconArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <IconEyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
Header.displayName = 'Header'

export function Columns<T extends object>(data: T[]): ColumnDef<T>[] {
  if (data.length === 0) return []

  const sample = data[0]
  const columns: ColumnDef<T>[] = Object.keys(sample).map(key => ({
    accessorKey: key,
    header: ({ column }) => (
      <Header
        column={column}
        label={key.charAt(0).toUpperCase() + key.slice(1)}
      />
    ),
    cell: ({ row }) => (
      <div className='px-4'>{row.getValue(key)?.toString()}</div>
    )
  }))

  columns.push({
    id: 'actions',
    cell: ({ row }) => <Actions row={row} />
  })

  return columns
}

// 'use client'

// import * as React from 'react'
// import type { ColumnDef } from '@tanstack/react-table'
// import {
//   IconSelector,
//   IconArrowUp,
//   IconArrowDown,
//   IconEyeOff,
//   IconDots,
//   IconPencil,
//   IconTrash
// } from '@tabler/icons-react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { cn } from '@/lib/utils'

// const Actions = React.memo(({ row }: { row: any }) => {
//   const [isOpen, setIsOpen] = React.useState(false)
//   const item = row.original

//   return (
//     <div className='px-4 text-right'>
//       <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//         <DropdownMenuTrigger asChild>
//           <button className='group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors'>
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
//           <DropdownMenuItem
//             onClick={() => console.log('Edit', item)}
//             className='hover:bg-secondary'
//           >
//             <IconPencil className='mr-2 h-4 w-4' />
//             Edit
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => console.log('Delete', item)}
//             // className='text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
//             className={cn(
//               'text-[#DB4437] focus:bg-[#DB4437] focus:text-background'
//             )}
//           >
//             <IconTrash className='mr-2 h-4 w-4' />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// })
// Actions.displayName = 'Actions'

// export function Columns<T extends object>(data: T[]): ColumnDef<T>[] {
//   if (data.length === 0) return []

//   const sample = data[0]
//   const columns: ColumnDef<T>[] = Object.keys(sample).map(key => ({
//     accessorKey: key,
//     header: ({ column }) => {
//       const [isOpen, setIsOpen] = React.useState(false)
//       return (
//         <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//           <DropdownMenuTrigger asChild>
//             <div
//               className={cn(
//                 'flex cursor-pointer select-none items-center gap-2',
//                 'transition-colors hover:text-primary',
//                 isOpen && 'text-primary'
//               )}
//             >
//               <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
//               <IconSelector className='h-4 w-4' />
//             </div>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align='start'
//             side='bottom'
//             sticky='partial'
//             className='w-[100px]'
//             collisionPadding={12}
//             updatePositionStrategy='always'
//           >
//             <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
//               <IconArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
//               Asc
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
//               <IconArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
//               Desc
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
//               <IconEyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
//               Hide
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//     cell: ({ row }) => (
//       <div className='px-4'>{row.getValue(key)?.toString()}</div>
//     )
//   }))

//   columns.push({
//     id: 'actions',
//     cell: ({ row }) => <Actions row={row} />
//   })

//   return columns
// }
