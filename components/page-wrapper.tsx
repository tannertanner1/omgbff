"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

function PageWrapper({
  children,
  inner,
  outer,
  gap = 16,
  radius = 24,
  ...props
}: React.ComponentProps<typeof Card> & {
  inner?: string
  outer?: string
  gap?: number
  radius?: number
  children?: React.ReactNode
}) {
  // Calculate inner radius by subtracting gap from outer radius
  const innerRadius = Math.max(0, radius - gap)

  return (
    <div className={cn("w-full", { ...props })}>
      <Card
        data-slot="outer-card"
        className={cn(
          `rounded-[${radius}px] overflow-hidden`,
          "inset-ring-1 inset-ring-zinc-700/50",
          "inset-shadow-sm inset-shadow-zinc-950/50",
          "bg-zinc-800",
          outer
        )}
      >
        <div className={`p-${gap / 4}`}>
          <Card
            data-slot="inner-card"
            className={cn(
              `rounded-[${innerRadius}px] overflow-hidden`,
              "inset-ring-1 inset-ring-zinc-400/20",
              "inset-shadow-sm inset-shadow-zinc-950/30",
              "bg-zinc-100",
              { inner }
            )}
          >
            {children}
          </Card>
        </div>
      </Card>
    </div>
  )
}

export { PageWrapper }
