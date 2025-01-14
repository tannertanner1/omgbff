'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { IconLoader } from '@tabler/icons-react'
import { updateOrganizationRole, deleteOrganization } from './actions'

const roleConfig: Record<string, { bg: string; text: string }> = {
  owner: { bg: 'bg-[#4285F4]', text: 'text-[#4285F4]' },
  admin: { bg: 'bg-[#0F9D58]', text: 'text-[#0F9D58]' },
  user: { bg: 'bg-[#F4B400]', text: 'text-[#F4B400]' }
}

export function Organization({
  organization,
  userRole
}: {
  organization: {
    id: string
    name: string
    users: Array<{
      id: string
      email: string
      role: string
    }>
    customers: Array<{
      id: number
      name: string
      email: string
    }>
  }
  userRole: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [role, setRole] = React.useState(userRole)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const updateRole = (newRole: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('organizationId', organization.id)
      formData.set('role', newRole)

      const result = await updateOrganizationRole(null, formData)
      if (result.success) {
        setRole(newRole)
        router.refresh()
      }
    })
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const result = await deleteOrganization(formData)
      if (result.success) {
        router.push('/dashboard/organizations')
      } else {
        setIsDeleting(false)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-2xl p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>{organization.name}</h1>
        <Select value={role} onValueChange={updateRole} disabled={isPending}>
          <SelectTrigger
            className={cn(
              'w-[144px] border capitalize text-background',
              roleConfig[role].bg
            )}
          >
            <SelectValue>
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin' />
              ) : (
                role
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className='border-zinc-800 bg-background'>
            {Object.keys(roleConfig).map(value => (
              <SelectItem
                key={value}
                value={value}
                className={cn(
                  'bg-transparent capitalize',
                  roleConfig[value].text
                )}
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-6'>
        <div>
          <h2 className='mb-4 text-lg font-semibold'>Users</h2>
          <div className='space-y-2'>
            {organization.users.map(user => (
              <div
                key={user.id}
                className='flex items-center justify-between rounded-lg border border-border bg-card p-4'
              >
                <span>{user.email}</span>
                <span className={cn('capitalize', roleConfig[user.role].text)}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='mb-4 text-lg font-semibold'>Customers</h2>
          <div className='space-y-2'>
            {organization.customers.map(customer => (
              <div
                key={customer.id}
                className='flex items-center justify-between rounded-lg border border-border bg-card p-4'
              >
                <span>{customer.name}</span>
                <span className='text-muted-foreground'>{customer.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleDelete} className='mt-8'>
        <input type='hidden' name='organizationId' value={organization.id} />
        <Button
          type='submit'
          variant='destructive'
          className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
          disabled={isDeleting}
        >
          {isDeleting ? (
            <IconLoader className='h-4 w-4 animate-spin' />
          ) : (
            'Delete Organization'
          )}
        </Button>
      </form>
    </div>
  )
}
