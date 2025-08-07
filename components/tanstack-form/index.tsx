import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Input, Select, Checkbox } from "./fields"
import { Button } from "./button"

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    Input,
    Select,
    Checkbox,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
})
