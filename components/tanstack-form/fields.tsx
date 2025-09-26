import React, { useCallback, useState, useMemo } from "react"
import { DndContext, useDroppable } from "@dnd-kit/core"
import { IMaskInput } from "react-imask"
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox as CheckboxComponent } from "@/components/ui/checkbox"
import { Input as InputComponent } from "@/components/ui/input"
import { Label as LabelComponent } from "@/components/ui/label"
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea as TextareaComponent } from "@/components/ui/textarea"
import { useFieldContext } from "."
import { Errors } from "./errors"

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
        "mb-2 block pt-8", // [.flex_&]:mb-0 [.flex_&]:pt-0
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
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <InputComponent
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
        className={cn(
          field.state.meta.errors.length > 0 && field.state.meta.isTouched
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

const Mask = ({
  label,
  required,
  mask,
  definitions,
  prepare,
  ...props
}: {
  label: string
  required?: boolean
  mask: string
  definitions?: Record<string, RegExp>
  prepare?: (str: string) => string
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur"
>) => {
  const field = useFieldContext<string>()

  return (
    <div className="relative">
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <IMaskInput
        id={field.name}
        name={field.name}
        lazy={true}
        mask={mask}
        definitions={definitions}
        prepare={prepare}
        defaultValue={field.state.value}
        onAccept={(value: any) => field.handleChange(String(value))}
        onBlur={field.handleBlur}
        data-slot="input"
        {...(props as any)}
        className={cn(
          "placeholder:text-muted-foreground flex h-9 w-full rounded-[0.625rem] border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          field.state.meta.errors.length > 0 && field.state.meta.isTouched
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
  ...props
}: {
  label: string
  required?: boolean
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const field = useFieldContext<string>()

  return (
    <div className="relative">
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <div className="grow-wrap">
        <TextareaComponent
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            const wrapper = target.parentElement
            if (wrapper) {
              wrapper.setAttribute("data-replicated-value", target.value)
            }
          }}
          {...props}
          className={cn(
            field.state.meta.errors.length > 0 && field.state.meta.isTouched
              ? "border-destructive [&[data-slot=textarea]]:focus-visible:border-destructive"
              : "[&[data-slot=textarea]]:focus-visible:border-input",
            "[&[data-slot=textarea]]:bg-background [&[data-slot=textarea]]:focus-visible:ring-0 [&[data-slot=textarea]]:dark:focus-visible:ring-0",
            props.className
          )}
        />
      </div>
      <Errors meta={field.state.meta} />
    </div>
  )
}

const Select = ({
  label,
  required,
  options,
  disabled,
  placeholder,
}: {
  label: string
  required?: boolean
  options: ReadonlyArray<{ value: string; label: string } | string>
  disabled?: boolean
  placeholder?: string
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
        disabled={disabled}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id={field.name}
          onBlur={field.handleBlur}
          className={cn(
            field.state.meta.errors.length > 0 && field.state.meta.isTouched
              ? "border-destructive [&[data-slot=select-trigger]]:focus-visible:border-destructive"
              : "border-input [&[data-slot=select-trigger]]:focus-visible:border-input",
            "[&[data-slot=select-trigger]]:dark:bg-background w-full [&[data-slot=select-trigger]]:rounded-[0.625rem] [&[data-slot=select-trigger]]:text-base [&[data-slot=select-trigger]]:focus-visible:ring-0 [&[data-slot=select-trigger]]:md:text-sm [&[data-slot=select-trigger]]:dark:focus-visible:ring-0"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="[&[data-slot=select-content]]:dark:bg-background w-full [&[data-slot=select-content]]:rounded-[0.625rem]">
          {options
            .map((option) =>
              typeof option === "string"
                ? { value: option, label: option }
                : option
            )
            .map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="w-full [&[data-slot=select-item]]:rounded-[0.625rem] [&[data-slot=select-item]]:text-base [&[data-slot=select-item]]:md:text-sm"
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
  required,
  description,
  disabled,
}: {
  label: string
  required?: boolean
  description?: string
  disabled?: boolean
}) => {
  const field = useFieldContext<boolean>()

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <CheckboxComponent
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked === true)
          }}
          onBlur={field.handleBlur}
          disabled={disabled}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={field.name}
            required={required}
            className="cursor-pointer"
          >
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

const Files = ({
  label,
  required,
  accept = "",
  placeholder,
  className,
  ...props
}: {
  label: string
  required?: boolean
  accept?: string
  placeholder?: string
  className?: string
}) => {
  const field = useFieldContext<File[]>()
  const [isDragOver, setIsDragOver] = useState(false)

  const files = useMemo(() => field.state.value || [], [field.state.value])

  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return "0B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i)) + sizes[i]
  }, [])

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: "file-dropzone",
  })

  const validateFile = useCallback(
    (file: File): string | null => {
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim())
        const fileType = file.type
        const fileName = file.name.toLowerCase()

        const isAccepted = acceptedTypes.some((acceptedType) => {
          if (acceptedType.startsWith(".")) {
            return fileName.endsWith(acceptedType.toLowerCase())
          }
          if (acceptedType.includes("*")) {
            const baseType = acceptedType.split("/")[0]
            return fileType.startsWith(baseType)
          }
          return fileType === acceptedType
        })

        if (!isAccepted) {
          return `File type not accepted. Accepted types: ${accept}`
        }
      }
      return null
    },
    [accept]
  )

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: File[] = []
      const errors: string[] = []

      Array.from(fileList).forEach((file) => {
        const error = validateFile(file)
        if (!error) {
          newFiles.push(file)
        } else {
          errors.push(error)
        }
      })

      if (newFiles.length > 0) {
        const maxTotalBytes = 10 * 1024 * 1024
        const currentBytes = files.reduce((sum, f) => sum + (f.size || 0), 0)
        const newBytes = newFiles.reduce((sum, f) => sum + (f.size || 0), 0)
        if (currentBytes + newBytes > maxTotalBytes) {
          return
        }
        const updatedFiles = [...files, ...newFiles]
        field.handleChange(updatedFiles)
      }
    },
    [files, field, validateFile]
  )

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    field.handleChange(updatedFiles)
  }

  const handleDragEvent = useCallback(
    (e: React.DragEvent, action: "enter" | "leave" | "over" | "drop") => {
      e.preventDefault()
      e.stopPropagation()

      if (action === "enter" && e.dataTransfer.items?.length > 0) {
        setIsDragOver(true)
      } else if (action === "leave") {
        setIsDragOver(false)
      } else if (action === "drop") {
        setIsDragOver(false)
        if (e.dataTransfer.files?.length > 0) {
          processFiles(e.dataTransfer.files)
        }
      }
    },
    [processFiles]
  )

  const openFileDialog = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept
    input.multiple = true
    input.name = field.name
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        processFiles(target.files)
      }
    }
    input.click()
  }

  // Sync files back to hidden input for form submission
  React.useEffect(() => {
    const existingInput = document.querySelector(
      `input[name="${field.name}"]`
    ) as HTMLInputElement
    if (existingInput && files.length > 0) {
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))
      existingInput.files = dataTransfer.files
    }
  }, [files, field.name])

  // // Preserve files when form resets due to validation errors
  // React.useEffect(() => {
  //   // Only reset files if the form was successfully submitted (not due to validation errors)
  //   if (field.form.state.isSubmitSuccessful && files.length > 0) {
  //     field.handleChange([])
  //   }
  // }, [field.form.state.isSubmitSuccessful, files.length, field])

  return (
    <DndContext>
      <div className={cn("relative", className)}>
        <Label htmlFor={field.name} required={required}>
          {label}
        </Label>

        {/* Hidden input */}
        <input
          type="file"
          name={field.name}
          multiple
          accept={accept}
          className="sr-only"
          onChange={() => {}} // Controlled by component
        />

        {/* Drop zone */}
        <div
          ref={setDroppableRef}
          onDragEnter={(e) => handleDragEvent(e, "enter")}
          onDragLeave={(e) => handleDragEvent(e, "leave")}
          onDragOver={(e) => handleDragEvent(e, "over")}
          onDrop={(e) => handleDragEvent(e, "drop")}
          onClick={openFileDialog}
          className={cn(
            "relative flex min-h-9 cursor-pointer items-center gap-2 rounded-[0.625rem] border bg-transparent px-3 py-0.5 transition-all duration-200",
            "shadow-xs hover:shadow-none active:shadow-none",
            isDragOver && "border-input shadow-none",
            field.state.meta.errors.length > 0 && field.state.meta.isTouched
              ? "border-destructive focus-visible:border-destructive"
              : "border-input focus-visible:border-input",
            "dark:bg-background focus-visible:ring-0 dark:focus-visible:ring-0"
          )}
        >
          {/* File tags inside the dropzone */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {files.map((file, index) => {
                // Safety check for file object
                if (!file || !file.name) {
                  return null
                }

                // Smart truncation: keep extension, truncate middle
                const lastDotIndex = file.name.lastIndexOf(".")
                const hasExtension = lastDotIndex !== -1
                const name = hasExtension
                  ? file.name.substring(0, lastDotIndex)
                  : file.name
                const extension = hasExtension
                  ? file.name.substring(lastDotIndex)
                  : ""

                const maxTotalLength = 20
                let displayName = file.name

                if (file.name.length > maxTotalLength && hasExtension) {
                  const availableForName = maxTotalLength - extension.length - 3 // 3 for "..."
                  if (name.length > availableForName) {
                    const keepFromStart = Math.floor(availableForName / 2)
                    const keepFromEnd = availableForName - keepFromStart
                    displayName =
                      name.substring(0, keepFromStart) +
                      "..." +
                      name.substring(name.length - keepFromEnd) +
                      extension
                  }
                } else if (file.name.length > maxTotalLength) {
                  displayName =
                    file.name.substring(0, maxTotalLength - 3) + "..."
                }

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="bg-input/50 inline-flex cursor-pointer items-center gap-1.5 rounded-[0.625rem] px-2 py-0.25 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <span className="pl-0.5 text-base font-medium md:text-sm">
                      {displayName}
                    </span>
                    <span className="text-foreground/70 mt-0.5 text-sm md:text-xs">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Placeholder text when no files */}
          {files.length === 0 && placeholder && (
            <span className="text-muted-foreground text-sm">
              {isDragOver ? "Drop files here" : placeholder}
            </span>
          )}
        </div>

        <Errors meta={field.state.meta} />
      </div>
    </DndContext>
  )
}

export { Input, Mask, Textarea, Select, Checkbox, Files }
