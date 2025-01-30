'use client'

import type { Table } from '@tanstack/react-table'
import {
  IconCircleChevronLeft,
  IconCircleChevronRight
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export function Pagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className='flex items-center justify-end py-4'>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconCircleChevronLeft
            className={cn(
              'h-6 w-6 p-0 transition-colors',
              !table.getCanPreviousPage()
                ? 'text-muted-foreground/50'
                : 'text-muted-foreground hover:text-primary'
            )}
          />
          <span className='sr-only'>Previous page</span>
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconCircleChevronRight
            className={cn(
              'h-6 w-6 p-0 transition-colors',
              !table.getCanNextPage()
                ? 'text-muted-foreground/50'
                : 'text-muted-foreground hover:text-primary'
            )}
          />
          <span className='sr-only'>Next page</span>
        </button>
      </div>
    </div>
  )
}
