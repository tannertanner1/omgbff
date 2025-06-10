import {
  IconAt,
  IconFolder,
  IconInvoice,
  IconLogout,
  IconMail,
  IconSend,
  IconSettings,
  IconUser,
  IconUserCircle,
  type Icon,
} from "@tabler/icons-react"

type Item = {
  title: string
  url: string
  icon: Icon
  description?: string
  permission?: {
    resource: string
    action: string
  }
}

const ITEMS: Item[][] = [
  // Main
  [
    {
      title: "Users",
      url: "/users",
      icon: IconAt,
      permission: {
        resource: "users",
        action: "view",
      },
    },
    {
      title: "Organizations",
      url: "/organizations",
      icon: IconFolder,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: IconUser,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: IconInvoice,
    },
  ],
  // Secondary
  [
    {
      title: "Contact",
      url: "/contact",
      icon: IconMail,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: IconSend,
    },
  ],
  // User
  [
    {
      title: "Account",
      url: "/account",
      icon: IconUserCircle,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Logout",
      url: "#",
      icon: IconLogout,
    },
  ],
]

export { ITEMS, type Item }

/**
{
  IconFile,
  IconActivity,
  IconTag,
  IconCheckbox,
  IconChartBarPopular,
  IconBell,
  IconArticle,
  IconCloud,
  IconBook,
  IconNote,
}

[
  {
    title: "Services",
    url: "#",
    icon: IconFile,
  },
  {
    title: "Activity",
    icon: IconActivity,
    url: "#",
  },
  {
    title: "Products",
    icon: IconTag,
    url: "#",
  },
  {
    title: "Tasks",
    url: "#",
    icon: IconCheckbox,
  },
  {
    title: "Analytics",
    url: "#",
    icon: IconChartBarPopular,
  },
  {
    title: "Notifications",
    url: "#",
    icon: IconBell,
  },
  {
    title: "Posts",
    url: "#",
    icon: IconArticle,
  },
  {
    title: "Files",
    url: "#",
    icon: IconCloud,
  },
  {
    title: "Docs",
    url: "#",
    icon: IconBook,
  },
  {
    title: "Notes",
    url: "#",
    icon: IconNote,
  },
]
*/

// @note

// import { IconAt, IconFolder, IconUser, IconInvoice } from "@tabler/icons-react"

// type Item = {
//   icon: React.ElementType
//   title: string
//   description: string
//   href: string
// }

// export const ITEMS: Item[] = [
//   {
//     icon: IconAt,
//     title: "Users",
//     description: "Manage Users",
//     href: "/users",
//   },
//   {
//     icon: IconFolder,
//     title: "Organizations",
//     description: "Manage Organizations",
//     href: "/organizations",
//   },
//   {
//     icon: IconUser,
//     title: "Customers",
//     description: "Manage Customers",
//     href: "/customers",
//   },
//   {
//     icon: IconInvoice,
//     title: "Invoices",
//     description: "Manage Invoices",
//     href: "/invoices",
//   },
// ]
