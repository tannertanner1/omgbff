import {
  IconAt,
  IconFolder,
  IconUser,
  IconFile,
  IconCheckbox,
  IconInvoice,
  IconActivity,
  IconArticle,
  IconTag,
  IconCloud,
  IconChartBarPopular,
  IconBell,
  IconBook,
  IconNote,
  IconSettings
} from '@tabler/icons-react'

type Item = {
  icon: React.ElementType
  title: string
  description: string
  href: string
}

export const ITEMS: Item[] = [
  {
    icon: IconAt,
    title: 'Users',
    description: 'Manage Users',
    href: '/users'
  },
  {
    icon: IconFolder,
    title: 'Organizations',
    description: 'Manage Organizations',
    href: '/organizations'
  },
  {
    icon: IconUser,
    title: 'Customers',
    description: 'Manage Customers',
    href: '/customers'
  },
  // {
  //   icon: IconFile,
  //   title: 'Services',
  //   description: 'Manage Services',
  //   href: '#'
  // },
  // {
  //   icon: IconCheckbox,
  //   title: 'Tasks',
  //   description: 'Manage Tasks',
  //   href: '#'
  // },
  {
    icon: IconInvoice,
    title: 'Invoices',
    description: 'Manage Invoices',
    href: '/invoices'
  }
  // {
  //   icon: IconActivity,
  //   title: 'Activity',
  //   description: 'Manage Activity',
  //   href: '#'
  // },
  // {
  //   icon: IconTag,
  //   title: 'Products',
  //   description: 'Manage Products',
  //   href: '#'
  // },
  // {
  //   icon: IconArticle,
  //   title: 'Posts',
  //   description: 'Manage Posts',
  //   href: '#'
  // },
  // {
  //   icon: IconChartBarPopular,
  //   title: 'Analytics',
  //   description: 'Manage Analytics',
  //   href: '#'
  // },
  // {
  //   icon: IconCloud,
  //   title: 'Files',
  //   description: 'Manage Files',
  //   href: '#'
  // },
  // {
  //   icon: IconBell,
  //   title: 'Notifications',
  //   description: 'Manage Notifications',
  //   href: '#'
  // },
  // {
  //   icon: IconBook,
  //   title: 'Docs',
  //   description: 'Manage Docs',
  //   href: '#'
  // },
  // {
  //   icon: IconNote,
  //   title: 'Notes',
  //   description: 'Manage Notes',
  //   href: '#'
  // },
  // {
  //   icon: IconSettings,
  //   title: 'Settings',
  //   description: 'Manage Settings',
  //   href: '#'
  // }
]
