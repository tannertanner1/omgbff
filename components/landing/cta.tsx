"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "./section"
import { CTA } from "@/data/landing-content"
import { cn } from "@/lib/utils"

function Cta() {
  const Icon = CTA.button.icon

  return (
    <Section>
      <Badge
        variant="secondary"
        className={cn(
          "mb-8 flex w-fit",
          "px-4 py-1.5 text-sm font-medium shadow-sm"
        )}
      >
        <span className="cursor-pointer select-none">{CTA.section}</span>
      </Badge>

      <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
        {CTA.title}
      </h2>
      {CTA.description ? (
        <p className="text-muted-foreground mb-8 text-lg">{CTA.description}</p>
      ) : (
        <div className="mb-8" />
      )}

      <Button
        variant="outline"
        className="border-primary mb-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
        asChild
      >
        <a href={CTA.button.href} target="_blank" rel="noopener noreferrer">
          {Icon && <Icon className="h-4 w-4" />}
          {CTA.button.text}
        </a>
      </Button>
    </Section>
  )
}

export { Cta }
