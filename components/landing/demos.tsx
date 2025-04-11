'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Section } from './section'
import { DEMOS } from '@/data/landing-content'
import { cn } from '@/lib/utils'

type Clip = (typeof DEMOS.items)[number]['items'][number]

function Demo({ item, index }: { item: Clip; index: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <motion.div
      className='group w-[300px] flex-none cursor-pointer'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <div className='relative mb-4 aspect-video overflow-hidden rounded-lg bg-linear-to-br from-muted/50 to-muted/10'>
        {isPlaying ? (
          <video
            ref={videoRef}
            src={item.video}
            controls
            className='h-full w-full object-cover'
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <img
              src={item.thumbnail || '/placeholder.svg?height=180&width=320'}
              alt={item.title}
              className='absolute inset-0 h-full w-full object-cover'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/90'>
                <IconPlayerPlayFilled className='h-8 w-8 text-primary-foreground' />
              </div>
            </div>
          </>
        )}
      </div>
      <div className='-mr-4 space-y-2'>
        <div className='flex items-center'>
          <h3 className='line-clamp-1 font-semibold'>{item.title}</h3>
          <Badge
            variant='outline'
            className={cn('ml-2 h-5 rounded-full border-0 py-0 text-xs font-medium capitalize', {
              'bg-[#d2e3fc] text-[#4285f4]': item.status === 'live',
              'bg-[#feefc3] text-[#fbbc04]': item.status === 'soon',
              'bg-[#e8eaed] text-[#3c4043]': item.status === 'planned'
            })}
          >
            {item.status}
          </Badge>
        </div>
        <p className='line-clamp-2 text-sm text-muted-foreground'>{item.description}</p>
      </div>
    </motion.div>
  )
}

function Demos() {
  return (
    <div className='py-16 md:py-24'>
      <Section>
        <Badge variant='outline' className='mb-8 bg-background text-sm text-muted-foreground'>
          <span className='cursor-pointer select-none'>{DEMOS.section}</span>
        </Badge>

        <h2 className='text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          {DEMOS.title}
        </h2>

        <p className='mt-4 max-w-3xl text-lg text-muted-foreground'>{DEMOS.description}</p>
      </Section>

      <div className='mt-16 space-y-20'>
        {DEMOS.items.map(demo => (
          <div key={demo.title} className='space-y-8'>
            <Section className='text-left'>
              <h3 className='text-2xl font-bold'>{demo.title}</h3>
              <p className='max-w-3xl text-lg text-muted-foreground'>{demo.description}</p>
            </Section>

            <div className='relative w-full overflow-hidden'>
              <ScrollArea className='w-full'>
                <div className='flex space-x-6 pb-6 pl-[max(1rem,calc((100vw-80rem)/2+1rem))] pr-8'>
                  {demo.items.map((item, index) => (
                    <Demo key={item.title} item={item} index={index} />
                  ))}
                </div>
                <ScrollBar
                  orientation='horizontal'
                  className='opacity-0 transition-opacity hover:opacity-100'
                />
              </ScrollArea>

              {/* Fade effect on the left edge */}
              <div className='pointer-events-none absolute left-0 top-0 h-full w-12 bg-linear-to-r from-background to-transparent' />

              {/* Fade effect on the right edge */}
              <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-background to-transparent' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Demos }

// @note

// 'use client'

// import * as React from 'react'
// import { motion } from 'motion/react'
// import {
//   IconPlayerPlayFilled,
//   IconCircle,
//   IconCircleDashed,
//   IconCircleDotted
// } from '@tabler/icons-react'
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
// import { Badge } from '@/components/ui/badge'
// import { Expand } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { DEMOS } from '@/data/landing-content'

// type Clip = (typeof DEMOS.items)[number]['items'][number]

// function Demo({
//   item,
//   index,
//   isPlaying,
//   onPlay,
//   onFullscreen
// }: {
//   item: Clip
//   index: number
//   isPlaying: boolean
//   onPlay: () => void
//   onFullscreen: (e: React.MouseEvent, videoElement: HTMLVideoElement | null) => void
// }) {
//   const videoRef = React.useRef<HTMLVideoElement>(null)

//   return (
//     <motion.div
//       className='group w-[300px] flex-none cursor-pointer'
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.1 * index }}
//       onClick={onPlay}
//     >
//       <div className='relative mb-4 aspect-video overflow-hidden rounded-lg bg-linear-to-br from-muted/50 to-muted/10'>
//         {isPlaying ? (
//           <div className='relative h-full w-full'>
//             <video
//               ref={videoRef}
//               src={item.video}
//               controls
//               className='h-full w-full object-cover'
//               autoPlay
//             >
//               Your browser does not support the video tag.
//             </video>
//             <button
//               className='absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background'
//               onClick={e => {
//                 e.stopPropagation()
//                 onFullscreen(e, videoRef.current)
//               }}
//             >
//               <Expand className='h-4 w-4 text-foreground' />
//             </button>
//           </div>
//         ) : (
//           <>
//             <img
//               src={item.thumbnail || '/placeholder.svg?height=180&width=320'}
//               alt={item.title}
//               className='absolute inset-0 h-full w-full object-cover'
//             />
//             <div className='absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100'>
//               <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/90'>
//                 <IconPlayerPlayFilled className='h-8 w-8 text-primary-foreground' />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//       <div className='-mr-4 space-y-2'>
//         <div className='flex items-center'>
//           <h3 className='line-clamp-1 font-semibold'>{item.title}</h3>
//           <Badge
//             variant='outline'
//             className={cn('ml-2 h-5 rounded-full border-0 py-0 text-xs font-medium', {
//               'bg-[#ceead6] text-[#34a853]': item.status === 'live',
//               'bg-[#feefc3] text-[#fbbc04]': item.status === 'soon',
//               'bg-[#d2e3fc] text-[#4285f4]': item.status === 'planned'
//             })}
//           >
//             {item.status === 'live' && 'Live'}
//             {item.status === 'soon' && 'Soon'}
//             {item.status === 'planned' && 'Planned'}
//           </Badge>
//           {/* <Badge
//             variant='outline'
//             className={cn('ml-2 h-5 rounded-full border-0 py-0 text-xs font-medium', {
//               'bg-[#ceead6] text-[#34a853]': item.status === 'live',
//               'bg-[#feefc3] text-[#fbbc04]': item.status === 'soon',
//               'bg-[#d2e3fc] text-[#4285f4]': item.status === 'planned'
//             })}
//           >
//             <span className='flex items-center gap-1'>
//               {item.status === 'live' && (
//                 <>
//                   <IconCircle className='h-3 w-3' />
//                   <span>Live</span>
//                 </>
//               )}
//               {item.status === 'soon' && (
//                 <>
//                   <IconCircleDashed className='h-3 w-3' />
//                   <span>Soon</span>
//                 </>
//               )}
//               {item.status === 'planned' && (
//                 <>
//                   <IconCircleDotted className='h-3 w-3' />
//                   <span>Planned</span>
//                 </>
//               )}
//             </span>
//           </Badge> */}
//         </div>
//         <p className='line-clamp-2 text-sm text-muted-foreground'>{item.description}</p>
//       </div>
//     </motion.div>
//   )
// }

// export function Demos() {
//   const [activeVideo, setActiveVideo] = React.useState<string | null>(null)
//   const [isFullscreen, setIsFullscreen] = React.useState(false)

//   // Handle fullscreen toggle
//   const toggleFullscreen = (e: React.MouseEvent, videoElement: HTMLVideoElement | null) => {
//     e.stopPropagation()
//     if (!videoElement) return

//     if (!document.fullscreenElement) {
//       videoElement.requestFullscreen().catch(err => {
//         console.error(`Error attempting to enable full-screen mode: ${err.message}`)
//       })
//     } else {
//       document.exitFullscreen()
//     }
//   }

//   // Monitor fullscreen state
//   React.useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement)
//     }

//     document.addEventListener('fullscreenchange', handleFullscreenChange)
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
//   }, [])

//   return (
//     <div className='py-16 md:py-24'>
//       <div className='container mx-auto px-4 md:text-center'>
//         <Badge
//           variant='outline'
//           className='mb-8 inline-block bg-background text-sm text-muted-foreground'
//         >
//           <span className='cursor-pointer select-none'>{DEMOS.section}</span>
//         </Badge>

//         <h2 className='mb-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
//           {DEMOS.title}
//         </h2>

//         <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>{DEMOS.description}</p>
//       </div>

//       <div className='mt-16 space-y-20'>
//         {DEMOS.items.map(demo => (
//           <div key={demo.title} className='space-y-8'>
//             <div className='container mx-auto px-4 text-left'>
//               <h3 className='text-2xl font-bold'>{demo.title}</h3>
//               <p className='max-w-3xl text-lg text-muted-foreground'>{demo.description}</p>
//             </div>

//             <div className='relative w-full overflow-hidden'>
//               <ScrollArea className='w-full'>
//                 <div className='flex space-x-6 pb-6 pl-[max(1rem,calc((100vw-80rem)/2+1rem))] pr-8'>
//                   {demo.items.map((item, index) => (
//                     <Demo
//                       key={item.title}
//                       item={item}
//                       index={index}
//                       isPlaying={activeVideo === `${demo.title}-${item.title}`}
//                       onPlay={() => {
//                         setActiveVideo(
//                           activeVideo === `${demo.title}-${item.title}`
//                             ? null
//                             : `${demo.title}-${item.title}`
//                         )
//                       }}
//                       onFullscreen={toggleFullscreen}
//                     />
//                   ))}
//                 </div>
//                 <ScrollBar
//                   orientation='horizontal'
//                   className='opacity-0 transition-opacity hover:opacity-100'
//                 />
//               </ScrollArea>

//               {/* Fade effect on the left edge */}
//               <div className='pointer-events-none absolute left-0 top-0 h-full w-12 bg-linear-to-r from-background to-transparent' />

//               {/* Fade effect on the right edge */}
//               <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-background to-transparent' />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
