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
            className={cn(
              "group inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors focus:ring-0 focus:outline-none",
              isOpen && "bg-accent text-accent-foreground",
              "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <IconDots className="h-4 w-4 transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="[&[data-slot=dropdown-menu-content]]:bg-background [&[data-slot=dropdown-menu-content]]:text-foreground"
        >
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
                "focus:bg-transparent focus:text-[#DB4437] focus:inset-ring focus:inset-ring-[#DB4437]"
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
