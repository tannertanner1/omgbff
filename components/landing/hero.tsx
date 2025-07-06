"use client"

import Link from "next/link"
import { IconArrowRight, IconSparkles } from "@tabler/icons-react"
import { motion } from "motion/react"
import { HERO } from "@/data/landing-content"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Section } from "./section"

function Hero() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href={HERO.changelog}>
          <Badge
            variant="outline"
            className="mb-6 -ml-1 flex w-fit items-center px-4 py-1.5 text-sm font-medium shadow-sm @3xl:ml-1"
            aria-disabled="true"
          >
            {/* <span
              className="text-muted-foreground flex items-center justify-center"
              style={{ transform: "scale(1.1)" }}
            >
              <IconSparkles className="h-4 w-4" />
            </span>
            <Separator
              orientation="vertical"
              className="inset-shadow-muted-foreground/50 mx-2 rounded-full inset-shadow-sm data-[orientation=vertical]:h-4"
            /> */}
            {HERO.section}
            {/* <span
              className="text-muted-foreground ml-1 flex items-center justify-center"
              style={{ transform: "scale(1.1)" }}
            >
              <IconArrowRight className="h-4 w-4" />
            </span> */}
          </Badge>
        </Link>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-4xl font-bold tracking-tight text-balance @3xl:text-5xl"
      >
        {HERO.title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground mb-8 max-w-[42rem] text-lg leading-8 text-balance @3xl:text-xl @3xl:leading-normal"
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
          <Button
            size="lg"
            className="border-primary bg-primary text-background hover:bg-background hover:text-primary border transition-colors duration-300 ease-in-out"
            asChild
          >
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
            <div className="relative h-[300px] w-full @3xl:h-[400px]" />
          </CardContent>
        </Card>
      </motion.div>
    </Section>
  )
}

export { Hero }
