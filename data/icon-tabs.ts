import { IconDashboard, IconInvoice } from "@tabler/icons-react"

export const TABS = [
  { title: "Dashboard", icon: IconDashboard, href: "/" },
  { title: "Invoices", icon: IconInvoice, href: "/invoices" },
] as const
