import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Input, Textarea, Select, Checkbox } from "./fields"
import { Button } from "./button"

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { withForm, useAppForm } = createFormHook({
  fieldComponents: {
    Input,
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
