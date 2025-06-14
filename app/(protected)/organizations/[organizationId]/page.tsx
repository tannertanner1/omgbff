import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices,
  getOrganizationUsers,
} from "@/db/queries"
import { IconCircleX } from "@tabler/icons-react"
import { hasPermission } from "@/lib/abac"
import type { Customer, Invoice, User } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Button } from "@/components/ui/button"
import { Customers } from "./customers/component"
import { Invoices } from "./invoices/component"
import { Users } from "./users/component"

export default async function Page({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const user = await verifySession()
  const { organizationId } = await params

  if (!hasPermission(user, "organizations", "view")) {
    redirect("/")
  }

  const [organization, customersData, invoicesData, usersData] =
    await Promise.all([
      getOrganizationById({ organizationId }),
      getOrganizationCustomers({ organizationId }),
      getOrganizationInvoices({ organizationId }),
      getOrganizationUsers({ organizationId }),
    ])

  if (!organization) return notFound()

  // Process users data
  const users =
    usersData?.map((userData) => {
      // Use type assertion to access invitations data that TypeScript doesn't know about
      const rawUserData = userData as any
      const invitation = rawUserData.invitations?.[0]

      // Ensure Date objects
      const createdAt =
        userData.createdAt instanceof Date
          ? userData.createdAt
          : new Date(userData.createdAt)

      // For invited users who haven't accepted yet, leave updatedAt blank
      const updatedAt =
        invitation && !userData.emailVerified
          ? null
          : userData.updatedAt instanceof Date
            ? userData.updatedAt
            : new Date(userData.updatedAt)

      const emailVerified =
        userData.emailVerified instanceof Date
          ? userData.emailVerified
          : userData.emailVerified
            ? new Date(userData.emailVerified)
            : null

      // Create a user object that matches the User type, WITHOUT status field
      return {
        id: userData.id,
        email: userData.email || "",
        name: userData.name || "",
        role: userData.role,
        emailVerified,
        image: userData.image,
        createdAt,
        updatedAt,
        // No status field as per requirements
        invitedBy: invitation?.user?.name || invitation?.user?.email || "",
      } as User
    }) || []

  // Process customers data
  const customers: Customer[] =
    customersData?.map((customer) => ({
      ...customer,
      createdAt:
        customer.createdAt instanceof Date
          ? customer.createdAt
          : new Date(customer.createdAt),
      updatedAt:
        customer.updatedAt instanceof Date
          ? customer.updatedAt
          : new Date(customer.updatedAt),
      invoiceCount: Number(customer.invoiceCount) || 0,
      invoiceTotal: Number(customer.invoiceTotal) || 0,
      invoices:
        customer.invoices?.map((invoice) => ({
          id: invoice.id,
          amount: invoice.amount,
        })) || [],
      address: customer.address || null,
      phone: customer.phone || null,
    })) || []

  // Process invoices data
  const invoices: Invoice[] =
    invoicesData?.map((invoice) => ({
      ...invoice,
      createdAt:
        invoice.createdAt instanceof Date
          ? invoice.createdAt
          : new Date(invoice.createdAt),
      updatedAt:
        invoice.updatedAt instanceof Date
          ? invoice.updatedAt
          : new Date(invoice.updatedAt),
    })) || []

  return (
    <div className="flex h-fit">
      <div className="mx-auto w-full max-w-5xl p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{organization.name}</h1>
          <Link href={"/organizations"}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
            >
              <IconCircleX className="size-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Users
            users={users}
            organizationId={organizationId}
            userId={user.id}
          />
          <Customers
            customers={customers}
            userId={user.id}
            organizationId={organizationId}
          />
          <Invoices
            invoices={invoices}
            userId={user.id}
            organizationId={organizationId}
          />
        </div>
      </div>
    </div>
  )
}
