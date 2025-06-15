"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconCirclePlus } from "@tabler/icons-react"
import type { Organization } from "@/lib/abac"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/data-table/table"
import { deleteAction } from "./actions"
import { getColumns } from "./columns"

export function Component({
  organizations,
  userId,
}: {
  organizations: Organization[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Organization) => {
    router.push(`/organizations/${row.id}/edit`)
  }

  const handleDelete = async (row: Organization) => {
    if (!confirm("Are you sure you want to delete this organization?")) {
      return
    }

    const formData = new FormData()
    formData.append("id", row.id)

    try {
      const result = await deleteAction(null, formData)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.message || "Failed to delete organization")
      }
    } catch (error) {
      console.error("Failed to delete:", error)
      alert("Failed to delete organization")
    }
  }

  const columns = getColumns(userId, handleEdit, handleDelete)

  return (
    <div className="h-fit">
      <div className="mx-auto max-w-5xl p-4">
        <div className="-mt-3 mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <Link href={"/organizations/new"}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
            >
              <IconCirclePlus className="size-5" />
              <span className="sr-only">Create</span>
            </Button>
          </Link>
        </div>
        <Table
          data={organizations}
          columns={columns}
          link={(row) => `/organizations/${row.id}`}
        />
      </div>
    </div>
  )
}
