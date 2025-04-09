'use client'

import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import {
  IconCat,
  IconLayoutSidebarRightFilled,
  IconLayoutSidebarFilled,
  IconHome,
  IconAt,
  IconUsers,
  IconFile,
  IconCheckbox,
  IconFolder,
  IconUser,
  IconInvoice,
  IconSettings,
  IconLock,
  IconActivity,
  IconBell,
  IconMail,
  IconSend
} from '@tabler/icons-react'

const items = [
  {
    title: 'Dashboard',
    url: '#',
    icon: IconHome
  },
  {
    title: 'Handle',
    url: '#',
    icon: IconAt
  },
  {
    title: 'Users',
    url: '#',
    icon: IconUsers
  },
  {
    title: 'Services',
    url: '#',
    icon: IconFile,
    disabled: true
  },
  {
    title: 'Tasks',
    url: '#',
    icon: IconCheckbox,
    disabled: true
  },
  {
    title: 'Organizations',
    url: '#',
    icon: IconFolder
  },
  {
    title: 'Customers',
    url: '#',
    icon: IconUser
  },
  {
    title: 'Invoices',
    url: '#',
    icon: IconInvoice
  },
  {
    title: 'Settings',
    url: '#',
    icon: IconSettings,
    disabled: true,
    children: [
      {
        title: 'Account',
        url: '#',
        icon: IconLock,
        disabled: true
      },
      {
        title: 'Activity',
        url: '#',
        icon: IconActivity,
        disabled: true
      },
      {
        title: 'Notifications',
        url: '#',
        icon: IconBell,
        disabled: true
      }
    ]
  },
  {
    title: 'Contact',
    url: '#',
    icon: IconMail
  },
  {
    title: 'Feedback',
    url: '#',
    icon: IconSend
  }
]

export function AppSidebar() {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      {/* <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar />
      </SidebarProvider> */}
      <Button
        onClick={() => setOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        variant='outline'
        size='icon'
        className='group/toggle rounded-full bg-transparent text-primary hover:bg-transparent'
      >
        {isOpen ? (
          <IconLayoutSidebarRightFilled className='h-6 w-6 text-primary transition-colors' />
        ) : (
          <IconLayoutSidebarFilled className='h-6 w-6 text-primary transition-colors' />
        )}
        <span className='sr-only'>Toggle sidebar</span>
      </Button>
    </>
  )
}
