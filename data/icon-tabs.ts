import { IconDashboard, IconInvoice } from '@tabler/icons-react'

export const TABS = [
  { title: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { title: 'Invoices', icon: IconInvoice, href: '/dashboard/invoices' }
] as const
