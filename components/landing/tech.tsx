"use client"

import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Section } from "./section"
import { TECH } from "@/data/landing-content"

function Tech() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Badge
          variant="outline"
          className={cn(
            "mb-8 flex w-fit",
            "px-4 py-1.5 text-sm font-medium shadow-sm"
          )}
        >
          {TECH.section}
        </Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-3xl font-semibold tracking-tighter text-balance md:text-4xl"
      >
        {TECH.title}
      </motion.h2>
      {TECH.description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          {TECH.description}
        </motion.p>
      )}

      <div className="w-full max-w-4xl px-0">
        <div className="@container">
          <div className="grid grid-cols-3 justify-items-start gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-6 @md:justify-items-center">
            {TECH.items.map((tech, index) => (
              <motion.a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
              >
                <div className="relative flex h-16 w-16 items-center justify-center md:h-20 md:w-20">
                  <tech.icon className="text-primary group-hover:text-primary perspective-1000 h-12 w-12 transform-gpu transition-all duration-300 text-shadow-lg group-hover:drop-shadow-sm hover:-translate-y-1 hover:scale-105 hover:rotate-2 md:h-16 md:w-16" />
                </div>
                <span className="text-foreground/80 group-hover:text-primary text-center font-mono text-xs transition-colors duration-300 md:text-sm">
                  {tech.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

export { Tech }

/**

k so,

1. i don't think i'm using `@container` query properly in `components/landing/tech` according to the new tailwind v4 docs;

  - https://tailwindcss.com/docs/responsive-design#container-size-reference
  - https://tailwindcss.com/blog/tailwindcss-v4#container-queries



*/
