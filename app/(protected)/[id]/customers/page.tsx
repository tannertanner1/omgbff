import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { customers } from "@/db/schema/invoices"
import { eq } from "drizzle-orm"
import { DataTable } from "@/components/data-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"

export default async function CustomersPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.id) {
    redirect(`/${session.user.id}/customers`)
  }

  const userCustomers = await db
    .select()
    .from(customers)
    .where(eq(customers.userId, params.id))
    .orderBy(customers.createdAt)

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button asChild>
          <Link href={`/${params.id}/customers/new`}>Add Customer</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={userCustomers} filterColumn="name" />
    </div>
  )
}

