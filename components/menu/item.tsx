import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { IconChevronRight } from '@tabler/icons-react'

export function Item({
  icon,
  title,
  description,
  iconClassName,
  href
}: {
  icon: React.ReactNode
  title: string
  description: string
  iconClassName?: string
  href: string
}) {
  return (
    <motion.a
      href={href}
      className='flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-background p-4 no-underline shadow-sm'
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          iconClassName
        )}
        whileHover={{ rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
      <div className='flex-1'>
        <h3 className='text-xl font-semibold text-primary'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      <motion.div
        className='text-accent-foreground'
        whileHover={{ x: 3 }}
        whileTap={{ x: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <IconChevronRight className='h-6 w-6' />
      </motion.div>
    </motion.a>
  )
}
