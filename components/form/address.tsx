'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
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
import {
  ADDRESS_LABELS,
  COUNTRIES,
  getRegionsByCountry,
  getPostalCodeMask,
  type AddressLabel,
  type Country,
  type Region
} from '@/data/customer-fields'
import { IMaskInput } from 'react-imask'

export function Address({
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
  const [streetAddresses, setStreetAddresses] = React.useState<any[]>(
    defaultValue || [
      {
        label: 'Mailing',
        line1: '',
        line2: '',
        city: '',
        region: '',
        postal: '',
        country: 'Canada'
      }
    ]
  )

  const addAddress = () => {
    setStreetAddresses([
      ...streetAddresses,
      {
        label: '',
        line1: '',
        line2: '',
        city: '',
        region: '',
        postal: '',
        country: 'Canada'
      }
    ])
  }

  const removeAddress = (index: number) => {
    if (index === 0) return // Prevent removing the Mailing address
    setStreetAddresses(streetAddresses.filter((_, i) => i !== index))
  }

  const updateAddress = (index: number, field: string, value: string) => {
    const newAddresses = [...streetAddresses]
    newAddresses[index][field] = value
    setStreetAddresses(newAddresses)
  }

  return (
    <Accordion type='multiple' className='w-full'>
      {streetAddresses.map((address, index) => (
        <AccordionItem key={index} value={`address-${index}`}>
          <AccordionTrigger>
            {address.label || `Address ${index + 1}`}
          </AccordionTrigger>
          <AccordionContent>
            <div className='space-y-4'>
              <Select
                name={`${name}.${index}.label`}
                value={address.label}
                onValueChange={value => updateAddress(index, 'label', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select label' />
                </SelectTrigger>
                <SelectContent>
                  {ADDRESS_LABELS.map((label: AddressLabel) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                  <SelectItem value='custom'>Custom</SelectItem>
                </SelectContent>
              </Select>
              {address.label === 'custom' && (
                <Input
                  placeholder='Custom label'
                  value={address.customLabel || ''}
                  onChange={e =>
                    updateAddress(index, 'customLabel', e.target.value)
                  }
                />
              )}

              <Input
                id={`${name}.${index}.line1`}
                name={`${name}.${index}.line1`}
                placeholder='Address Line 1'
                value={address.line1}
                onChange={e => updateAddress(index, 'line1', e.target.value)}
                required={required}
                disabled={disabled}
              />

              <Input
                id={`${name}.${index}.line2`}
                name={`${name}.${index}.line2`}
                placeholder='Address Line 2'
                value={address.line2}
                onChange={e => updateAddress(index, 'line2', e.target.value)}
                disabled={disabled}
              />

              <Input
                id={`${name}.${index}.city`}
                name={`${name}.${index}.city`}
                placeholder='City'
                value={address.city}
                onChange={e => updateAddress(index, 'city', e.target.value)}
                required={required}
                disabled={disabled}
              />

              <Select
                name={`${name}.${index}.country`}
                value={address.country}
                onValueChange={value => {
                  updateAddress(index, 'country', value)
                  updateAddress(index, 'region', '') // Reset region when country changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select country' />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country: Country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                name={`${name}.${index}.region`}
                value={address.region}
                onValueChange={value => updateAddress(index, 'region', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select State/Province' />
                </SelectTrigger>
                <SelectContent>
                  {getRegionsByCountry(address.country).map(
                    (region: Region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <div>
                <label htmlFor={`${name}.${index}.postal`}>
                  ZIP/Postal Code
                </label>
                <IMaskInput
                  id={`${name}.${index}.postal`}
                  name={`${name}.${index}.postal`}
                  placeholder='ZIP/Postal Code'
                  value={address.postal}
                  onAccept={value => updateAddress(index, 'postal', value)}
                  mask={getPostalCodeMask(address.country)}
                  required={required}
                  disabled={disabled}
                />
              </div>

              {index !== 0 && (
                <Button
                  type='button'
                  onClick={() => removeAddress(index)}
                  variant='destructive'
                >
                  Remove Address
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      {streetAddresses.length < 3 && (
        <Button type='button' onClick={addAddress} className='mt-2'>
          Add Address
        </Button>
      )}
    </Accordion>
  )
}
