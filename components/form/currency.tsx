'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'

export function Currency({
  id,
  name,
  defaultValue = '1.00',
  required,
  disabled,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  defaultValue?: string
}) {
  const [displayValue, setDisplayValue] = React.useState(defaultValue)

  React.useEffect(() => {
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
      id={id}
      name={name}
      type='text'
      inputMode='decimal'
      value={displayValue}
      onChange={handleChange}
      min='1'
      step='0.01'
      required={required}
      disabled={disabled}
      {...props}
    />
  )
}
