'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { IconCheck, IconPlus } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export function Filter({
  filterableColumns,
  searchableColumns
}: {
  filterableColumns: {
    id: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  searchableColumns: {
    id: string
    title: string
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Search params
  const page = searchParams?.get('page') ?? '1'
  const per_page = searchParams?.get('per_page') ?? '10'
  const sort = searchParams?.get('sort')
  const search = searchParams?.get('search')

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  // Handle search
  const [value, setValue] = React.useState(search ?? '')
  const debouncedValue = useDebounce(value, 500)

  React.useEffect(() => {
    if (debouncedValue.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          search: debouncedValue,
          page: 1
        })}`
      )
    } else {
      router.push(
        `${pathname}?${createQueryString({
          search: null,
          page: 1
        })}`
      )
    }
  }, [debouncedValue, pathname, router, createQueryString])

  return (
    <div className='flex items-center gap-2'>
      {searchableColumns?.length ? (
        <div className='flex items-center gap-2'>
          <Input
            placeholder='Search...'
            className='h-8 w-[150px] lg:w-[250px]'
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          {value && (
            <Button
              variant='ghost'
              onClick={() => setValue('')}
              className='h-8 px-2 lg:px-3'
            >
              Reset
            </Button>
          )}
        </div>
      ) : null}
      {filterableColumns?.length ? (
        <div className='flex items-center gap-2'>
          {filterableColumns.map(column => (
            <Popover key={column.id}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-dashed'
                >
                  <IconPlus className='mr-2 h-4 w-4' />
                  {column.title}
                  {searchParams?.get(column.id) && (
                    <>
                      <Separator orientation='vertical' className='mx-2 h-4' />
                      <Badge
                        variant='secondary'
                        className='rounded-sm px-1 font-normal lg:hidden'
                      >
                        {searchParams.getAll(column.id).length}
                      </Badge>
                      <div className='hidden space-x-1 lg:flex'>
                        {searchParams.getAll(column.id).length > 2 ? (
                          <Badge
                            variant='secondary'
                            className='rounded-sm px-1 font-normal'
                          >
                            {searchParams.getAll(column.id).length} selected
                          </Badge>
                        ) : (
                          column.options
                            .filter(option =>
                              searchParams
                                .getAll(column.id)
                                .includes(option.value)
                            )
                            .map(option => (
                              <Badge
                                variant='secondary'
                                key={option.value}
                                className='rounded-sm px-1 font-normal'
                              >
                                {option.label}
                              </Badge>
                            ))
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0' align='start'>
                <Command>
                  <CommandInput placeholder={column.title} />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {column.options.map(option => {
                        const isSelected = searchParams
                          ?.getAll(column.id)
                          .includes(option.value)
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              const current = searchParams?.getAll(column.id)
                              const newValue = isSelected
                                ? current.filter(
                                    value => value !== option.value
                                  )
                                : [...current, option.value]

                              router.push(
                                `${pathname}?${createQueryString({
                                  [column.id]: newValue as any,
                                  page: 1
                                })}`
                              )
                            }}
                          >
                            <div
                              className={cn(
                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50 [&_svg]:invisible'
                              )}
                            >
                              <IconCheck className={cn('h-4 w-4')} />
                            </div>
                            {option.icon && (
                              <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                            )}
                            <span>{option.label}</span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                    {searchParams?.has(column.id) && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() =>
                              router.push(
                                `${pathname}?${createQueryString({
                                  [column.id]: null,
                                  page: 1
                                })}`
                              )
                            }
                            className='justify-center text-center'
                          >
                            Clear filters
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      ) : null}
    </div>
  )
}

// 'use client'

// import * as React from 'react'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import { useDebounce } from '@/hooks/use-debounce'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from '@/components/ui/popover'
// import { Separator } from '@/components/ui/separator'
// import { Badge } from '@/components/ui/badge'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator
// } from '@/components/ui/command'
// import { IconCheck, IconPlus } from '@tabler/icons-react'
// import { cn, createUrl } from '@/lib/utils'

// export function Filter({
//   filterableColumns,
//   searchableColumns
// }: {
//   filterableColumns: {
//     id: string
//     title: string
//     options: {
//       label: string
//       value: string
//       icon?: React.ComponentType<{ className?: string }>
//     }[]
//   }[]
//   searchableColumns: {
//     id: string
//     title: string
//   }[]
// }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()

//   // Search params
//   const page = searchParams?.get('page') ?? '1'
//   const per_page = searchParams?.get('per_page') ?? '10'
//   const sort = searchParams?.get('sort')
//   const search = searchParams?.get('search')

//   // Create query string
//   const createQueryString = React.useCallback(
//     (params: Record<string, string | number | null>) => {
//       const newSearchParams = new URLSearchParams(searchParams?.toString())

//       for (const [key, value] of Object.entries(params)) {
//         if (value === null) {
//           newSearchParams.delete(key)
//         } else {
//           newSearchParams.set(key, String(value))
//         }
//       }

//       return newSearchParams.toString()
//     },
//     [searchParams]
//   )

//   // Handle search
//   const [value, setValue] = React.useState(search ?? '')
//   const debouncedValue = useDebounce(value, 500)

//   React.useEffect(() => {
//     if (debouncedValue.length > 0) {
//       router.push(
//         `${pathname}?${createQueryString({
//           search: debouncedValue,
//           page: 1
//         })}`
//       )
//     } else {
//       router.push(
//         `${pathname}?${createQueryString({
//           search: null,
//           page: 1
//         })}`
//       )
//     }
//   }, [debouncedValue, pathname, router, createQueryString])

//   return (
//     <div className='flex items-center gap-2'>
//       {searchableColumns?.length ? (
//         <div className='flex items-center gap-2'>
//           <Input
//             placeholder='Search...'
//             className='h-8 w-[150px] lg:w-[250px]'
//             value={value}
//             onChange={e => setValue(e.target.value)}
//           />
//           {value && (
//             <Button
//               variant='ghost'
//               onClick={() => setValue('')}
//               className='h-8 px-2 lg:px-3'
//             >
//               Reset
//             </Button>
//           )}
//         </div>
//       ) : null}
//       {filterableColumns?.length ? (
//         <div className='flex items-center gap-2'>
//           {filterableColumns.map(column => (
//             <Popover key={column.id}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className='h-8 border-dashed'
//                 >
//                   <IconPlus className='mr-2 h-4 w-4' />
//                   {column.title}
//                   {searchParams?.get(column.id) && (
//                     <>
//                       <Separator orientation='vertical' className='mx-2 h-4' />
//                       <Badge
//                         variant='secondary'
//                         className='rounded-sm px-1 font-normal lg:hidden'
//                       >
//                         {searchParams.getAll(column.id).length}
//                       </Badge>
//                       <div className='hidden space-x-1 lg:flex'>
//                         {searchParams.getAll(column.id).length > 2 ? (
//                           <Badge
//                             variant='secondary'
//                             className='rounded-sm px-1 font-normal'
//                           >
//                             {searchParams.getAll(column.id).length} selected
//                           </Badge>
//                         ) : (
//                           column.options
//                             .filter(option =>
//                               searchParams
//                                 .getAll(column.id)
//                                 .includes(option.value)
//                             )
//                             .map(option => (
//                               <Badge
//                                 variant='secondary'
//                                 key={option.value}
//                                 className='rounded-sm px-1 font-normal'
//                               >
//                                 {option.label}
//                               </Badge>
//                             ))
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className='w-[200px] p-0' align='start'>
//                 <Command>
//                   <CommandInput placeholder={column.title} />
//                   <CommandList>
//                     <CommandEmpty>No results found.</CommandEmpty>
//                     <CommandGroup>
//                       {column.options.map(option => {
//                         const isSelected = searchParams
//                           ?.getAll(column.id)
//                           .includes(option.value)
//                         return (
//                           <CommandItem
//                             key={option.value}
//                             onSelect={() => {
//                               const current = searchParams?.getAll(column.id)
//                               const newValue = isSelected
//                                 ? current.filter(
//                                     value => value !== option.value
//                                   )
//                                 : [...current, option.value]

//                               router.push(
//                                 `${pathname}?${createQueryString({
//                                   [column.id]: newValue,
//                                   page: 1
//                                 })}`
//                               )
//                             }}
//                           >
//                             <div
//                               className={cn(
//                                 'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
//                                 isSelected
//                                   ? 'bg-primary text-primary-foreground'
//                                   : 'opacity-50 [&_svg]:invisible'
//                               )}
//                             >
//                               <IconCheck className={cn('h-4 w-4')} />
//                             </div>
//                             {option.icon && (
//                               <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />
//                             )}
//                             <span>{option.label}</span>
//                           </CommandItem>
//                         )
//                       })}
//                     </CommandGroup>
//                     {searchParams?.has(column.id) && (
//                       <>
//                         <CommandSeparator />
//                         <CommandGroup>
//                           <CommandItem
//                             onSelect={() =>
//                               router.push(
//                                 `${pathname}?${createQueryString({
//                                   [column.id]: null,
//                                   page: 1
//                                 })}`
//                               )
//                             }
//                             className='justify-center text-center'
//                           >
//                             Clear filters
//                           </CommandItem>
//                         </CommandGroup>
//                       </>
//                     )}
//                   </CommandList>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   )
// }
