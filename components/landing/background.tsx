'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className='mb-8 flex justify-center'>
      <Badge variant='outline' className='px-3 py-1 text-sm font-medium'>
        {children}
      </Badge>
    </div>
  )
}

function Grid({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-background relative flex h-[50rem] w-full items-center justify-center'>
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:40px_40px]',
          '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
          'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className='bg-background pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
      <div className='relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl'>
        {children}
      </div>
    </div>
  )
}

function Dots({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-background relative flex h-[50rem] w-full items-center justify-center'>
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
          'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <Card className='bg-background pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'>
        <div className='relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl'>
          {children}
        </div>
      </Card>
    </div>
  )
}

type Direction = 'top' | 'bottom' | 'left' | 'right' | 'all'

export function Fade({
  src,
  alt,
  direction = 'bottom',
  fadePercentage = 20,
  className
}: {
  src: string
  alt: string
  direction?: Direction
  fadePercentage?: number
  className?: string
}) {
  // Generate the appropriate gradient based on direction
  const getMaskImage = () => {
    switch (direction) {
      case 'top':
        return `linear-gradient(to bottom, transparent, black ${fadePercentage}%)`
      case 'bottom':
        return `linear-gradient(to top, transparent, black ${fadePercentage}%)`
      case 'left':
        return `linear-gradient(to right, transparent, black ${fadePercentage}%)`
      case 'right':
        return `linear-gradient(to left, transparent, black ${fadePercentage}%)`
      case 'all':
        return `radial-gradient(ellipse at center, black 50%, transparent 100%)`
      default:
        return `linear-gradient(to top, transparent, black ${fadePercentage}%)`
    }
  }

  return (
    <div
      className={cn('relative flex justify-center overflow-hidden', className)}
    >
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className='h-full w-full rounded-lg object-cover'
        style={{
          maskImage: getMaskImage(),
          WebkitMaskImage: getMaskImage() // For Safari support
        }}
      />
    </div>
  )
}

export { Section, Grid, Dots }

/**
 * @see https://ui.aceternity.com/components/grid-and-dot-backgrounds
 * @see https://bg.ibelick.com
 * @see https://syntaxui.com/effects/background
 */

// @note

// import React from 'react'
// import { cn } from '@/lib/utils'
// import { Badge } from '@/components/ui/badge'
// import { Card } from '@/components/ui/card'

// function Section({ children }: { children: React.ReactNode }) {
//   return (
//     <div className='mb-8 flex justify-center'>
//       <Badge variant='outline' className='px-3 py-1 text-sm font-medium'>
//         {children}
//       </Badge>
//     </div>
//   )
// }

// function Grid({
//   children
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <div className='bg-background relative flex h-[50rem] w-full items-center justify-center'>
//       <div
//         className={cn(
//           'absolute inset-0',
//           '[background-size:40px_40px]',
//           '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
//           'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
//         )}
//       />
//       {/* Radial gradient for the container to give a faded look */}
//       <div className='bg-background pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
//       <div className='relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl'>
//         {children}
//       </div>
//     </div>
//   )
// }

// function Dots({
//   children
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <div className='bg-background relative flex h-[50rem] w-full items-center justify-center'>
//       <div
//         className={cn(
//           'absolute inset-0',
//           '[background-size:20px_20px]',
//           '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
//           'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
//         )}
//       />
//       {/* Radial gradient for the container to give a faded look */}
//       <Card className='bg-background pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'>
//         <div className='relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl'>
//           {children}
//         </div>
//       </Card>
//     </div>
//   )
// }

// export { Section, Grid, Dots }
