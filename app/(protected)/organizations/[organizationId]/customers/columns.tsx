"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ADDRESS, PHONE } from "@/data/customer-fields"
import type { Customer } from "@/lib/abac"
import { Badge } from "@/components/ui/badge"
import { Actions } from "@/components/data-table/actions"
import { Header } from "@/components/data-table/header"

export function getCustomerColumns(
  userId: string,
  organizationId: string,
  onEdit: (row: Customer) => void,
  onDelete: (row: Customer) => Promise<void>
): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => <Header column={column} label="ID" />,
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <Header column={column} label="Email" />,
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <Header column={column} label="Name" />,
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "invoiceCount",
      header: ({ column }) => <Header column={column} label="Invoices" />,
      cell: ({ row }) => row.getValue("invoiceCount"),
    },
    {
      accessorKey: "invoiceTotal",
      header: ({ column }) => <Header column={column} label="Total" />,
      cell: ({ row }) => (
        <>
          $
          {(row.getValue("invoiceTotal") as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => <Header column={column} label="Address" />,
      cell: ({ row }) => {
        const customer = row.original
        const mailingAddress = customer.address?.find(
          (addr) => addr.label === ADDRESS[0]
        )
        return (
          <Badge
            className={
              mailingAddress
                ? "bg-secondary text-secondary-foreground"
                : "bg-transparent"
            }
          >
            {mailingAddress
              ? `${mailingAddress.line1}${mailingAddress.line2 ? `, ${mailingAddress.line2}` : ""}, ${mailingAddress.city}, ${mailingAddress.region} ${mailingAddress.postal}, ${mailingAddress.country}`
              : ""}
          </Badge>
        )
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <Header column={column} label="Phone" />,
      cell: ({ row }) => {
        const customer = row.original
        const primaryPhone = customer.phone?.find(
          (phone) => phone.label === PHONE[0]
        )
        return (
          <Badge
            className={
              primaryPhone
                ? "bg-secondary text-secondary-foreground"
                : "bg-transparent"
            }
          >
            {primaryPhone ? primaryPhone.number : ""}
          </Badge>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <Header column={column} label="Updated" />,
      cell: ({ row }) => {
        const dateValue = row.getValue("updatedAt")
        return dateValue instanceof Date
          ? format(dateValue, "MMM d, yyyy")
          : typeof dateValue === "string"
            ? format(new Date(dateValue), "MMM d, yyyy")
            : "Invalid Date"
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <Header column={column} label="Created" />,
      cell: ({ row }) => {
        const dateValue = row.getValue("createdAt")
        return dateValue instanceof Date
          ? format(dateValue, "MMM d, yyyy")
          : typeof dateValue === "string"
            ? format(new Date(dateValue), "MMM d, yyyy")
            : "Invalid Date"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}
