import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Input, Mask, Textarea, Select, Checkbox } from "./fields"
import { Button } from "./button"

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { withForm, useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Mask,
    Textarea,
    Select,
    Checkbox,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
})
