"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconCirclePlus } from "@tabler/icons-react"
import type { User } from "@/lib/abac"
import { Table } from "@/components/data-table/table"
import { deleteAction } from "./actions"
import { getColumns } from "./columns"

export function Component({
  users,
  userId,
}: {
  users: User[]
  userId: string
}) {
  const router = useRouter()
  const [data, setData] = useState<User[]>(users)

  const handleEdit = (row: User) => {
    router.push(`/users/${row.id}/edit`)
  }

  const handleDelete = async (row: User) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    const formData = new FormData()
    formData.append("id", row.id)

    try {
      const response = await deleteAction(null, formData)

      if (response.success) {
        setData(data.filter((user) => user.id !== row.id))
        router.refresh()
      } else {
        console.error("Failed to delete:", response.message)
        alert(response.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error in delete handler:", error)
      alert("An error occurred while deleting the user")
    }
  }

  const columns = getColumns(userId, handleEdit, handleDelete)

  return (
    <div className="flex h-fit">
      <div className="mx-auto w-full max-w-5xl p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Users</h1>
          <Link href={`/users/new`}>
            <IconCirclePlus className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
        <Table
          data={data}
          columns={columns}
          link={(row) => `/users/${row.id}/edit`}
        />
      </div>
    </div>
  )
}
