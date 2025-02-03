// "use client"
// import type { ColumnDef } from "@tanstack/react-table"
// import { Header } from "@/components/data-table/header"
// import { Actions } from "@/components/data-table/actions"
// import { format } from "date-fns"
// import type { invoices } from "@/db/schema"

// type Invoice = typeof invoices.$inferSelect & {
//   id: string
//   customerId: string
//   organizationId: string
// }

// export function getInvoiceColumns(
//   userId: string,
//   onEdit: (row: Invoice) => void,
//   onDelete: (row: Invoice) => Promise<void>,
// ): ColumnDef<Invoice>[] {
//   return [
//     {
//       accessorKey: "description",
//       header: ({ column }) => <Header column={column} label="Description" />,
//       cell: ({ row }) => <div className="px-4">{row.getValue("description")}</div>,
//     },
//     {
//       accessorKey: "value",
//       header: ({ column }) => <Header column={column} label="Value" />,
//       cell: ({ row }) => <div className="px-4">${row.getValue("value")}</div>,
//     },
//     {
//       accessorKey: "status",
//       header: ({ column }) => <Header column={column} label="Status" />,
//       cell: ({ row }) => <div className="px-4">{row.getValue("status")}</div>,
//     },
//     {
//       accessorKey: "createdAt",
//       header: ({ column }) => <Header column={column} label="Created" />,
//       cell: ({ row }) => <div className="px-4">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>,
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />,
//     },
//   ]
// }
