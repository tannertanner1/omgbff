'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { Input } from '@/components/ui/input'
import { IconCircleChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface DataTableSearchProps {
  placeholder?: string
  className?: string
}

export function DataTableSearch({
  placeholder = 'Filter...',
  className
}: DataTableSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = React.useTransition()
  const [value, setValue] = React.useState(
    searchParams.get('query')?.toString()
  )

  // Debounce the search to avoid too many updates
  const debouncedValue = useDebounce(value, 500)

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedValue) {
      params.set('query', debouncedValue)
    } else {
      params.delete('query')
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }, [debouncedValue, router, searchParams])

  return (
    <div className='relative'>
      <Input
        placeholder={placeholder}
        value={value ?? ''}
        onChange={e => setValue(e.target.value)}
        className={cn(
          'h-8 w-[150px] bg-background lg:w-[250px]',
          pending && 'opacity-50',
          className
        )}
      />
      <IconCircleChevronRight
        className={cn(
          'absolute right-2 top-2 h-4 w-4 text-muted-foreground/50 transition-opacity',
          pending ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
