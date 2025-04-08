const STATUSES = ['done', 'in-progress', 'coming-soon', 'planned'] as const

type Status = (typeof STATUSES)[number]

const statusConfig: Record<
  Status,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  done: {
    label: 'Done',
    color: 'rgb(34, 197, 94)', // green-500
    bgColor: 'rgba(34, 197, 94, 0.1)', // green-500/10
    borderColor: 'rgba(34, 197, 94, 0.2)' // green-500/20
  },
  'in-progress': {
    label: 'In Progress',
    color: 'rgb(59, 130, 246)', // blue-500
    bgColor: 'rgba(59, 130, 246, 0.1)', // blue-500/10
    borderColor: 'rgba(59, 130, 246, 0.2)' // blue-500/20
  },
  'coming-soon': {
    label: 'Coming Soon',
    color: 'rgb(245, 158, 11)', // amber-500
    bgColor: 'rgba(245, 158, 11, 0.1)', // amber-500/10
    borderColor: 'rgba(245, 158, 11, 0.2)' // amber-500/20
  },
  planned: {
    label: 'Planned',
    color: 'rgb(107, 114, 128)', // gray-500
    bgColor: 'rgba(107, 114, 128, 0.1)', // gray-500/10
    borderColor: 'rgba(107, 114, 128, 0.2)' // gray-500/20
  }
}

export { STATUSES, type Status, statusConfig }
