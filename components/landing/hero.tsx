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
import { Separator } from "@/components/ui/separator"

function Hero() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge
          variant="secondary"
          className={cn(
            "mb-8 flex w-fit items-center",
            "px-4 py-1.5 text-sm font-medium shadow-sm",
            "cursor-not-allowed"
          )}
          aria-disabled="true"
        >
          <span
            className="text-muted-foreground flex items-center justify-center"
            style={{ transform: "scale(1.1)" }}
          >
            <IconSparkles className="h-4 w-4" />
          </span>
          <Separator
            orientation="vertical"
            className={cn(
              "mx-2 rounded-full data-[orientation=vertical]:h-4",
              // "inset-shadow inset-shadow-sm dark:inset-ring"
              // "bg-current/30"
              "inset-shadow-muted-foreground/50 inset-shadow-sm"
            )}
          />
          {HERO.section}
          <span
            className="text-muted-foreground ml-1 flex items-center justify-center"
            style={{ transform: "scale(1.1)" }}
          >
            <IconArrowRight className="h-4 w-4" />
          </span>
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl"
      >
        {HERO.title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground mb-8 max-w-[42rem] text-lg leading-normal text-balance sm:leading-8 md:text-xl"
      >
        {HERO.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12 flex flex-wrap gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button size="lg" variant="default" asChild>
            <Link href={HERO.link}>{HERO.button}</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mx-auto w-full max-w-4xl"
      >
        <Card
          className={cn(
            "aspect-video object-cover",
            "flex w-full max-w-4xl flex-col gap-4 px-0",
            "inset-ring-border dark:bg-input/30 bg-transparent inset-ring-1",
            "dark:inset-ring-background dark:border-border border-background"
          )}
        >
          <CardContent className="p-0">
            <div className="relative h-[300px] w-full md:h-[400px]" />
          </CardContent>
        </Card>
      </motion.div>
    </Section>
  )
}

export { Hero }
