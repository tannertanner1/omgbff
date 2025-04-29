"use client"

import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CTA } from "@/data/landing-content"
import { Section } from "./section"

function Cta() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Badge
          variant="secondary"
          className="mb-6 -ml-1 flex w-fit px-4 py-1.5 text-sm font-medium shadow-sm @3xl:ml-1"
        >
          {CTA.section}
        </Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-3xl font-semibold tracking-tighter text-pretty @3xl:text-4xl"
      >
        {CTA.title}
      </motion.h2>

      {CTA.description ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          {CTA.description}
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-22"
      >
        <Button
          className="border-primary bg-background text-primary hover:bg-primary hover:text-background border transition-colors duration-300 ease-in-out"
          asChild
        >
          <a href={CTA.button.href} target="_blank" rel="noopener noreferrer">
            {CTA.button.icon && <CTA.button.icon className="h-4 w-4" />}
            {CTA.button.text}
          </a>
        </Button>
      </motion.div>
    </Section>
  )
}

export { Cta }
