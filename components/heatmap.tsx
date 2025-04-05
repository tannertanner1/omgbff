'use client'

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'motion/react'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export function Heatmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: containerRef })
  const maskImage = useScrollOverflowMask(scrollXProgress)

  const [data] = useState(() => {
    const { contributions, months, totalColumns } = generateContributionData()
    return { contributions, months, totalColumns }
  })
  const visibleColumns = 12

  const monthsX = useTransform(
    scrollXProgress,
    [0, 1],
    ['0%', `-${((data.totalColumns - visibleColumns) * 100) / visibleColumns}%`]
  )

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [])

  return (
    <div className='w-full max-w-[480px]'>
      <div className='relative overflow-hidden rounded-3xl p-6'>
        <div className='relative mb-2 h-6 overflow-hidden'>
          <motion.div className='absolute flex w-full' style={{ x: monthsX }}>
            {data.months.map(({ name, startColumn }, i) => (
              <div
                key={`${name}-${i}`}
                className='absolute text-sm font-medium text-primary'
                style={{
                  left: `${(startColumn * 100) / visibleColumns}%`,
                  width: '100px',
                  marginLeft: '-50px',
                  textAlign: 'center'
                }}
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          ref={containerRef}
          className='scrollbar-none overflow-x-scroll'
          style={{
            maskImage,
            WebkitMaskImage: maskImage
          }}
        >
          <div
            className='grid grid-rows-7 gap-1'
            style={{
              gridTemplateColumns: `repeat(${data.totalColumns}, 1fr)`,
              width: `${(data.totalColumns / visibleColumns) * 100}%`
            }}
          >
            {data.contributions.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'aspect-square rounded-sm',
                    value === null && 'bg-transparent',
                    value === 0 && 'bg-zinc-950/10 dark:bg-zinc-50/10',
                    value === 1 && 'bg-zinc-950/25 dark:bg-zinc-50/25',
                    value === 2 && 'bg-zinc-950/50 dark:bg-zinc-50/50',
                    value === 3 && 'bg-zinc-950/75 dark:bg-zinc-50/75'
                  )}
                />
              ))
            )}
          </div>
        </motion.div>

        <div className='mt-4 flex items-center justify-end gap-2 text-sm'>
          <span className='text-primary'>Less</span>
          {[0, 1, 2, 3].map(level => (
            <div
              key={level}
              className={cn(
                'h-3 w-3 rounded-sm',
                level === 0 && 'bg-zinc-950/10 dark:bg-zinc-50/10',
                level === 1 && 'bg-zinc-950/25 dark:bg-zinc-50/25',
                level === 2 && 'bg-zinc-950/50 dark:bg-zinc-50/50',
                level === 3 && 'bg-zinc-950/75 dark:bg-zinc-50/75'
              )}
            />
          ))}
          <span className='text-primary'>More</span>
        </div>
      </div>
    </div>
  )
}

function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, #000, #000 0%, #000 80%, #0000)`
  )

  useMotionValueEvent(scrollXProgress, 'change', value => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, #000, #000 0%, #000 80%, #0000)`
      )
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, #0000, #000 20%, #000 100%, #000)`
      )
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, #0000, #000 20%, #000 80%, #0000)`
      )
    }
  })

  return maskImage
}

function generateContributionData() {
  const now = new Date()
  const pst = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  )
  const startDate = new Date(pst)
  startDate.setFullYear(startDate.getFullYear() - 1)

  const firstSunday = new Date(startDate)
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1)
  }

  const contributions: (number | null)[][] = Array(7)
    .fill(0)
    .map(() => [])
  const months: { name: string; startColumn: number }[] = []

  const currentDate = new Date(firstSunday)
  let weekIndex = 0
  let lastMonth = -1

  const currentMonth = pst.getMonth()
  const currentYear = pst.getFullYear()

  while (currentDate <= pst) {
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const isNewMonth = month !== lastMonth

    if (
      isNewMonth &&
      currentDate <= pst &&
      !(month === currentMonth && year === currentYear - 1)
    ) {
      months.push({
        name: currentDate.toLocaleString('default', { month: 'short' }),
        startColumn: weekIndex
      })
      lastMonth = month
    }

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const cellDate = new Date(currentDate)
      cellDate.setDate(currentDate.getDate() + dayOfWeek)

      if (cellDate >= startDate && cellDate <= pst) {
        contributions[dayOfWeek][weekIndex] =
          (cellDate.getDate() + cellDate.getMonth()) % 4
      } else {
        contributions[dayOfWeek][weekIndex] = null
      }
    }

    currentDate.setDate(currentDate.getDate() + 7)
    weekIndex++
  }

  return { contributions, months, totalColumns: weekIndex }
}

/**
 * @see https://examples.motion.dev/react/scroll-container
 * @see https://craft.mxkaske.dev/post/activity-calendar
 * @see https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/activity-calendar/activity-calendar.tsx
 * @see https://docs.github.com/en/rest/commits/comments?apiVersion=2022-11-28#list-commit-comments
 * @see https://github.com/shadcn-ui/taxonomy/blob/main/app/(marketing)/page.tsx#L8
 */

// @note

// 'use client'

// import { cn } from '@/lib/utils'
// import {
//   animate,
//   motion,
//   type MotionValue,
//   useMotionValue,
//   useMotionValueEvent,
//   useScroll,
//   useTransform
// } from 'motion/react'
// import { useEffect, useRef, useState } from 'react'

// interface MonthData {
//   name: string
//   startColumn: number
// }

// export function Heatmap() {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const { scrollXProgress } = useScroll({ container: containerRef })
//   const maskImage = useScrollOverflowMask(scrollXProgress)

//   // Use useState to ensure same data on server and client initially
//   const [data] = useState(() => generateContributionData())
//   const { contributions, months, totalColumns } = data
//   const visibleColumns = 12

//   const monthsX = useTransform(
//     scrollXProgress,
//     [0, 1],
//     ['0%', `-${((totalColumns - visibleColumns) * 100) / visibleColumns}%`]
//   )

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = containerRef.current.scrollWidth
//     }
//   }, [])

//   return (
//     <div className='w-full max-w-[480px]'>
//       <div className='relative overflow-hidden rounded-3xl p-6'>
//         {/* Month labels */}
//         <div className='relative mb-2 h-6 overflow-hidden'>
//           <motion.div
//             className='absolute flex w-full'
//             style={{
//               x: monthsX
//             }}
//           >
//             {months.map((month, i) => (
//               <div
//                 key={`${month.name}-${i}`}
//                 className='absolute text-sm font-medium text-primary'
//                 style={{
//                   left: `${(month.startColumn * 100) / visibleColumns}%`,
//                   width: '100px',
//                   marginLeft: '-50px',
//                   textAlign: 'center'
//                 }}
//               >
//                 {month.name}
//               </div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Contribution grid */}
//         <motion.div
//           ref={containerRef}
//           className='scrollbar-none overflow-x-scroll'
//           style={{
//             maskImage,
//             WebkitMaskImage: maskImage
//           }}
//         >
//           <div
//             className='grid grid-rows-7 gap-1'
//             style={{
//               gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
//               width: `${(totalColumns / visibleColumns) * 100}%`
//             }}
//           >
//             {contributions.map((row, rowIndex) =>
//               row.map((value, colIndex) => (
//                 <div
//                   key={`${rowIndex}-${colIndex}`}
//                   className={cn(
//                     'aspect-square rounded-sm',
//                     value === null && 'bg-transparent',
//                     value === 0 && 'bg-zinc-950/10 dark:bg-zinc-50/10',
//                     value === 1 && 'bg-zinc-950/25 dark:bg-zinc-50/25',
//                     value === 2 && 'bg-zinc-950/50 dark:bg-zinc-50/50',
//                     value === 3 && 'bg-zinc-950/75 dark:bg-zinc-50/75'
//                   )}
//                 />
//               ))
//             )}
//           </div>
//         </motion.div>

//         {/* Legend */}
//         <div className='mt-4 flex items-center justify-end gap-2 text-sm'>
//           <span className='text-primary'>Less</span>
//           {[0, 1, 2, 3].map(level => (
//             <div
//               key={level}
//               className={cn(
//                 'h-3 w-3 rounded-sm',
//                 level === 0 && 'bg-zinc-950/10 dark:bg-zinc-50/10',
//                 level === 1 && 'bg-zinc-950/25 dark:bg-zinc-50/25',
//                 level === 2 && 'bg-zinc-950/50 dark:bg-zinc-50/50',
//                 level === 3 && 'bg-zinc-950/75 dark:bg-zinc-50/75'
//               )}
//             />
//           ))}
//           <span className='text-primary'>More</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// const left = `0%`
// const right = `100%`
// const leftInset = `20%`
// const rightInset = `80%`
// const transparent = `#0000`
// const opaque = `#000`

// function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
//   const maskImage = useMotionValue(
//     `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
//   )

//   useMotionValueEvent(scrollXProgress, 'change', value => {
//     if (value === 0) {
//       animate(
//         maskImage,
//         `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
//       )
//     } else if (value === 1) {
//       animate(
//         maskImage,
//         `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
//       )
//     } else if (
//       scrollXProgress.getPrevious() === 0 ||
//       scrollXProgress.getPrevious() === 1
//     ) {
//       animate(
//         maskImage,
//         `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
//       )
//     }
//   })

//   return maskImage
// }

// function generateContributionData() {
//   // Get current date in PST
//   const now = new Date()
//   const pst = new Date(
//     now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
//   )

//   // Start exactly one year ago from today in PST
//   const startDate = new Date(pst)
//   startDate.setFullYear(startDate.getFullYear() - 1)

//   // Find the first Sunday before or on the start date
//   const firstSunday = new Date(startDate)
//   while (firstSunday.getDay() !== 0) {
//     firstSunday.setDate(firstSunday.getDate() - 1)
//   }

//   // Initialize arrays
//   const contributions: (number | null)[][] = Array(7)
//     .fill(0)
//     .map(() => [])
//   const months: MonthData[] = []

//   const currentDate = new Date(firstSunday)
//   let weekIndex = 0
//   let lastMonth = -1

//   // Get current month and year for comparison
//   const currentMonth = pst.getMonth()
//   const currentYear = pst.getFullYear()

//   // Generate data week by week
//   while (currentDate <= pst) {
//     const month = currentDate.getMonth()
//     const year = currentDate.getFullYear()
//     const isNewMonth = month !== lastMonth

//     // Add month label at the start of each month, but skip if it's the same month as current
//     // in the previous year
//     if (
//       isNewMonth &&
//       currentDate <= pst &&
//       !(month === currentMonth && year === currentYear - 1)
//     ) {
//       months.push({
//         name: currentDate.toLocaleString('default', { month: 'short' }),
//         startColumn: weekIndex
//       })
//       lastMonth = month
//     }

//     // Fill in the week
//     for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
//       const cellDate = new Date(currentDate)
//       cellDate.setDate(currentDate.getDate() + dayOfWeek)

//       // Only add value if the date is within our range and not in the future
//       if (cellDate >= startDate && cellDate <= pst) {
//         // Use a deterministic value based on the date instead of Math.random()
//         const value = (cellDate.getDate() + cellDate.getMonth()) % 4
//         contributions[dayOfWeek][weekIndex] = value
//       } else {
//         contributions[dayOfWeek][weekIndex] = null
//       }
//     }

//     // Move to next week
//     currentDate.setDate(currentDate.getDate() + 7)
//     weekIndex++
//   }

//   return {
//     contributions,
//     months,
//     totalColumns: weekIndex
//   }
// }
