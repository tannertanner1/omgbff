import { useFieldContext } from "."
import { Errors } from "./errors"
import { Label as LabelComponent } from "@/components/ui/label"
import { Input as InputComponent } from "@/components/ui/input"
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox as CheckboxComponent } from "@/components/ui/checkbox"
import { Textarea as TextareaComponent } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const Label = ({
  children,
  required,
  ...props
}: {
  children: React.ReactNode
  required?: boolean
} & React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <LabelComponent
      {...props}
      className={cn(
        "mb-2 block pt-6",
        required
          ? "after:text-destructive after:ml-0.5 after:content-['*']"
          : "",
        props.className
      )}
    >
      {children}
    </LabelComponent>
  )
}

const Input = ({
  label,
  required,
  type = "text",
  ...props
}: {
  label: string
  required?: boolean
  type?: string
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const field = useFieldContext<string>()

  return (
    <div className="relative">
      <Label htmlFor={field.name}>{label}</Label>
      <InputComponent
        id={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
        className={cn(
          // !field.state.meta.isValid && field.state.meta.isTouched
          (field.state.meta.errorMap.onDynamic ||
            field.state.meta.errorMap.onChange ||
            field.state.meta.errorMap.onBlur ||
            field.state.meta.errorMap.onSubmit ||
            field.state.meta.errors[0]) &&
            field.state.meta.isTouched
            ? "border-destructive [&[data-slot=input]]:focus-visible:border-destructive"
            : "border-input [&[data-slot=input]]:focus-visible:border-input",
          "[&[data-slot=input]]:dark:bg-background [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0",
          props.className
        )}
      />
      <Errors meta={field.state.meta} />
    </div>
  )
}

const Textarea = ({
  label,
  required,
  rows = 1,
  ...props
}: {
  label: string
  required?: boolean
  rows?: number
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const field = useFieldContext<string>()

  return (
    <div className="relative">
      <Label htmlFor={field.name}>{label}</Label>
      <TextareaComponent
        id={field.name}
        rows={rows}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
        className={cn(
          "[&[data-slot=textarea]]:bg-background mb-1",
          // !field.state.meta.isValid && field.state.meta.isTouched
          (field.state.meta.errorMap.onDynamic ||
            field.state.meta.errorMap.onChange ||
            field.state.meta.errorMap.onBlur ||
            field.state.meta.errorMap.onSubmit ||
            field.state.meta.errors[0]) &&
            field.state.meta.isTouched
            ? "border-destructive [&[data-slot=textarea]]:focus-visible:border-destructive"
            : "[&[data-slot=textarea]]:focus-visible:border-input",
          "[&[data-slot=textarea]]:focus-visible:ring-0 [&[data-slot=textarea]]:dark:focus-visible:ring-0",
          "field-sizing-content min-h-0 resize-none overflow-hidden",
          props.className
        )}
      />
      <Errors meta={field.state.meta} />
    </div>
  )
}

const Select = ({
  label,
  options,
  placeholder,
  required,
  disabled,
}: {
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) => {
  const field = useFieldContext<string>()

  return (
    <div className="relative">
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <SelectComponent
        name={field.name}
        value={field.state.value}
        required={required}
        disabled={disabled}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id={field.name}
          onBlur={field.handleBlur}
          className={cn(
            // !field.state.meta.isValid && field.state.meta.isTouched
            (field.state.meta.errorMap.onDynamic ||
              field.state.meta.errorMap.onChange ||
              field.state.meta.errorMap.onBlur ||
              field.state.meta.errorMap.onSubmit ||
              field.state.meta.errors[0]) &&
              field.state.meta.isTouched
              ? "border-destructuve [&[data-slot=select-trigger]]:focus-visible:border-destructuve"
              : "border-input [&[data-slot=select-trigger]]:focus-visible:border-input",
            "[&[data-slot=select-trigger]]:dark:bg-background w-full [&[data-slot=select-trigger]]:rounded-[0.625rem] [&[data-slot=select-trigger]]:focus-visible:ring-0 [&[data-slot=select-trigger]]:dark:focus-visible:ring-0"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="[&[data-slot=select-content]]:dark:bg-background w-full [&[data-slot=select-content]]:rounded-[0.625rem]">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="w-full [&[data-slot=select-item]]:rounded-[0.625rem]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectComponent>
      <Errors meta={field.state.meta} />
    </div>
  )
}

const Checkbox = ({
  label,
  description,
  required,
  disabled,
}: {
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
}) => {
  const field = useFieldContext<boolean>()

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <CheckboxComponent
          id={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked === true)
          }}
          onBlur={field.handleBlur}
          required={required}
          disabled={disabled}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor={field.name} className="cursor-pointer">
            {label}
          </Label>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </div>
      <Errors meta={field.state.meta} />
    </div>
  )
}

export { Input, Textarea, Select, Checkbox }
