import { useFormContext } from "."
import { Button as ButtonComponent } from "@/components/ui/button"
import { IconLoader } from "@tabler/icons-react"

const Button = ({ label }: { label: string }) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <ButtonComponent
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          variant="outline"
          className="[&[data-slot=button]]:border-primary [&[data-slot=button]]:bg-primary [&[data-slot=button]]:text-background [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary max-w-[] mt-4 w-full border transition-colors duration-300 ease-in-out"
        >
          {isSubmitting ? (
            <IconLoader className="h-4 w-4 animate-spin motion-reduce:hidden" />
          ) : (
            label
          )}
        </ButtonComponent>
      )}
    </form.Subscribe>
  )
}

export { Button }
