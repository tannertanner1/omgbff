'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { HERO } from '@/data/marketing-content'
import { cn } from '@/lib/utils'
import { Section } from './section'

function Hero() {
  return (
    <Section className='py-12 md:py-24'>
      <Badge
        variant='outline'
        className='mb-8 bg-background text-sm text-muted-foreground'
      >
        <span className='cursor-pointer select-none'>{HERO.section}</span>
      </Badge>

      <h1 className='mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl'>
        {HERO.title}
      </h1>

      <p className='mb-8 max-w-[42rem] text-balance text-lg leading-normal text-muted-foreground sm:leading-8 md:text-xl'>
        {HERO.description}
      </p>

      <div className='mb-12 flex flex-wrap gap-4'>
        <Link href={HERO.link || '#'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className='rounded-xl bg-primary px-6 py-2 font-sans text-sm font-medium text-background'
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {HERO.button || 'Get Started'}
          </motion.button>
        </Link>
      </div>

      <div className='w-full max-w-4xl overflow-hidden rounded-lg border border-border shadow-lg'>
        <div className='relative h-[250px] md:h-[350px]'>
          <div
            className={cn(
              'absolute inset-0',
              '[background-size:40px_40px]',
              '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
              'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
            )}
          />
          <img
            src={HERO.image || '/placeholder.svg?height=350&width=700'}
            alt='Dashboard preview'
            className='h-full w-full object-cover'
            style={{
              maskImage: 'linear-gradient(to top, transparent, black 20%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent, black 20%)'
            }}
          />
        </div>
      </div>
    </Section>
  )
}

export { Hero }
