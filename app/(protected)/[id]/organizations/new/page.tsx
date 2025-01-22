import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { OrganizationForm } from "./form"

export default async function NewOrganizationPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.id) {
    redirect(`/${session.user.id}/organizations/new`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-3xl font-bold">Create New Organization</h1>
      <OrganizationForm userId={params.id} />
    </div>
  )
}

