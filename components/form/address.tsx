'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ADDRESS, COUNTRY, STATE, PROVINCE } from '@/data/customer-fields'
import { Section } from './section'
import { cn } from '@/lib/utils'
import { IMaskInput } from 'react-imask'
import type { FieldErrors } from '@/types/forms'

export function Address({
  name,
  required
}: {
  name: string
  required?: boolean
}) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: 'fieldId'
  })

  const watchFieldArray = watch(name)
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index]
  }))

  const fieldErrors = errors[name] as FieldErrors | undefined
  const usedLabels = controlledFields.map(field => field.label)

  return (
    <div className='w-full max-w-[338px] pt-6'>
      <Label
        className={cn(
          'mb-2 block',
          required
            ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
            : ''
        )}
      >
        Address
      </Label>
      {controlledFields.map((field, index) => {
        const error = fieldErrors?.[index] as FieldErrors | undefined
        const hasErrors = !!error
        const selectedCountry = watch(`${name}.${index}.country`) || 'Canada'
        const regionOptions = selectedCountry === 'Canada' ? PROVINCE : STATE

        return (
          <Section
            key={field.fieldId}
            title={`${field.label || ADDRESS[index] || 'Address'}`}
            summary={cn(
              '',
              field.line1
                ? field.line2
                  ? `${field.line1}, ${field.line2}`
                  : field.line1
                : ''
            )}
            onRemove={index > 0 ? () => remove(index) : undefined}
            error={
              hasErrors
                ? {
                    type: 'validation',
                    message: 'Required'
                  }
                : undefined
            }
            defaultOpen={hasErrors}
          >
            <div>
              <div className='relative mb-6'>
                <Label
                  className={cn(
                    'mb-2 block pt-6',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  Label
                </Label>
                <Select
                  onValueChange={value => {
                    setValue(`${name}.${index}.label`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                  value={field.label || ''}
                >
                  <SelectTrigger
                    className={cn(error?.label ? 'border-[#DB4437]' : '')}
                  >
                    <SelectValue placeholder='' />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDRESS.filter(
                      label =>
                        !usedLabels.includes(label) || field.label === label
                    ).map(label => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error?.label && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    Required
                  </p>
                )}
              </div>

              <div className='relative mb-6'>
                <Label
                  className={cn(
                    'mb-2 block pt-6',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  Street line 1
                </Label>
                <Input
                  {...register(`${name}.${index}.line1`)}
                  className={cn(error?.line1 ? 'border-[#DB4437]' : '')}
                />
                {error?.line1 && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    Required
                  </p>
                )}
              </div>

              <div className='relative mb-6'>
                <Label className='mb-2 block pt-6'>Street line 2</Label>
                <Input
                  {...register(`${name}.${index}.line2`)}
                  className={cn(error?.line2 ? 'border-[#DB4437]' : '')}
                />
                {error?.line2 && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    Required
                  </p>
                )}
              </div>

              <div className='relative mb-6'>
                <Label
                  className={cn(
                    'mb-2 block pt-6',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  City
                </Label>
                <Input
                  {...register(`${name}.${index}.city`)}
                  className={cn(error?.city ? 'border-[#DB4437]' : '')}
                />
                {error?.city && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    Required
                  </p>
                )}
              </div>

              <div className='relative mb-6'>
                <Label
                  className={cn(
                    'mb-2 block pt-6',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  {selectedCountry === 'Canada' ? 'Province' : 'State'}
                </Label>
                <Select
                  onValueChange={value => {
                    setValue(`${name}.${index}.region`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                  value={
                    field.region ||
                    (selectedCountry === 'Canada'
                      ? 'British Columbia'
                      : 'California')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='relative mb-6'>
                <Label
                  className={cn(
                    'mb-2 block pt-6',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  {selectedCountry === 'Canada' ? 'Postal code' : 'ZIP code'}
                </Label>
                <IMaskInput
                  {...register(`${name}.${index}.postal`)}
                  mask={selectedCountry === 'Canada' ? 'a9a 9a9' : '99999-9999'}
                  definitions={{
                    a: /[A-Za-z]/,
                    '9': /[0-9]/
                  }}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    error?.postal ? 'border-[#DB4437]' : ''
                  )}
                  value={field.postal || ''}
                  onAccept={value => {
                    setValue(`${name}.${index}.postal`, value.toUpperCase(), {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                />
                {error?.postal && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    Required
                  </p>
                )}
              </div>

              <div className='relative mb-6'>
                <Label
                  className={cn(
                    'mb-2 block pt-6',
                    required
                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                      : ''
                  )}
                >
                  Country
                </Label>
                <Select
                  onValueChange={value => {
                    setValue(`${name}.${index}.country`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                    setValue(
                      `${name}.${index}.region`,
                      value === 'Canada' ? 'British Columbia' : 'California',
                      {
                        shouldValidate: true,
                        shouldDirty: true
                      }
                    )
                  }}
                  value={field.country || 'Canada'}
                >
                  <SelectTrigger
                    className={cn(error?.country ? 'border-[#DB4437]' : '')}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error?.country && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    Required
                  </p>
                )}
              </div>
            </div>
          </Section>
        )
      })}

      {fields.length < ADDRESS.length && (
        <Button
          type='button'
          variant='outline'
          className='mt-6 w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
          onClick={() =>
            append({
              label: ADDRESS[fields.length],
              line1: '',
              line2: '',
              city: '',
              region: 'British Columbia',
              postal: '',
              country: 'Canada'
            })
          }
        >
          Add
        </Button>
      )}
    </div>
  )
}
