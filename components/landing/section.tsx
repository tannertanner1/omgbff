import type React from "react"
import { cn } from "@/lib/utils"

function Section({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("mx-auto max-w-5xl", className)}>
      <div className="flex flex-col items-start justify-start space-y-8 text-start md:items-center md:justify-center md:text-center">
        {children}
      </div>
    </section>
  )
}

export { Section }
