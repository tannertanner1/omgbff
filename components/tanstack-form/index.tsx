import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Input, Select, Checkbox } from "./fields"
import { Errors } from "./errors"
import { Button } from "./button"

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Select,
    Checkbox,
  },
  formComponents: {
    Errors,
    Button,
  },
  fieldContext,
  formContext,
})
