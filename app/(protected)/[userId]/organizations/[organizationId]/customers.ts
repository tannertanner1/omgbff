// "use client"

// import type { ColumnDef } from "@tanstack/react-table"
// import { Header } from "@/components/data-table/header"
// import { Actions } from "@/components/data-table/actions"
// import { format } from "date-fns"
// import type { customers } from "@/db/schema"

// type Customer = typeof customers.$inferSelect & {
//   id: string
//   organizationId: string
// }

// export function getCustomerColumns(
//   userId: string,
//   onEdit: (row: Customer) => void,
//   onDelete: (row: Customer) => Promise<void>,
// ): ColumnDef<Customer>[] {
//   return [
//     {
//       accessorKey: "name",
//       header: ({ column }) => <Header column={column} label="Name" />,
//       cell: ({ row }) => <div className="px-4">{row.getValue("name")}</div>,
//     },
//     {
//       accessorKey: "email",
//       header: ({ column }) => <Header column={column} label="Email" />,
//       cell: ({ row }) => <div className="px-4">{row.getValue("email")}</div>,
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
