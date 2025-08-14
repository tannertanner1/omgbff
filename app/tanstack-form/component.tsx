"use client"

import { useActionState } from "react"
import { initialFormState } from "@tanstack/react-form/nextjs"
import {
  mergeForm,
  useTransform,
  // revalidateLogic
} from "@tanstack/react-form"
import { useAppForm } from "@/components/tanstack-form"
import { createAction } from "./actions"
import { data, schema } from "./form"

function Component() {
  const [state, action] = useActionState(createAction, initialFormState)

  const form = useAppForm({
    ...data,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),

    validators: {
      onSubmit: schema,
    },
    // validationLogic: revalidateLogic({
    //   mode: "submit",
    //   modeAfterSubmission: "change",
    // }),
    onSubmit: async ({ value }) => {
      console.log("Client validation", value)
    },
  })

  return (
    <div className="mx-auto mt-10 max-w-5xl px-8">
      <form
        noValidate
        className="space-y-4"
        action={action}
        // onSubmit={() => {
        //   form.handleSubmit()
        // }}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField
          name="name"
          children={(field) => (
            <>
              <field.Input label="Name" />
            </>
          )}
        />
        <form.AppField
          name="email"
          children={(field) => (
            <>
              <field.Input label="Email" type="email" />
            </>
          )}
        />
        <form.AppForm>
          <form.Button label="Submit" />
        </form.AppForm>

        {/* <pre>{JSON.stringify(form.state, null, 2)}</pre> */}
      </form>
    </div>
  )
}

export { Component }
