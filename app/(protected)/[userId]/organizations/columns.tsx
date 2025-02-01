'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Columns } from '@/components/data-table/columns'
import { deleteAction } from './actions'

export type Organization = {
  userId: string
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export function getColumns(
  userId: string,
  router: any
): ColumnDef<Organization>[] {
  return Columns<Organization>(
    [
      {
        userId: '',
        id: '',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], // Dummy data to generate initial columns
    {
      onEdit: row => {
        router.push(`/${userId}/organizations/${row.id}/edit`)
      },
      onDelete: async row => {
        try {
          const formData = new FormData()
          formData.append('id', row.id)
          const result = await deleteAction(null, formData)
          if (result.success) {
            router.refresh()
          }
        } catch (error) {
          console.error('Failed to delete organization:', error)
        }
      }
    }
  )
}
