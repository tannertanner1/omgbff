'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Section } from './section'
import { STEPS } from '@/data/landing-content'

type Tab = (typeof STEPS.items)[number]

function Step({
  item,
  index,
  isActive,
  onClick
}: {
  item: Tab
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <button
      className={cn(
        'group relative flex w-full flex-col items-start rounded-lg p-4 text-left transition-all duration-300',
        isActive ? 'bg-muted' : 'hover:bg-accent/50'
      )}
      onClick={onClick}
    >
      <div className='mb-3 flex items-center gap-3'>
        {/* <div className='bg-background/50 rounded-lg p-1.5'>
          <Icon className='text-primary h-5 w-5' />
        </div> */}
        <Icon className='h-8 w-8 text-primary' />
        <div className='text-base font-semibold'>{item.title}</div>
      </div>
      <p className='z-10 m-0 text-sm leading-relaxed text-muted-foreground'>
        {item.description}
      </p>
    </button>
  )
}

function Steps() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Set up scroll animation
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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

            // Animate content if it exists
            if (contentRef.current) {
              contentRef.current.style.opacity = '0'
              contentRef.current.style.transform = 'translateY(20px)'

              setTimeout(() => {
                contentRef.current!.style.transition =
                  'opacity 0.6s ease, transform 0.6s ease'
                contentRef.current!.style.opacity = '1'
                contentRef.current!.style.transform = 'translateY(0)'
              }, 200)
            }

            // Disconnect after animation
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={sectionRef} className='bg-background py-16 md:py-24'>
      <Section>
        <Badge
          variant='outline'
          className='mb-8 bg-background text-sm text-muted-foreground'
        >
          <span className='cursor-pointer select-none'>{STEPS.section}</span>
        </Badge>

        <h2
          ref={headingRef}
          className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'
        >
          {STEPS.title}
        </h2>

        <p className='mt-4 text-lg text-muted-foreground'>
          {STEPS.description}
        </p>

        <div ref={contentRef} className='mt-12'>
          {/* Tab */}
          <div className='mb-10 flex w-full flex-col gap-2 md:flex-row'>
            {STEPS.items.map((item, index) => (
              <Step
                key={index}
                item={item}
                index={index}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>

          {/* Image */}
          {/* <Card
            className={cn(
              'bg-background inset-shadow-background w-full max-w-4xl overflow-hidden rounded-[2rem] border-0 shadow-none inset-shadow-sm'
            )}
          > */}
          <div className='relative h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]'>
            {STEPS.items.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                  activeStep === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
                }`}
              >
                <div className='relative h-full w-full'>
                  <div
                    className={cn(
                      'absolute inset-0',
                      '[background-size:20px_20px]',
                      '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
                      'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
                    )}
                  />
                  <img
                    src={item.image || '/placeholder.svg?height=400&width=800'}
                    alt={item.title}
                    className='relative z-10 h-full w-full object-cover'
                    style={{
                      maskImage:
                        'linear-gradient(to top, transparent, black 20%)',
                      WebkitMaskImage:
                        'linear-gradient(to top, transparent, black 20%)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* </Card> */}
        </div>
      </Section>
    </div>
  )
}

export { Steps }
