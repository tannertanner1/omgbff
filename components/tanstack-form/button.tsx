import { useStore } from "@tanstack/react-form"
import { useFormContext } from "."
import { Button as ButtonComponent } from "@/components/ui/button"

const Button = ({ children }: { children: React.ReactNode }) => {
  const form = useFormContext()

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ])

  return (
    <ButtonComponent type="submit" disabled={isSubmitting || !canSubmit}>
      {children}
    </ButtonComponent>
  )
}

export { Button }
