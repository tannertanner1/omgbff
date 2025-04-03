import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Grid } from './background'
import { Fade } from './background'
import { HERO } from '@/data/marketing-content'
import { cn } from '@/lib/utils'

function Hero() {
  return (
    <div className='flex w-full flex-col items-center justify-center py-12 md:py-24'>
      <h1 className='mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl'>
        {HERO.title}
      </h1>
      <p className='mb-8 max-w-2xl text-lg text-muted-foreground'>
        {HERO.description}
      </p>
      <div className='mb-12 flex flex-wrap justify-center gap-4'>
        <Link href={HERO.buttonUrl || '/login'}>
          <Button className='rounded-full px-8 py-6 text-lg'>
            {HERO.buttonText || 'Get Started'}
          </Button>
        </Link>
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
          <Fade
            src={
              HERO.image ||
              'https://placehold.co/1920x1200/transparent/transparent'
            }
            alt='Dashboard preview'
            direction='bottom'
            fadePercentage={20}
            className='h-full w-full'
          />
        </div>
      </div>
    </div>
  )
}

export { Hero }
