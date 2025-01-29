'use client'

import type { Table } from '@tanstack/react-table'
import {
  IconCircleChevronLeft,
  IconCircleChevronRight
} from '@tabler/icons-react'

export function Pagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className='flex items-center justify-end py-4'>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconCircleChevronLeft
            className='h-6 w-6 p-0'
            style={{
              opacity: !table.getCanPreviousPage() ? 0.25 : 0.5
            }}
          />
          <span className='sr-only'>Previous page</span>
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconCircleChevronRight
            className='h-6 w-6 p-0'
            style={{
              opacity: !table.getCanNextPage() ? 0.25 : 0.5
            }}
          />
          <span className='sr-only'>Next page</span>
        </button>
      </div>
    </div>
  )
}
