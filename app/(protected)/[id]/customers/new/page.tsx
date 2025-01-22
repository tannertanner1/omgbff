import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CustomerForm } from "./form"

export default async function NewCustomerPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.id) {
    redirect(`/${session.user.id}/customers/new`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-3xl font-bold">Add New Customer</h1>
      <CustomerForm userId={params.id} />
    </div>
  )
}

