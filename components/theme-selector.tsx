'use client'

import { useThemeConfig } from '@/components/active-theme'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const THEMES = [
  {
    name: 'Default',
    value: 'default'
  },
  {
    name: 'Neobrutalism',
    value: 'neobrutalism'
  },
  {
    name: 'Claymorphism',
    value: 'claymorphism'
  }
]
type Theme = (typeof THEMES)[number]

function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <Select value={activeTheme} onValueChange={setActiveTheme}>
      <SelectTrigger size='sm' className='w-32'>
        <SelectValue placeholder='Select a theme' />
      </SelectTrigger>
      <SelectContent align='end'>
        {THEMES.map(theme => (
          <SelectItem key={theme.name} value={theme.value}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { THEMES, type Theme, ThemeSelector }
