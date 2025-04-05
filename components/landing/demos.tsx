'use client'

import { motion } from 'motion/react'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Section } from './background'
import { DEMOS } from '@/data/marketing-content'
import { Badge } from '@/components/ui/badge'

type Clip = (typeof DEMOS.items)[number]['items'][number]

function Demo({ item, index }: { item: Clip; index: number }) {
  return (
    <motion.div
      className='group w-[300px] flex-none cursor-pointer'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className='relative mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted/10'>
        <img
          src={
            item.thumbnail ||
            'https://placehold.co/180x320/transparent/transparent'
          }
          alt={item.title}
          className='absolute inset-0 h-full w-full object-cover'
        />
        <div className='absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/90'>
            <IconPlayerPlayFilled className='h-8 w-8 text-primary-foreground' />
          </div>
        </div>
      </div>
      <div className='-mr-4 space-y-2'>
        <h3 className='line-clamp-1 font-semibold'>{item.title}</h3>
        <p className='line-clamp-2 text-sm text-muted-foreground'>
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

function Demos() {
  return (
    <motion.div
      className='mb-24 w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className='container mx-auto mb-8 max-w-5xl items-start justify-start space-y-12 px-4 text-start md:items-center md:justify-center md:text-center'>
        <Badge
          variant='outline'
          className='mb-8 bg-background text-sm text-muted-foreground'
        >
          <label className='cursor-pointer select-none after:absolute after:inset-0'>
            {/* There is more */}
            Feature walkthrough roadmap
          </label>
        </Badge>
        <h2 className='mb-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          Shipped and shipping
        </h2>
        <h2 className='text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'></h2>
        <p className='mx-auto mb-12 max-w-3xl text-lg text-muted-foreground'>
          {DEMOS.description}
        </p>
      </div>

      <div className='space-y-20'>
        {DEMOS.items.map(demo => (
          <div key={demo.title} className='space-y-8'>
            <div className='container mx-auto max-w-5xl px-4'>
              <h3 className='mb-4 text-2xl font-bold'>{demo.title}</h3>
              <p className='max-w-3xl text-lg text-muted-foreground'>
                {demo.description}
              </p>
            </div>

            <div className='w-full'>
              <ScrollArea className='w-full'>
                <div className='flex space-x-6 pb-6 pl-4 md:pl-[calc((100vw-80rem)/2+1rem)]'>
                  {demo.items.map((item, index) => (
                    <Demo key={item.title} item={item} index={index} />
                  ))}
                </div>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export { Demos }
