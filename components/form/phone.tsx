'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PHONE } from '@/data/customer-fields'
import { Section } from './section'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'
import type { FieldErrors } from '@/types/forms'

export function Phone({
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
        Phone
      </Label>
      {controlledFields.map((field, index) => {
        const error = fieldErrors?.[index] as FieldErrors | undefined
        const hasErrors = !!error

        return (
          <Section
            key={field.fieldId}
            title={`${field.label || PHONE[index] || 'Phone'}`}
            summary={field.number || ''}
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
                    {PHONE.filter(
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
                  Number
                </Label>
                <IMaskInput
                  {...register(`${name}.${index}.number`)}
                  mask='(000) 000-0000'
                  definitions={{
                    '0': /[0-9]/
                  }}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                    error?.number ? 'border-[#DB4437]' : ''
                  )}
                  value={field.number || ''}
                  onAccept={value => {
                    setValue(`${name}.${index}.number`, value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                />
                {error?.number && (
                  <p className='absolute mt-1 text-sm text-[#DB4437]'>
                    {!field.number ? 'Required' : 'Invalid'}
                  </p>
                )}
              </div>
            </div>
          </Section>
        )
      })}

      {fields.length < PHONE.length && (
        <Button
          type='button'
          variant='outline'
          className='mt-6 w-full max-w-[338px] border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
          onClick={() =>
            append({
              label: PHONE[fields.length],
              number: ''
            })
          }
        >
          Add
        </Button>
      )}
    </div>
  )
}
