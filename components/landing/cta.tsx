import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconBrandGithub } from '@tabler/icons-react'

const CTA = () => (
  <div className='w-full py-20 lg:py-40'>
    <div className='container mx-auto'>
      <div className='flex flex-col items-center gap-8 rounded-md p-4 text-center lg:p-14'>
        <Badge
          variant='outline'
          className='bg-background text-muted-foreground mb-8 text-sm'
        >
          <label className='cursor-pointer select-none after:absolute after:inset-0'>
            Get started faster
          </label>
        </Badge>
        <div className='flex flex-col gap-2'>
          <h3 className='font-regular max-w-xl text-3xl tracking-tighter md:text-5xl'>
            100% open-source & free
          </h3>
          <p className='text-muted-foreground max-w-xl text-lg leading-relaxed tracking-tight'></p>
        </div>
        <div className='flex flex-row gap-4'>
          <Button
            // variant='outline'
            className='bg-background text-primary border-primary rounded-xl border-1 py-2 font-sans text-sm font-medium'
          >
            <IconBrandGithub
              className='text-muted-foreground'
              size={16}
              aria-hidden='true'
            />
            GitHub
          </Button>
        </div>
      </div>
    </div>
  </div>
)

export { CTA }

/** @see https://www.twblocks.com/blocks/ctas/cta1 */
