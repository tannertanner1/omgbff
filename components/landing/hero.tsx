'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Grid } from './background'
import { Fade } from './background'
import { HERO } from '@/data/marketing-content'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'

const BounceButton = () => {
  return (
    <div>
      <Link href={HERO.link || '#'}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className='rounded-xl bg-primary px-6 py-2 font-sans text-sm font-medium text-background'
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {HERO.button || ''}
        </motion.button>
      </Link>
    </div>
  )
}

// text-start md:text-center items-start md:items-center justify-start md:justify-center

function Hero() {
  return (
    <section className='container flex max-w-[64rem] flex-col gap-4'>
      <div className='flex w-full flex-col items-start justify-start py-12 text-start md:items-center md:justify-center md:py-24 md:text-center'>
        <Badge
          variant='outline'
          className='mb-8 bg-background text-sm text-muted-foreground'
        >
          <label className='cursor-pointer select-none after:absolute after:inset-0'>
            🚀 Announcing public beta
          </label>
        </Badge>
        <h1 className='mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl'>
          {HERO.title}
        </h1>
        <p className='mb-8 max-w-[42rem] text-balance text-lg leading-normal text-muted-foreground sm:leading-8 md:text-xl'>
          {HERO.description}
        </p>
        <div className='mb-12 flex flex-wrap gap-4'>
          <BounceButton />
        </div>

        <div className='w-full max-w-4xl overflow-hidden rounded-lg border border-border shadow-lg'>
          <div className='relative h-[300px] md:h-[400px]'>
            <div
              className={cn(
                'absolute inset-0',
                '[background-size:40px_40px]',
                '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
                'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
              )}
            />
            {/* <Fade
              src={
                HERO.image ||
                'https://placehold.co/1920x1200/transparent/transparent'
              }
              alt='Dashboard preview'
              direction='bottom'
              fadePercentage={20}
              className='h-full w-full'
            /> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
