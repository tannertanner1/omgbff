import { useFormContext } from "."
import { Button as ButtonComponent } from "@/components/ui/button"

const Button = ({ label }: { label: string }) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <ButtonComponent type="submit" disabled={isSubmitting}>
          {label}
        </ButtonComponent>
      )}
    </form.Subscribe>
  )
}

export { Button }
