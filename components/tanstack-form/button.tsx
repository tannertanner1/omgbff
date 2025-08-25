import { useFormContext } from "."
import { Button as ButtonComponent } from "@/components/ui/button"
import { IconLoader } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const Button = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <ButtonComponent
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          variant="outline"
          {...props}
          className={cn(
            "[&[data-slot=button]]:border-primary [&[data-slot=button]]:bg-primary [&[data-slot=button]]:text-background [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary w-full border transition-colors duration-300 ease-in-out",
            props.className
          )}
        >
          {isSubmitting ? (
            <IconLoader className="h-4 w-4 animate-spin motion-reduce:hidden" />
          ) : (
            children
          )}
        </ButtonComponent>
      )}
    </form.Subscribe>
  )
}

export { Button }
