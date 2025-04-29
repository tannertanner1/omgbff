import type React from "react"
import { cn } from "@/lib/utils"

function Section({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className="py-8 @3xl:py-12" {...props}>
      <div
        className={cn(
          "mx-auto max-w-5xl",
          "@container",
          "px-2 @3xl:px-4",
          className
        )}
      >
        <div className="flex flex-col items-start justify-start space-y-8 p-4 text-start @3xl:items-center @3xl:justify-center @3xl:text-center">
          {children}
        </div>
      </div>
    </section>
  )
}

export { Section }
