import { AnyFieldMeta } from "@tanstack/react-form"
import { useFormContext } from "."

const Errors = ({ meta }: { meta: AnyFieldMeta }) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.submissionAttempts}>
      {(submissionAttempts) => {
        // Progressive disclosure
        const showOnSubmitErrors = submissionAttempts === 0
        const showOnChangeErrors = submissionAttempts > 0

        return (
          <>
            {showOnSubmitErrors && meta.errorMap.onSubmit && (
              <p className="text-destructive text-sm font-medium">
                {meta.errorMap.onSubmit}
              </p>
            )}
            {showOnChangeErrors && meta.errorMap.onChange && (
              <p className="text-destructive text-sm font-medium">
                {meta.errorMap.onChange}
              </p>
            )}
          </>
        )
      }}
    </form.Subscribe>
  )
}

export { Errors }
