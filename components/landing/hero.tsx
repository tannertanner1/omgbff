"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconSparkles, IconArrowRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Section } from "./section"
import { HERO } from "@/data/landing-content"

function Hero() {
  return (
    <Section>
      <Badge
        variant="secondary"
        className={cn(
          "mb-8 flex w-fit",
          "px-4 py-1.5 text-sm font-medium shadow-sm"
        )}
      >
        {HERO.section}
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
          <Button size="lg" variant="outline" asChild>
            <Link href={HERO.link}>{HERO.button}</Link>
          </Button>
        </motion.div>
      </div>

      <Card
        className={cn(
          "aspect-video object-cover",
          "flex w-full max-w-4xl flex-col gap-4 px-0",
          "inset-ring-border dark:bg-input/30 bg-transparent inset-ring-1",
          "dark:inset-ring-background dark:border-border border-background"
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
