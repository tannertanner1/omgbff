'use client'

import type { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Options } from './options'

export function Toolbar<TData>({
  table,
  filterColumn,
  searchPlaceholder
}: {
  table: Table<TData>
  filterColumn?: string
  searchPlaceholder?: string
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {filterColumn && (
          <Input
            placeholder={searchPlaceholder || `Filter ${filterColumn}...`}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
      </div>
      <Options table={table} />
    </div>
  )
}

// 'use client'

// import { IconX } from '@tabler/icons-react'
// import type { Table } from '@tanstack/react-table'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Options } from './options'

// export function Toolbar<TData>({
//   table,
//   filterColumn,
//   filterPlaceholder
// }: {
//   table: Table<TData>
//   filterColumn?: string
//   filterPlaceholder?: string
// }) {
//   const isFiltered = table.getState().columnFilters.length > 0

//   return (
//     <div className='flex items-center justify-between'>
//       <div className='flex flex-1 items-center space-x-2'>
//         {filterColumn && (
//           <Input
//             placeholder={filterPlaceholder || `Filter ${filterColumn}...`}
//             value={
//               (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
//             }
//             onChange={event =>
//               table.getColumn(filterColumn)?.setFilterValue(event.target.value)
//             }
//             className='h-8 w-[250px] bg-background'
//           />
//         )}
//         {isFiltered && (
//           <Button
//             variant='ghost'
//             onClick={() => table.resetColumnFilters()}
//             className='h-8 px-2 lg:px-3'
//           >
//             Reset
//             <IconX className='ml-2 h-4 w-4' />
//           </Button>
//         )}
//       </div>
//       <Options table={table} />
//     </div>
//   )
// }
