'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export const Actions = React.memo(
  ({
    row,
    onEdit,
    onDelete
  }: {
    row: any
    onEdit?: (row: any) => void
    onDelete?: (row: any) => void
  }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const item = row.original

    return (
      <div className='px-4 text-right'>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              data-action-trigger
              className='group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors'
            >
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
              onClick={() =>
                onEdit ? onEdit(item) : console.log('Edit', item)
              }
              className='hover:bg-secondary'
            >
              <IconPencil className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onDelete ? onDelete(item) : console.log('Delete', item)
              }
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
  }
)
Actions.displayName = 'Actions'
