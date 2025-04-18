"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "./section"
import { CTA } from "@/data/landing-content"

function Cta() {
  const Icon = CTA.button.icon

  return (
    <Section className="py-16 md:py-24">
      <Badge
        variant="outline"
        className="bg-background text-muted-foreground mb-8 text-sm"
      >
        <span className="cursor-pointer select-none">{CTA.section}</span>
      </Badge>

      <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
        {CTA.title}
      </h2>

      {CTA.description && (
        <p className="text-muted-foreground mt-4 max-w-[42rem] text-lg leading-relaxed">
          {CTA.description}
        </p>
      )}

      <Button
        variant="outline"
        className="border-primary mb-12 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
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
