'use client'

import { cn } from '@/lib/utils'
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'motion/react'
import { useEffect, useRef } from 'react'

interface MonthData {
  name: string
  startColumn: number
}

export function Heatmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: containerRef })
  const maskImage = useScrollOverflowMask(scrollXProgress)

  const { contributions, months } = generateYearData()

  const totalColumns = 53 // 52 weeks + 1 to account for year overlap
  const visibleColumns = 12 // 3 months visible at a time

  const monthsX = useTransform(
    scrollXProgress,
    [0, 1],
    ['0%', `-${((totalColumns - visibleColumns) * 100) / visibleColumns}%`]
  )

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [])

  return (
    <div className='w-full max-w-[480px]'>
      <div className='relative overflow-hidden rounded-3xl p-6'>
        {/* Month labels */}
        <div className='relative mb-2 h-6 overflow-hidden'>
          <motion.div
            className='absolute flex w-full'
            style={{
              x: monthsX
            }}
          >
            {months.map(month => (
              <div
                key={month.name}
                className='absolute text-sm font-medium text-primary'
                style={{
                  left: `${(month.startColumn * 100) / visibleColumns}%`,
                  width: '100px',
                  marginLeft: '-50px',
                  textAlign: 'center'
                }}
              >
                {month.name}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Contribution grid */}
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
              gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
              width: `${(totalColumns / visibleColumns) * 100}%`
            }}
          >
            {contributions.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'aspect-square rounded-sm',
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

        {/* Legend */}
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

const left = `0%`
const right = `100%`
const leftInset = `20%`
const rightInset = `80%`
const transparent = `#0000`
const opaque = `#000`

function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
  )

  useMotionValueEvent(scrollXProgress, 'change', value => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
      )
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
      )
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      )
    }
  })

  return maskImage
}

function generateYearData() {
  const today = new Date()
  const contributions: number[][] = Array(7)
    .fill(0)
    .map(() => Array(53).fill(0))
  const months: MonthData[] = []

  const currentDate = new Date(today)
  currentDate.setFullYear(currentDate.getFullYear() - 1)
  currentDate.setDate(currentDate.getDate() + 1) // Start from tomorrow last year

  for (let i = 0; i < 53 * 7; i++) {
    const dayOfWeek = currentDate.getDay()
    const weekNumber = Math.floor(i / 7)

    if (currentDate.getDate() === 1) {
      months.push({
        name: currentDate.toLocaleString('default', { month: 'short' }),
        startColumn: weekNumber
      })
    }

    if (currentDate <= today) {
      contributions[dayOfWeek][weekNumber] = Math.floor(Math.random() * 4)
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return { contributions, months }
}

/** @see https://examples.motion.dev/react/scroll-container */

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
// import { useEffect, useRef } from 'react'

// interface MonthData {
//   name: string
//   startColumn: number
// }

// export function Heatmap() {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const { scrollXProgress } = useScroll({ container: containerRef })
//   const maskImage = useScrollOverflowMask(scrollXProgress)

//   const { contributions, months } = generateYearData()

//   const totalColumns = 53 // 52 weeks + 1 to account for year overlap
//   const visibleColumns = 12 // 3 months visible at a time

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
//       {/* <div className='relative overflow-hidden rounded-3xl bg-[#0D1117] p-6 shadow-2xl'> */}
//       <div className='relative overflow-hidden rounded-3xl p-6'>
//         {/* Month labels */}
//         <div className='relative mb-2 h-6 overflow-hidden'>
//           <motion.div
//             className='absolute flex w-full'
//             style={{
//               x: monthsX
//             }}
//           >
//             {months.map(month => (
//               <div
//                 key={month.name}
//                 className='absolute text-sm font-medium text-gray-400'
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
//           className='no-scrollbar overflow-x-scroll'
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
//                     value === 0 && 'bg-[#161B22]',
//                     value === 1 && 'bg-[#0E4429]',
//                     value === 2 && 'bg-[#26A641]',
//                     value === 3 && 'bg-[#39D353]'
//                   )}
//                 />
//               ))
//             )}
//           </div>
//         </motion.div>

//         {/* Legend */}
//         <div className='mt-4 flex items-center justify-end gap-2 text-sm'>
//           <span className='text-gray-400'>Less</span>
//           {[0, 1, 2, 3].map(level => (
//             <div
//               key={level}
//               className={cn(
//                 'h-3 w-3 rounded-sm',
//                 level === 0 && 'bg-[#161B22]',
//                 level === 1 && 'bg-[#0E4429]',
//                 level === 2 && 'bg-[#26A641]',
//                 level === 3 && 'bg-[#39D353]'
//               )}
//             />
//           ))}
//           <span className='text-gray-400'>More</span>
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

// function generateYearData() {
//   const today = new Date()
//   const contributions: number[][] = Array(7)
//     .fill(0)
//     .map(() => Array(53).fill(0))
//   const months: MonthData[] = []

//   const currentDate = new Date(today)
//   currentDate.setFullYear(currentDate.getFullYear() - 1)
//   currentDate.setDate(currentDate.getDate() + 1) // Start from tomorrow last year

//   for (let i = 0; i < 53 * 7; i++) {
//     const dayOfWeek = currentDate.getDay()
//     const weekNumber = Math.floor(i / 7)

//     if (currentDate.getDate() === 1) {
//       months.push({
//         name: currentDate.toLocaleString('default', { month: 'short' }),
//         startColumn: weekNumber
//       })
//     }

//     if (currentDate <= today) {
//       contributions[dayOfWeek][weekNumber] = Math.floor(Math.random() * 4)
//     }

//     currentDate.setDate(currentDate.getDate() + 1)
//   }

//   return { contributions, months }
// }
