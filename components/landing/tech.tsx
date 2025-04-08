'use client'

import { useState, useRef, useEffect } from 'react'
import { inView } from 'motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Section } from './section'
import { TECH } from '@/data/landing-content'

function Tech() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const iconsContainerRef = useRef<HTMLDivElement>(null)

  // Set up scroll animation
  useEffect(() => {
    if (!sectionRef.current) return

    inView(sectionRef.current, () => {
      // Animate heading if it exists
      if (headingRef.current) {
        headingRef.current.style.opacity = '0'
        headingRef.current.style.transform = 'translateY(20px)'

        setTimeout(() => {
          headingRef.current!.style.transition =
            'opacity 0.6s ease, transform 0.6s ease'
          headingRef.current!.style.opacity = '1'
          headingRef.current!.style.transform = 'translateY(0)'
        }, 100)
      }

      // Animate tech icons with stagger if container exists
      if (iconsContainerRef.current) {
        const techItems = Array.from(
          iconsContainerRef.current.querySelectorAll('.tech-item')
        )

        if (techItems.length > 0) {
          techItems.forEach((item, index) => {
            const element = item as HTMLElement
            element.style.opacity = '0'
            element.style.transform = 'translateY(20px)'

            setTimeout(
              () => {
                element.style.transition =
                  'opacity 0.5s ease, transform 0.5s ease'
                element.style.opacity = '1'
                element.style.transform = 'translateY(0)'
              },
              100 + index * 50
            ) // 50ms stagger between items
          })
        }
      }
    })
  }, [])

  return (
    <div ref={sectionRef} className='w-full py-16 md:py-24' id='tech-stack'>
      <Section>
        <Badge
          variant='outline'
          className='mb-8 bg-background text-sm text-muted-foreground'
        >
          <span className='cursor-pointer select-none'>{TECH.section}</span>
        </Badge>

        <h2
          ref={headingRef}
          className='text-balance text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'
        >
          {TECH.title}
        </h2>

        {TECH.description && (
          <p className='mt-4 text-lg text-muted-foreground'>
            {TECH.description}
          </p>
        )}

        <div ref={iconsContainerRef} className='mt-12 w-full max-w-4xl'>
          <div className='grid grid-cols-3 justify-items-center gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-6'>
            {TECH.items.map(tech => {
              const isHovered = hoveredIcon === tech.name

              return (
                <a
                  key={tech.name}
                  href={tech.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='tech-item group flex flex-col items-center gap-2'
                  onMouseEnter={() => setHoveredIcon(tech.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <div className='relative flex h-16 w-16 items-center justify-center md:h-20 md:w-20'>
                    <tech.icon
                      className={cn(
                        'h-12 w-12 transition-all duration-300 md:h-16 md:w-16',
                        'transition-colors duration-200 hover:text-blue-500',
                        isHovered ? 'text-blue-500' : 'text-primary'
                      )}
                      style={{
                        transform: isHovered
                          ? 'rotateX(10deg) rotateY(10deg) scale(1.05)'
                          : 'rotateX(0deg) rotateY(0deg) scale(1)',
                        transition: 'transform 0.3s ease',
                        filter: isHovered
                          ? 'drop-shadow(0 0 2px rgba(var(--primary), 0.3))'
                          : 'none'
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-center font-mono text-xs transition-colors duration-300 md:text-sm',
                      isHovered ? 'text-blue-500' : 'text-foreground/80'
                    )}
                  >
                    {tech.name}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}

export { Tech }
