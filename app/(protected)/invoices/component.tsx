"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconCirclePlus } from "@tabler/icons-react"
import type { Invoice } from "@/lib/abac.ts"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/data-table/table"
import { getColumns } from "./columns"

export function Component({
  invoices,
  userId,
}: {
  invoices: Invoice[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Invoice) => {
    router.push(`/invoices/${row.id}/edit`)
  }

  const handleDelete = async (row: Invoice) => {
    if (!confirm("Are you sure you want to delete this invoice?")) {
      return
    }

    const formData = new FormData()
    formData.append("id", row.id)

    try {
      const response = await fetch(`/api/invoices/${row.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete invoice")
      }
    } catch (error) {
      console.error("Failed to delete:", error)
      alert("Failed to delete invoice")
    }
  }

  const columns = getColumns(userId, handleEdit, handleDelete)

  return (
    <div className="h-fit">
      <div className="mx-auto max-w-5xl p-4">
        <div className="-mt-3 mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <Link href={"/invoices/new"}>
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
          data={invoices}
          columns={columns}
          link={(row) =>
            `/organizations/${row.organizationId}/invoices/${row.id}/edit`
          }
        />
      </div>
    </div>
  )
}
