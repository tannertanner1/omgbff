"use client"

import * as React from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconLoader, IconCircleCheck, IconCircleX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Currency } from "./currency"
import { Address } from "./address"
import { Phone } from "./phone"
import { ADDRESS, PHONE } from "@/data/customer-fields"

export type Field = {
  name: string
  label?: string
  type?:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "hidden"
    | "select"
    | "currency"
    | "address"
    | "phone"
  required?: boolean
  defaultValue?: any
  min?: number
  step?: string
  options?: Array<{ label: string; value: string }>
  disabled?: boolean
}

export function Form({
  fields,
  action,
  button = "Submit",
  data = {},
  title,
}: {
  fields: Field[]
  action: (prevState: any, formData: FormData) => Promise<any>
  button?: string
  data?: Record<string, any>
  title?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const initialState = {
    success: false,
    message: "",
    errors: {},
    inputs: data,
    redirect: null,
  }

  const [state, formAction] = useActionState(action, initialState)

  // Create a dynamic Zod schema based on the fields
  const schema = z.object(
    fields.reduce((acc, field) => {
      if (field.type === "address") {
        acc[field.name] = z
          .array(
            z.object({
              label: z.string().min(1, "Required"),
              line1: z.string().min(1, "Required"),
              line2: z.string().optional(),
              city: z.string().min(1, "Required"),
              region: z.string().min(1, "Required"),
              postal: z.string().min(1, "Required"),
              country: z.string().min(1, "Required"),
            })
          )
          .min(1, "Invalid")
      } else if (field.type === "phone") {
        acc[field.name] = z
          .array(
            z.object({
              label: z.string().min(1, "Required"),
              number: z.string().min(10, "Invalid"),
            })
          )
          .min(1, "Invalid")
      } else {
        acc[field.name] = field.required
          ? z.string().min(1, "Required")
          : z.string().optional()
      }
      return acc
    }, {} as any)
  )

  // Initialize form with proper defaultValues
  const defaultValues = React.useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        if (field.type === "address") {
          acc[field.name] = field.defaultValue || [
            {
              label: ADDRESS[0],
              line1: "",
              line2: "",
              city: "",
              region: "British Columbia",
              postal: "",
              country: "Canada",
            },
          ]
        } else if (field.type === "phone") {
          acc[field.name] = field.defaultValue || [
            {
              label: PHONE[0],
              number: "",
            },
          ]
        } else {
          acc[field.name] = field.defaultValue || ""
        }
        return acc
      },
      {} as Record<string, any>
    )
  }, [fields])

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // Reset form with new values when defaultValues change
  React.useEffect(() => {
    methods.reset(defaultValues)
  }, [methods, defaultValues])

  const onSubmit = (formData: any) => {
    const serverFormData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        serverFormData.append(key, JSON.stringify(value))
      } else {
        serverFormData.append(key, value as string)
      }
    })

    startTransition(() => {
      formAction(serverFormData)
    })
  }

  React.useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect)
    }
  }, [state?.success, state?.redirect, router])

  return (
    <div className="h-fit">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm">
              <Card className="w-full max-w-sm border-0">
                {title && (
                  <CardHeader className="-mt-3 mb-2 text-xl font-semibold">
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                )}

                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                    <CardContent className="-mt-2 flex flex-col">
                      {fields.map((field) => (
                        <div key={field.name} className="relative mb-6">
                          {field.type === "address" ? (
                            <Address
                              name={field.name}
                              required={field.required}
                            />
                          ) : field.type === "phone" ? (
                            <div
                              className={cn(
                                state?.errors?.[field.name]
                                  ? "border-[#DB4437]"
                                  : ""
                              )}
                            >
                              <Phone
                                name={field.name}
                                required={field.required}
                              />
                            </div>
                          ) : (
                            <>
                              {field.type !== "hidden" && field.label && (
                                <Label
                                  htmlFor={field.name}
                                  className={cn(
                                    "mb-2 block pt-6",
                                    field.required
                                      ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                                      : ""
                                  )}
                                >
                                  {field.label}
                                </Label>
                              )}
                              {field.type === "textarea" ? (
                                <Textarea
                                  id={field.name}
                                  {...methods.register(field.name)}
                                  aria-describedby={`${field.name}-error`}
                                  className={cn(
                                    "mb-1",
                                    methods.formState.errors[field.name]
                                      ? "border-[#DB4437]"
                                      : ""
                                  )}
                                  disabled={field.disabled}
                                />
                              ) : field.type === "select" ? (
                                <Select
                                  name={field.name}
                                  defaultValue={field.defaultValue}
                                  required={field.required}
                                  disabled={field.disabled}
                                  onValueChange={(value) => {
                                    methods.setValue(field.name, value, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    })
                                  }}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      methods.formState.errors[field.name]
                                        ? "border-[#DB4437]"
                                        : ""
                                    )}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.type === "currency" ? (
                                <Currency
                                  id={field.name}
                                  {...methods.register(field.name)}
                                  aria-describedby={`${field.name}-error`}
                                  className={cn(
                                    methods.formState.errors[field.name]
                                      ? "border-[#DB4437]"
                                      : ""
                                  )}
                                  disabled={field.disabled}
                                />
                              ) : (
                                <Input
                                  id={field.name}
                                  type={field.type}
                                  min={field.min}
                                  step={field.step}
                                  {...methods.register(field.name)}
                                  aria-describedby={`${field.name}-error`}
                                  className={cn(
                                    methods.formState.errors[field.name]
                                      ? "border-[#DB4437]"
                                      : "",
                                    field.type === "hidden" ? "hidden" : ""
                                  )}
                                  disabled={field.disabled}
                                />
                              )}
                              {methods.formState.errors[field.name] && (
                                <p
                                  id={`${field.name}-error`}
                                  className="absolute mt-1 text-sm text-[#DB4437]"
                                >
                                  {(methods.formState.errors[field.name]
                                    ?.message as string) || "Required"}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button
                        type="submit"
                        variant="outline"
                        className="border-primary bg-background text-primary hover:bg-primary hover:text-background w-full border"
                        disabled={isPending}
                        aria-disabled={isPending}
                      >
                        {isPending ? (
                          <IconLoader className="h-4 w-4 animate-spin motion-reduce:hidden" />
                        ) : (
                          button
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </FormProvider>
              </Card>

              {state?.message && (
                <div className="mx-auto mt-[0.25rem] w-full max-w-sm px-6">
                  <Alert
                    className={cn(
                      "w-full",
                      state.success
                        ? "border-[#0F9D58] text-[#0F9D58]"
                        : "border-[#DB4437] text-[#DB4437]"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {state.success ? (
                        <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0 font-bold text-[#0F9D58]" />
                      ) : (
                        <IconCircleX className="mt-0.5 h-4 w-4 shrink-0 font-bold text-[#DB4437]" />
                      )}
                      <AlertDescription
                        className={cn(
                          "w-full",
                          state.success ? "text-[#0F9D58]" : "text-[#DB4437]"
                        )}
                      >
                        {state.message}
                      </AlertDescription>
                    </div>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
