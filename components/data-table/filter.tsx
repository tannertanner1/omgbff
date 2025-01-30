'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import { IconDotsCircleHorizontal } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'

export function Filter<TData>({ table }: { table: Table<TData> }) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>('')

  // Set initial filter column to first available column
  React.useEffect(() => {
    const firstColumn = table
      .getAllColumns()
      .find(
        column =>
          typeof column.accessorFn !== 'undefined' &&
          !['select', 'actions'].includes(column.id)
      )
    if (firstColumn && !selectedColumn) {
      setSelectedColumn(firstColumn.id)
    }
  }, [table, selectedColumn])

  // Get the current column and its filter value
  const column = selectedColumn ? table.getColumn(selectedColumn) : null
  const filterValue = column?.getFilterValue() as string

  return (
    <div className='flex items-center gap-3'>
      <Input
        placeholder={
          selectedColumn ? `Filter by ${selectedColumn}...` : 'Filter...'
        }
        value={filterValue ?? ''}
        onChange={event => column?.setFilterValue(event.target.value)}
        className='w-full'
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='flex h-9 w-9 items-center justify-center'>
            <IconDotsCircleHorizontal className='h-6 w-6' />
            <span className='sr-only'>Filter column</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[144px]'>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Filter</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={selectedColumn}
                onValueChange={setSelectedColumn}
              >
                {table
                  .getAllColumns()
                  .filter(
                    column =>
                      typeof column.accessorFn !== 'undefined' &&
                      !['select', 'actions'].includes(column.id)
                  )
                  .map(column => (
                    <DropdownMenuRadioItem
                      key={column.id}
                      value={column.id}
                      className='capitalize'
                    >
                      {column.id}
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
