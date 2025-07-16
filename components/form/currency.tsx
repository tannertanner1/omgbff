"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export const Currency = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Currency({ value, onChange, onBlur, defaultValue, ...props }, ref) {
  // Convert value to string to fix TypeScript error
  const stringValue = typeof value === "string" ? value : String(value || "")
  const stringDefaultValue =
    typeof defaultValue === "string" ? defaultValue : String(defaultValue || "")

  const [displayValue, setDisplayValue] = React.useState(
    stringValue || stringDefaultValue || ""
  )

  // Sync with external value changes (from react-hook-form)
  React.useEffect(() => {
    if (value !== undefined) {
      const newStringValue = typeof value === "string" ? value : String(value)
      setDisplayValue(newStringValue)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value

    // Allow empty input
    if (inputValue === "") {
      setDisplayValue("")
      e.target.value = ""
      onChange?.(e)
      return
    }

    // Remove non-numeric characters except decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, "")

    // Prevent multiple decimal points
    if ((inputValue.match(/\./g) || []).length > 1) return

    // Allow partial input like "0." or "123."
    if (inputValue.endsWith(".")) {
      setDisplayValue(inputValue)
      e.target.value = inputValue
      onChange?.(e)
      return
    }

    const numberValue = Number.parseFloat(inputValue)

    // Handle invalid numbers
    if (isNaN(numberValue)) {
      setDisplayValue("0")
      e.target.value = "0"
      onChange?.(e)
      return
    }

    // Limit decimal places to 2
    if (inputValue.includes(".")) {
      const [whole, decimal] = inputValue.split(".")
      if (decimal.length > 2) {
        inputValue = numberValue.toFixed(2)
      }
    }

    setDisplayValue(inputValue)
    e.target.value = inputValue
    onChange?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Format to 2 decimal places on blur
    if (displayValue && displayValue !== "") {
      const numberValue = Number.parseFloat(displayValue)
      if (!isNaN(numberValue)) {
        const formatted = numberValue.toFixed(2)
        setDisplayValue(formatted)
        e.target.value = formatted
        onChange?.({
          ...e,
          type: "change",
        } as React.ChangeEvent<HTMLInputElement>)
      }
    }
    onBlur?.(e)
  }

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  )
})
