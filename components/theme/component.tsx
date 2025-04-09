'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { META_THEME_COLORS, useMetaColor } from '@/hooks/use-meta-color'
import { IconPercentage50 } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useThemeConfig } from '@/components/theme/active-theme'

const THEMES = [
  {
    name: 'Default',
    value: 'default'
  },
  {
    name: 'Neobrutal',
    value: 'neobrutalism'
  },
  {
    name: 'Clay',
    value: 'claymorphism'
  }
]
// type Style = (typeof THEMES)[number]

function Component() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const { setMetaColor } = useMetaColor()

  // Set mounted state after component mounts
  React.useEffect(() => setMounted(true), [])

  // Handle theme change with meta color update
  const handleThemeChange = React.useCallback(
    (value: string) => {
      setTheme(value)

      // Update meta color based on the new theme
      const newResolvedTheme =
        value === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : value

      setMetaColor(newResolvedTheme === 'dark' ? META_THEME_COLORS.dark : META_THEME_COLORS.light)
    },
    [setTheme, setMetaColor]
  )

  // Handle style theme change
  const handleStyleChange = React.useCallback(
    (value: string) => {
      setActiveTheme(value)
    },
    [setActiveTheme]
  )

  if (!mounted) {
    return <div className='h-8 w-8 animate-pulse rounded-md bg-muted/20'></div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='group/toggle rounded-full bg-transparent text-primary hover:bg-transparent'
        >
          <IconPercentage50 aria-hidden='true' className='dark:rotate-360 h-12 w-12 dark:hidden' />
          <IconPercentage50 aria-hidden='true' className='rotate-360 hidden h-12 w-12 dark:block' />
          <span className='sr-only'>Theme settings</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
            <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Vibe</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={activeTheme} onValueChange={handleStyleChange}>
            {THEMES.map(item => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                {item.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { Component }
