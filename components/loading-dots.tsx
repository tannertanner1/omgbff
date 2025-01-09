import { cn } from '@/lib/utils'

function LoadingDots({
  color = 'currentColor',
  size = 'small',
  className = ''
}: {
  color?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}) {
  const dotSize =
    size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'
  const dotSpacing = size === 'small' ? 'space-x-1' : 'space-x-2'

  return (
    <div
      className={cn('flex items-center justify-center', dotSpacing, className)}
      aria-label='Loading'
    >
      <div className={cn(dotSize, 'animate-pulse rounded-full', color)} />
      <div
        className={cn(
          dotSize,
          'animate-pulse rounded-full',
          color,
          '[animation-delay:0.2s]'
        )}
      />
      <div
        className={cn(
          dotSize,
          'animate-pulse rounded-full',
          color,
          '[animation-delay:0.4s]'
        )}
      />
    </div>
  )
}

export { LoadingDots }

/**

export default function LoadingPage() {
  return (
    <div
      className="flex h-screen items-start justify-center pt-[40vh]"
      aria-label="Loading"
    >
      <LoadingDots color="bg-primary" size="medium" />
    </div>
  );
}

*/
