'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Building,
  Users,
  FileText,
  Github,
  ClipboardList,
  Calendar,
  BarChart
} from 'lucide-react'
import { hero, steps, features, walkthrough, cta, sections, type Section } from '@/data/marketing-content'

// Custom icons for the steps
function IconPlayerPlayFilled({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <path d='M8 5.14v14l11-7-11-7z' />
    </svg>
  )
}

// Helper function to get the right icon
function getIcon(name: string, className = 'h-6 w-6') {
  const icons: Record<string, React.ReactNode> = {
    Building: <Building className={className} />,
    Users: <Users className={className} />,
    FileInvoice: <FileText className={className} />,
    ClipboardList: <ClipboardList className={className} />,
    Calendar: <Calendar className={className} />,
    ChartBar: <BarChart className={className} />,
    Github: <Github className={className} />
  }

  return icons[name] || null
}

function VideoPreview({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      className='group w-[300px] flex-none cursor-pointer'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className='relative mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted/10'>
        <img
          src={item.thumbnailUrl || '/placeholder.svg'}
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

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className='mb-8 flex justify-center'>
      <Badge variant='outline' className='px-3 py-1 text-sm font-medium'>
        {children}
      </Badge>
    </div>
  )
}

// Add this new component function before the MarketingAlt function:

function GetStartedTabs({
  steps
}: {
  steps: typeof import('@/lib/content').steps
}) {
  const [activeStep, setActiveStep] = useState(1)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabIndicatorRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Animate the tab indicator and images when the active tab changes
  useEffect(() => {
    // Animate the tab indicator
    if (
      tabRefs.current[activeStep - 1] &&
      tabIndicatorRef.current &&
      tabsContainerRef.current
    ) {
      const activeTab = tabRefs.current[activeStep - 1]
      const containerRect = tabsContainerRef.current.getBoundingClientRect()
      const tabRect = activeTab?.getBoundingClientRect()

      if (tabRect) {
        // Calculate position relative to the container
        const left = tabRect.left - containerRect.left
        const width = tabRect.width

        // Update the indicator position
        tabIndicatorRef.current.style.transform = `translateX(${left}px)`
        tabIndicatorRef.current.style.width = `${width}px`
      }
    }

    // Animate the image
    if (imageContainerRef.current) {
      const images = Array.from(imageContainerRef.current.children)

      // Hide all images
      images.forEach((img, index) => {
        if (index + 1 !== activeStep) {
          img.classList.add('opacity-0')
          img.classList.add('translate-y-8')
        } else {
          img.classList.remove('opacity-0')
          img.classList.remove('translate-y-8')
        }
      })
    }
  }, [activeStep])

  return (
    <div className='mt-8'>
      {/* Tab Navigation */}
      <div
        ref={tabsContainerRef}
        className='relative mb-8 flex w-full flex-col gap-2 md:flex-row'
      >
        {/* Moving indicator background */}
        <div
          ref={tabIndicatorRef}
          className='pointer-events-none absolute z-0 rounded-md bg-accent transition-all duration-300 ease-in-out'
          style={{
            height: '100%',
            width: '33.333%'
          }}
        />

        {steps.map((step, index) => (
          <button
            key={index}
            ref={el => (tabRefs.current[index] = el)}
            className={`group relative z-10 flex w-full flex-col items-start rounded-md p-4 text-left transition-colors ${
              activeStep === index + 1
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveStep(index + 1)}
          >
            <div className='mb-2 flex flex-col items-start'>
              <Badge variant='outline' className='mb-2 px-2 py-0.5'>
                Step {step.step}
              </Badge>
              <span className='text-lg font-semibold'>{step.title}</span>
            </div>
            <p className='text-sm'>{step.description}</p>
          </button>
        ))}
      </div>

      {/* Image Container */}
      <div
        ref={imageContainerRef}
        className='relative h-[300px] w-full overflow-hidden rounded-lg border border-border md:h-[400px]'
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              activeStep === index + 1
                ? ''
                : 'pointer-events-none translate-y-8 opacity-0'
            }`}
          >
            <img
              src={step.image || '/placeholder.svg'}
              alt={step.title}
              className='h-full w-full rounded-lg object-cover'
            />
            <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/80 to-transparent p-6'>
              <h3 className='mb-2 text-2xl font-bold'>{step.title}</h3>
              <p className='max-w-md text-muted-foreground'>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MarketingAlt() {
  return (
    <div className='flex w-full flex-col items-center justify-center py-12 md:py-24'>
      {/* Hero Section */}
      <motion.div
        className='mb-16 flex flex-col items-center px-4 text-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>
          {hero.title}
        </h1>
        <p className='mb-8 max-w-2xl text-lg text-muted-foreground'>
          {hero.description}
        </p>
        <div className='flex flex-wrap justify-center gap-4'>
          <Link href='/login'>
            <Button className='rounded-full px-8 py-6 text-lg'>
              Get Started
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Dashboard Preview */}
      <motion.div
        className='mb-24 w-full max-w-4xl px-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className='overflow-hidden rounded-lg border border-border shadow-lg'>
          <img
            src='/placeholder.svg?height=500&width=800'
            alt='Dashboard Preview'
            className='h-auto w-full'
          />
        </div>
      </motion.div>

      {/* Getting Started Steps - Interactive Tabs */}
      <motion.div
        className='mb-24 w-full max-w-5xl px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionBadge>Getting Started</SectionBadge>

        <GetStartedTabs steps={steps} />
      </motion.div>

      {/* Feature Walkthrough - With Title and Overflow */}
      <motion.div
        className='mb-24 w-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className='container mx-auto mb-8 max-w-5xl px-4 text-center'>
          <SectionBadge>App Walkthrough</SectionBadge>
          <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
            {walkthrough.description}
          </p>
        </div>

        <div className='space-y-20'>
          {sections.map(section => (
            <div key={section.title} className='space-y-8'>
              <div className='container mx-auto max-w-5xl px-4'>
                <h3 className='text-2xl font-bold'>{section.title}</h3>
                <p className='max-w-3xl text-lg text-muted-foreground'>
                  {section.description}
                </p>
              </div>

              <div className='w-full overflow-hidden'>
                <ScrollArea className='w-full'>
                  <div className='flex space-x-6 pb-6 pl-4 md:pl-[calc((100vw-80rem)/2+1rem)]'>
                    {section.items.map((item, index) => (
                      <VideoPreview
                        key={item.title}
                        item={item}
                        index={index}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation='horizontal' />
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Features Section - Redesigned with matching colors */}
      <motion.div
        className='w-full py-16'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className='container mx-auto px-4'>
          <SectionBadge>Features</SectionBadge>
          <p className='mx-auto mb-12 max-w-2xl text-center text-muted-foreground'>
            {features.subtitle}
          </p>

          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {features.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className='rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.6 }}
              >
                <div className='mb-4'>
                  {getIcon(feature.icon, 'h-10 w-10 text-primary')}
                </div>
                <h3 className='mb-2 text-xl font-bold'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section - Updated with GitHub button */}
      <motion.div
        className='flex flex-col items-center py-16'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className='mb-8 px-4 text-center'>
          <h3 className='mb-8 text-2xl font-bold'>{cta.title}</h3>
          <div className='flex flex-wrap justify-center gap-4'>
            {cta.buttons.map(button => (
              <Link key={button.label} href={button.href}>
                <Button
                  variant={button.variant as any}
                  className='rounded-full px-8 py-6 text-lg'
                >
                  {button.icon && getIcon(button.icon, 'mr-2 h-5 w-5')}
                  {button.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
