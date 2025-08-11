import { useFormContext } from "."
import { Button as ButtonComponent } from "@/components/ui/button"
import { IconCircleCheck, IconCircleX, IconLoader } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const Button = ({ label }: { label: string }) => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [
        state.isSubmitting,
        state.isSubmitted,
        state.isSubmitSuccessful,
      ]}
    >
      {([isSubmitting, isSubmitted, isSubmitSuccessful]) => (
        <>
          <ButtonComponent
            type="submit"
            variant="outline"
            className="[&[data-slot=button]]:border-primary [&[data-slot=button]]:bg-primary [&[data-slot=button]]:text-background [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary max-w-[] mt-4 w-full border transition-colors duration-300 ease-in-out"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <IconLoader className="h-4 w-4 animate-spin motion-reduce:hidden" />
            ) : (
              label
            )}
          </ButtonComponent>
          {(isSubmitted || isSubmitSuccessful) && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {isSubmitSuccessful ? (
                <IconCircleCheck className="h-5 w-5 text-[#0F9D58]" />
              ) : (
                <IconCircleX className="text-destructive h-5 w-5" />
              )}
              <span
                className={cn(
                  "text-sm",
                  isSubmitSuccessful ? "text-[#0F9D58]" : "text-destructive"
                )}
              >
                {isSubmitSuccessful ? "Success" : "Error"}
              </span>
            </div>
          )}
        </>
      )}
    </form.Subscribe>
  )
}

export { Button }
