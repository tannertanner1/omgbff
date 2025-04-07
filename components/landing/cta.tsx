'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CTA } from '@/data/marketing-content'
import { motion } from 'motion/react'
import { Section } from './section'

export function Cta() {
  const Icon = CTA.button.icon

  return (
    <div className='py-16 md:py-24'>
      <Section>
        <Badge
          variant='outline'
          className='mb-8 bg-background text-sm text-muted-foreground'
        >
          <span className='cursor-pointer select-none'>{CTA.section}</span>
        </Badge>

        <h2 className='text-3xl font-bold tracking-tighter md:text-5xl'>
          {CTA.title}
        </h2>

        {CTA.description && (
          <p className='mt-4 max-w-[42rem] text-lg leading-relaxed text-muted-foreground'>
            {CTA.description}
          </p>
        )}

        <motion.div
          className='mt-8 flex flex-row gap-4'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Button
            variant='outline'
            className='flex items-center gap-2 rounded-lg border-primary px-4 py-2 text-sm font-medium'
            asChild
          >
            <a href={CTA.button.href} target='_blank' rel='noopener noreferrer'>
              {Icon && <Icon className='h-4 w-4' />}
              {CTA.button.text}
            </a>
          </Button>
        </motion.div>
      </Section>
    </div>
  )
}
