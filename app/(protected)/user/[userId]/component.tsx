'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { IconFolder, IconCirclePlus } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Form } from './form'
import { cn } from '@/lib/utils'

function Create({ userId }: { userId: string }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className='flex items-center gap-2'>
            <IconCirclePlus className='h-6 w-6' />
            <span className='sr-only'>Add</span>
          </button>
        </DialogTrigger>
        <DialogContent className='w-full'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className={cn('-mx-2 -mb-2 mt-1')}>
            <Form userId={userId} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button className='flex items-center gap-2'>
          <IconCirclePlus className='h-6 w-6' />
          <span className='sr-only'>Add</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className={cn('-pt-1 p-4')}>
          <Form userId={userId} onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function Read({
  organizations,
  userId
}: {
  organizations: Array<{
    id: string
    name: string
    createdAt: Date
  }>
  userId: string
}) {
  return (
    <div className=''>
      <Table>
        <TableHeader>
          <TableRow className={cn('hover:bg-transparent')}>
            <TableHead className='w-[200px] p-4'>Name</TableHead>
            <TableHead className='p-4'>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map(organization => (
            <TableRow key={organization.id}>
              <TableCell className='p-0 font-medium'>
                <Link
                  href={`/${userId}/${organization.id}`}
                  className='block p-4 font-semibold'
                >
                  <div className='flex items-center gap-2'>
                    <IconFolder className='h-4 w-4' />
                    {organization.name}
                  </div>
                </Link>
              </TableCell>
              <TableCell className='p-0'>
                <Link
                  href={`/${userId}/${organization.id}`}
                  className='block p-4'
                >
                  {formatDistanceToNow(new Date(organization.createdAt), {
                    addSuffix: true
                  })}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { Create, Read }
