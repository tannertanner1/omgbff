"use client"

import * as React from "react"
import { IconDotsCircleHorizontal } from "@tabler/icons-react"
import type { Table } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

// Helper function to get column label
const getColumnLabel = (column: any) => {
  if (typeof column.columnDef.header === "string") {
    return column.columnDef.header
  }
  if (typeof column.columnDef.header === "function") {
    const headerProps = { column } // Minimal props needed for the header function
    const headerContent = column.columnDef.header(headerProps)
    // If it's a React element with a label prop, try to extract it
    if (headerContent?.props?.label) {
      return headerContent.props.label
    }
  }
  // Fallback to formatted column ID if no header is found
  return column.id.charAt(0).toUpperCase() + column.id.slice(1)
}

export function Filter<TData>({ table }: { table: Table<TData> }) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>("")

  // Set initial filter column to first available column
  React.useEffect(() => {
    const firstColumn = table
      .getAllColumns()
      .find(
        (column) =>
          typeof column.accessorFn !== "undefined" &&
          !["select", "actions"].includes(column.id)
      )
    if (firstColumn && !selectedColumn) {
      setSelectedColumn(firstColumn.id)
    }
  }, [table, selectedColumn])

  // Get the current column and its filter value
  const column = selectedColumn ? table.getColumn(selectedColumn) : null
  const filterValue = column?.getFilterValue() as string

  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder={
          selectedColumn ? `Filter by ${selectedColumn}...` : "Filter..."
        }
        value={filterValue ?? ""}
        onChange={(event) => column?.setFilterValue(event.target.value)}
        className="w-full"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-9 w-9 items-center justify-center">
            <IconDotsCircleHorizontal className="h-6 w-6" />
            <span className="sr-only">Filter column</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[144px]">
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
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      !["select", "actions"].includes(column.id)
                  )
                  .map((column) => (
                    <DropdownMenuRadioItem
                      key={column.id}
                      value={column.id}
                      className="capitalize"
                    >
                      {getColumnLabel(column)}
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
