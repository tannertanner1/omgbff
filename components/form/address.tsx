"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { IMaskInput } from "react-imask"
import type { FieldErrors } from "@/types/forms"
import { ADDRESS, COUNTRY, PROVINCE, STATE } from "@/data/customer-fields"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Section } from "./section"

export function Address({
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
        Address
      </Label>
      <div className="space-y-4 overflow-visible pr-1 pb-1">
        {controlledFields.map((field, index) => {
          const error = fieldErrors?.[index] as FieldErrors | undefined
          const hasErrors = !!error
          const selectedCountry = watch(`${name}.${index}.country`) || "Canada"
          const regionOptions = selectedCountry === "Canada" ? PROVINCE : STATE

          return (
            <Section
              key={field.fieldId}
              title={`${field.label || ADDRESS[index] || "Address"}`}
              summary={cn(
                "",
                field.line1
                  ? field.line2
                    ? `${field.line1}, ${field.line2}`
                    : field.line1
                  : ""
              )}
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
                    <SelectTrigger
                      className={cn(
                        error?.label
                          ? "border-[#DB4437] [&[data-slot=select-trigger]]:focus-visible:border-[#DB4437]"
                          : "border-input [&[data-slot=select-trigger]]:focus-visible:border-input",
                        "[&[data-slot=select-trigger]]:dark:bg-background w-full [&[data-slot=select-trigger]]:rounded-[0.625rem] [&[data-slot=select-trigger]]:focus-visible:ring-0 [&[data-slot=select-trigger]]:dark:focus-visible:ring-0"
                      )}
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent className="[&[data-slot=select-content]]:dark:bg-background w-full [&[data-slot=select-content]]:rounded-[0.625rem]">
                      {ADDRESS.filter(
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
                  {error?.label && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      Required
                    </p>
                  )}
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
                    Street line 1
                  </Label>
                  <Input
                    {...register(`${name}.${index}.line1`)}
                    className={cn(
                      error?.line1
                        ? "border-[#DB4437] [&[data-slot=input]]:focus-visible:border-[#DB4437]"
                        : "border-input [&[data-slot=input]]:focus-visible:border-input",
                      "[&[data-slot=input]]:dark:bg-background [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0"
                    )}
                  />
                  {error?.line1 && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      Required
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Label className="mb-2 block pt-6">Street line 2</Label>
                  <Input
                    {...register(`${name}.${index}.line2`)}
                    className={cn(
                      error?.line2
                        ? "border-[#DB4437] [&[data-slot=input]]:focus-visible:border-[#DB4437]"
                        : "border-input [&[data-slot=input]]:focus-visible:border-input",
                      "[&[data-slot=input]]:dark:bg-background [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0"
                    )}
                  />
                  {error?.line2 && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      Required
                    </p>
                  )}
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
                    City
                  </Label>
                  <Input
                    {...register(`${name}.${index}.city`)}
                    className={cn(
                      error?.city
                        ? "border-[#DB4437] [&[data-slot=input]]:focus-visible:border-[#DB4437]"
                        : "border-input [&[data-slot=input]]:focus-visible:border-input",
                      "[&[data-slot=input]]:dark:bg-background [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0"
                    )}
                  />
                  {error?.city && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      Required
                    </p>
                  )}
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
                    {selectedCountry === "Canada" ? "Province" : "State"}
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue(`${name}.${index}.region`, value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                    value={
                      field.region ||
                      (selectedCountry === "Canada"
                        ? "British Columbia"
                        : "California")
                    }
                  >
                    <SelectTrigger className="border-input [&[data-slot=select-trigger]]:focus-visible:border-input [&[data-slot=select-trigger]]:dark:bg-background w-full [&[data-slot=select-trigger]]:rounded-[0.625rem] [&[data-slot=select-trigger]]:focus-visible:ring-0 [&[data-slot=select-trigger]]:dark:focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="[&[data-slot=select-content]]:dark:bg-background w-full [&[data-slot=select-content]]:rounded-[0.625rem]">
                      {regionOptions.map((region) => (
                        <SelectItem
                          key={region}
                          value={region}
                          className="w-full [&[data-slot=select-item]]:rounded-[0.625rem]"
                        >
                          {region}
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
                    {selectedCountry === "Canada" ? "Postal code" : "ZIP code"}
                  </Label>
                  <IMaskInput
                    {...register(`${name}.${index}.postal`)}
                    mask={
                      selectedCountry === "Canada" ? "a9a 9a9" : "99999-9999"
                    }
                    definitions={{
                      a: /[A-Za-z]/,
                      "9": /[0-9]/,
                    }}
                    data-slot="input"
                    className={cn(
                      "placeholder:text-muted-foreground flex h-9 w-full rounded-[0.625rem] border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                      error?.postal
                        ? "border-[#DB4437] [&[data-slot=input]]:focus-visible:border-[#DB4437]"
                        : "border-input [&[data-slot=input]]:focus-visible:border-input",
                      "[&[data-slot=input]]:dark:bg-background [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0"
                    )}
                    value={field.postal || ""}
                    onAccept={(value) => {
                      setValue(`${name}.${index}.postal`, value.toUpperCase(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />
                  {error?.postal && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      Required
                    </p>
                  )}
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
                    Country
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue(`${name}.${index}.country`, value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                      setValue(
                        `${name}.${index}.region`,
                        value === "Canada" ? "British Columbia" : "California",
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        }
                      )
                    }}
                    value={field.country || "Canada"}
                  >
                    <SelectTrigger
                      className={cn(
                        error?.country
                          ? "border-[#DB4437] [&[data-slot=select-trigger]]:focus-visible:border-[#DB4437]"
                          : "border-input [&[data-slot=select-trigger]]:focus-visible:border-input",
                        "[&[data-slot=select-trigger]]:dark:bg-background w-full [&[data-slot=select-trigger]]:rounded-[0.625rem] [&[data-slot=select-trigger]]:focus-visible:ring-0 [&[data-slot=select-trigger]]:dark:focus-visible:ring-0"
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="[&[data-slot=select-content]]:dark:bg-background w-full [&[data-slot=select-content]]:rounded-[0.625rem]">
                      {COUNTRY.map((country) => (
                        <SelectItem
                          key={country}
                          value={country}
                          className="w-full [&[data-slot=select-item]]:rounded-[0.625rem]"
                        >
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error?.country && (
                    <p className="absolute mt-1 text-sm text-[#DB4437]">
                      Required
                    </p>
                  )}
                </div>
              </div>
            </Section>
          )
        })}
      </div>

      {fields.length < ADDRESS.length && (
        <Button
          type="button"
          variant="outline"
          className="[&[data-slot=button]]:border-muted [&[data-slot=button]]:hover:border-primary [&[data-slot=button]]:bg-muted [&[data-slot=button]]:text-primary [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary mt-8 border transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-[21rem]"
          onClick={() =>
            append({
              label: ADDRESS[fields.length],
              line1: "",
              line2: "",
              city: "",
              region: "British Columbia",
              postal: "",
              country: "Canada",
            })
          }
        >
          Add
        </Button>
      )}
    </div>
  )
}
