import { useFieldContext, useFormContext } from "."
import { Errors } from "./errors"
import { Label } from "@/components/ui/label"
import { Input as InputComponent } from "@/components/ui/input"
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox as CheckboxComponent } from "@/components/ui/checkbox"

const Input = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => {
  const field = useFieldContext<string>()

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={field.name}>{label}</Label>
        <InputComponent
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...props}
        />
      </div>
      <Errors meta={field.state.meta} />
    </div>
  )
}

type Option = { value: string; label: string }
const Select = ({
  label,
  options,
  placeholder,
}: {
  label: string
  options: Option[]
  placeholder?: string
}) => {
  const field = useFieldContext<string>()

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={field.name}>{label}</Label>
        <SelectComponent
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
        >
          <SelectTrigger id={field.name} onBlur={field.handleBlur}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectComponent>
      </div>
      <Errors meta={field.state.meta} />
    </div>
  )
}

const Checkbox = ({
  label,
  description,
}: {
  label: string
  description?: string
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

export { Input, Select, Checkbox }
