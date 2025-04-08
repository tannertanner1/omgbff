'use client'

import * as React from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'

import { META_THEME_COLORS, useMetaColor } from '@/hooks/use-meta-color'
import { Button } from '@/components/ui/button'

function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor } = useMetaColor()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    setMetaColor(
      resolvedTheme === 'dark'
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    )
  }, [resolvedTheme, setTheme, setMetaColor])

  return (
    <Button
      variant='outline'
      size='icon'
      className='group/toggle size-8'
      onClick={toggleTheme}
    >
      <IconSun className='hidden [html.dark_&]:block' />
      <IconMoon className='hidden [html.light_&]:block' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}

export { ModeSwitcher }
