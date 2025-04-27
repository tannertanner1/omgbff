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
    <section className={cn("py-8 md:py-12")} {...props}>
      <div
        className={cn(
          "mx-auto max-w-5xl",
          // "p-6 sm:p-8",
          className
        )}
      >
        <div className="flex flex-col items-start justify-start space-y-8 p-4 text-start md:items-center md:justify-center md:text-center">
          {children}
        </div>
      </div>
    </section>
  )
}

export { Section }
