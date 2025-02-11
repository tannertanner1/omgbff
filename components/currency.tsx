'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface CurrencyProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string
}

export const Currency: React.FC<CurrencyProps> = ({
  defaultValue = '1.00',
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(defaultValue)

  useEffect(() => {
    // Update the display value when the defaultValue prop changes
    setDisplayValue(defaultValue)
  }, [defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    let numberValue = Number.parseFloat(value)

    if (isNaN(numberValue) || numberValue < 1) {
      numberValue = 1
    }

    const formattedValue = numberValue.toFixed(2)
    setDisplayValue(formattedValue)
  }

  return (
    <Input
      {...props}
      type='text'
      inputMode='decimal'
      value={displayValue}
      onChange={handleChange}
      min='1'
      step='0.01'
    />
  )
}
