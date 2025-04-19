"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Section } from "./section"
import { HERO } from "@/data/landing-content"

function Hero() {
  return (
    <Section className="py-12 md:py-24">
      <Badge
        variant="outline"
        className="bg-background text-muted-foreground mb-8 text-sm"
      >
        <span className="cursor-pointer select-none">{HERO.section}</span>
      </Badge>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
        {HERO.title}
      </h1>

      <p className="text-muted-foreground mb-8 max-w-[42rem] text-lg leading-normal text-balance sm:leading-8 md:text-xl">
        {HERO.description}
      </p>

      <div className="mb-12 flex flex-wrap gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button size="lg" variant="outline" className="rounded-full" asChild>
            <Link href={HERO.link}>{HERO.button}</Link>
          </Button>
        </motion.div>
      </div>

      <Card
        className={cn(
          "bg-secondary/50 w-full max-w-4xl overflow-hidden rounded-2xl",
          "inset-ring-2"
          // "inset-shadow-border inset-shadow inset-shadow-2xs"
        )}
      >
        <CardContent className="p-0">
          <div className="relative h-[300px] md:h-[400px]" />
        </CardContent>
      </Card>
    </Section>
  )
}

export { Hero }
