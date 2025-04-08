'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Expand } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Status, statusConfig } from '@/data/roadmap-statuses'
import { DEMOS } from '@/data/landing-content'

// Define the type for a video item
type VideoItem = (typeof DEMOS.items)[number]['items'][number]

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]

  return (
    <Badge
      variant='outline'
      className={cn('ml-2 h-5 py-0 text-xs font-normal', 'border-0')}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.borderColor
      }}
    >
      {config.label}
    </Badge>
  )
}

function VideoThumbnail({
  item,
  index,
  isPlaying,
  onPlay,
  onFullscreen
}: {
  item: VideoItem
  index: number
  isPlaying: boolean
  onPlay: () => void
  onFullscreen: (
    e: React.MouseEvent,
    videoElement: HTMLVideoElement | null
  ) => void
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <motion.div
      className='group w-[300px] flex-none cursor-pointer'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={onPlay}
    >
      <div className='relative mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted/10'>
        {isPlaying ? (
          <div className='relative h-full w-full'>
            <video
              ref={videoRef}
              src={item.video}
              controls
              className='h-full w-full object-cover'
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
            <button
              className='absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background'
              onClick={e => {
                e.stopPropagation()
                onFullscreen(e, videoRef.current)
              }}
            >
              <Expand className='h-4 w-4 text-foreground' />
            </button>
          </div>
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
          <StatusBadge status={item.status} />
        </div>
        <p className='line-clamp-2 text-sm text-muted-foreground'>
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

export function Demos() {
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // Handle fullscreen toggle
  const toggleFullscreen = (
    e: React.MouseEvent,
    videoElement: HTMLVideoElement | null
  ) => {
    e.stopPropagation()
    if (!videoElement) return

    if (!document.fullscreenElement) {
      videoElement.requestFullscreen().catch(err => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        )
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Monitor fullscreen state
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className='py-16 md:py-24'>
      <div className='container mx-auto px-4 md:text-center'>
        <Badge
          variant='outline'
          className='mb-8 inline-block bg-background text-sm text-muted-foreground'
        >
          <span className='cursor-pointer select-none'>{DEMOS.section}</span>
        </Badge>

        <h2 className='mb-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          {DEMOS.title}
        </h2>

        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          {DEMOS.description}
        </p>
      </div>

      <div className='mt-16 space-y-20'>
        {DEMOS.items.map(demo => (
          <div key={demo.title} className='space-y-8'>
            <div className='container mx-auto px-4 text-left'>
              <h3 className='text-2xl font-bold'>{demo.title}</h3>
              <p className='max-w-3xl text-lg text-muted-foreground'>
                {demo.description}
              </p>
            </div>

            <div className='relative w-full overflow-hidden'>
              <ScrollArea className='w-full'>
                <div className='flex space-x-6 pb-6 pl-[max(1rem,calc((100vw-80rem)/2+1rem))] pr-8'>
                  {demo.items.map((item, index) => (
                    <VideoThumbnail
                      key={item.title}
                      item={item}
                      index={index}
                      isPlaying={activeVideo === `${demo.title}-${item.title}`}
                      onPlay={() => {
                        setActiveVideo(
                          activeVideo === `${demo.title}-${item.title}`
                            ? null
                            : `${demo.title}-${item.title}`
                        )
                      }}
                      onFullscreen={toggleFullscreen}
                    />
                  ))}
                </div>
                <ScrollBar
                  orientation='horizontal'
                  className='opacity-0 transition-opacity hover:opacity-100'
                />
              </ScrollArea>

              {/* Fade effect on the left edge */}
              <div className='pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent' />

              {/* Fade effect on the right edge */}
              <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
