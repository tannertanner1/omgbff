'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PHONE } from '@/data/customer-fields'
import { IMaskInput } from 'react-imask'

export function Phone({
  id,
  name,
  defaultValue,
  required,
  disabled
}: {
  id: string
  name: string
  defaultValue?: any
  required?: boolean
  disabled?: boolean
}) {
  const [phoneNumbers, setPhoneNumbers] = React.useState<any[]>(
    defaultValue || [{ label: PHONE[0], number: '' }]
  )

  const addPhone = () => {
    setPhoneNumbers([...phoneNumbers, { label: PHONE[1], number: '' }])
  }

  const removePhone = (index: number) => {
    if (index === 0) return // Prevent removing the first phone number
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))
  }

  const updatePhone = (index: number, field: string, value: string) => {
    const newPhoneNumbers = [...phoneNumbers]
    newPhoneNumbers[index][field] = value
    setPhoneNumbers(newPhoneNumbers)
  }

  return (
    <Accordion type='multiple' className='w-full'>
      {phoneNumbers.map((phone, index) => (
        <AccordionItem key={index} value={`phone-${index}`}>
          <AccordionTrigger>{phone.label} Phone</AccordionTrigger>
          <AccordionContent>
            <div className='space-y-4'>
              {index !== 0 && (
                <Select
                  name={`${name}.${index}.label`}
                  value={phone.label}
                  onValueChange={value => updatePhone(index, 'label', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select label' />
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE.filter(label => label !== PHONE[0]).map(label => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <IMaskInput
                id={`${name}.${index}.number`}
                name={`${name}.${index}.number`}
                placeholder='Phone Number'
                value={phone.number}
                onAccept={value => updatePhone(index, 'number', value)}
                mask='(000) 000-0000'
                required={required}
                disabled={disabled}
              />
              {index !== 0 && (
                <Button
                  type='button'
                  onClick={() => removePhone(index)}
                  variant='destructive'
                >
                  Remove Phone
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      {phoneNumbers.length < PHONE.length && (
        <Button type='button' onClick={addPhone} className='mt-2'>
          Add Phone
        </Button>
      )}
    </Accordion>
  )
}
