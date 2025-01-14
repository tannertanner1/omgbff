'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { IconSelector } from '@tabler/icons-react'

export function Nav({
  user,
  organization,
  customer
}: {
  user: {
    email: string
    image?: string | null
  }
  organization?: {
    id: string
    name: string
  }
  customer?: {
    id: string
    name: string
    role?: string
  }
}) {
  return (
    <nav className='flex h-14 items-center gap-4 border-b bg-background px-4'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={user.image ?? ''} />
          <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <span>{user.email}</span>

        <span className='text-muted-foreground/60'>/</span>

        {!organization ? (
          <Button asChild variant='default' size='sm'>
            <Link href='/organizations/new'>Create Organization</Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 outline-none'>
              {organization.name}
              <IconSelector className='h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem asChild>
                <Link href={`/organizations/${organization.id}`}>
                  {organization.name}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/organizations/new'>Create New Organization</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {organization && (
          <>
            <span className='text-muted-foreground/60'>/</span>

            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-1 outline-none'>
                {customer?.name ?? 'Select Customer'}
                <IconSelector className='h-4 w-4' />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                {customer ? (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/organizations/${organization.id}/customers/${customer.id}`}
                    >
                      {customer.name}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/organizations/${organization.id}/customers/new`}
                    >
                      Create Customer
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {customer?.role && (
              <>
                <span className='text-muted-foreground/60'>/</span>
                <span className='text-sm text-muted-foreground'>
                  {customer.role}
                </span>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
