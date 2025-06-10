"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconCirclePlus } from "@tabler/icons-react"
import type { Customer } from "@/lib/abac"
import { Table } from "@/components/data-table/table"
import { deleteAction } from "./actions"
import { getCustomerColumns } from "./columns"

export function Customers({
  customers,
  organizationId,
  userId,
}: {
  customers: Customer[]
  organizationId: string
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Customer) => {
    router.push(`/organizations/${organizationId}/customers/${row.id}/edit`)
  }

  const handleDelete = async (row: Customer) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return
    }

    const formData = new FormData()
    formData.append("id", row.id.toString())
    formData.append("organizationId", organizationId)

    try {
      const result = await deleteAction(null, formData)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.message || "Failed to delete customer")
      }
    } catch (error) {
      console.error("Failed to delete:", error)
      alert("Failed to delete customer")
    }
  }

  const columns = getCustomerColumns(
    userId,
    organizationId,
    handleEdit,
    handleDelete
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customers</h2>
        <Link href={`/organizations/${organizationId}/customers/new`}>
          <IconCirclePlus className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
        </Link>
      </div>
      <Table
        data={customers}
        columns={columns}
        link={(row) =>
          `/organizations/${organizationId}/customers/${row.id}/edit`
        }
      />
    </div>
  )
}
