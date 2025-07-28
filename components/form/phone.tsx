"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { IMaskInput } from "react-imask"
import type { FieldErrors } from "@/types/forms"
import { PHONE } from "@/data/customer-fields"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Section } from "./section"

export function Phone({
  name,
  required,
}: {
  name: string
  required?: boolean
}) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: "fieldId",
  })

  const watchFieldArray = watch(name)
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const fieldErrors = errors[name] as FieldErrors | undefined
  const usedLabels = controlledFields.map((field) => field.label)

  return (
    <div className="w-[21.5rem] overflow-visible pt-6">
      <Label
        className={cn(
          "mb-2 block",
          required
            ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
            : ""
        )}
      >
        Phone
      </Label>
      <div className="space-y-4 overflow-visible pr-1 pb-1">
        {controlledFields.map((field, index) => {
          const error = fieldErrors?.[index] as FieldErrors | undefined
          const hasErrors =
            error &&
            typeof error === "object" &&
            Object.keys(error).some((key) => error[key])

          return (
            <Section
              key={field.fieldId}
              title={`${field.label || PHONE[index] || "Phone"}`}
              summary={field.number || ""}
              onRemove={index > 0 ? () => remove(index) : undefined}
              error={
                hasErrors
                  ? {
                      type: "validation",
                      message: "Required",
                    }
                  : undefined
              }
              defaultOpen={hasErrors}
            >
              <div className="space-y-6 overflow-visible pr-1 pb-1">
                <div className="relative">
                  <Label
                    className={cn(
                      "mb-2 block pt-6",
                      required
                        ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                        : ""
                    )}
                  >
                    Label
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue(`${name}.${index}.label`, value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                    value={field.label || ""}
                  >
                    <SelectTrigger className="border-input [&[data-slot=select-trigger]]:focus-visible:border-input [&[data-slot=select-trigger]]:dark:bg-background w-full [&[data-slot=select-trigger]]:rounded-[0.625rem] [&[data-slot=select-trigger]]:focus-visible:ring-0 [&[data-slot=select-trigger]]:dark:focus-visible:ring-0">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent className="[&[data-slot=select-content]]:dark:bg-background w-full [&[data-slot=select-content]]:rounded-[0.625rem]">
                      {PHONE.filter(
                        (label) =>
                          !usedLabels.includes(label) || field.label === label
                      ).map((label) => (
                        <SelectItem
                          key={label}
                          value={label}
                          className="w-full [&[data-slot=select-item]]:rounded-[0.625rem]"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Label
                    className={cn(
                      "mb-2 block pt-6",
                      required
                        ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                        : ""
                    )}
                  >
                    Number
                  </Label>
                  <IMaskInput
                    {...register(`${name}.${index}.number`)}
                    mask="(000) 000-0000"
                    definitions={{
                      "0": /[0-9]/,
                    }}
                    data-slot="input"
                    className={cn(
                      "placeholder:text-muted-foreground flex h-9 w-full rounded-[0.625rem] border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                      error?.number
                        ? "border-[#DB4437] [&[data-slot=input]]:focus-visible:border-[#DB4437]"
                        : "border-input [&[data-slot=input]]:focus-visible:border-input",
                      "[&[data-slot=input]]:dark:bg-background [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0"
                    )}
                    value={field.number || ""}
                    onAccept={(value) => {
                      setValue(`${name}.${index}.number`, value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />
                  {error?.number && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      {!field.number ? "Required" : "Invalid"}
                    </p>
                  )}
                </div>
              </div>
            </Section>
          )
        })}
      </div>

      {fields.length < PHONE.length && (
        <Button
          type="button"
          variant="outline"
          className={cn(
            "[&[data-slot=button]]:border-muted [&[data-slot=button]]:hover:border-primary [&[data-slot=button]]:bg-muted [&[data-slot=button]]:text-primary [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary mt-8 border transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-[21rem]"
          )}
          onClick={() =>
            append({
              label: PHONE[fields.length],
              number: "",
            })
          }
        >
          Add
        </Button>
      )}
    </div>
  )
}
