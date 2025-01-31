'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  IconSelector,
  IconArrowUp,
  IconArrowDown,
  IconEyeOff
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export const Header = React.memo(
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
