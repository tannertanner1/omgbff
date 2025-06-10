"use client"

import { motion } from "motion/react"
import { TECH } from "@/data/landing-content"
import { Badge } from "@/components/ui/badge"
import { Section } from "./section"

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
          variant="secondary"
          className="mb-6 -ml-1 flex w-fit px-4 py-1.5 text-sm font-medium shadow-sm @3xl:ml-1"
        >
          {TECH.section}
        </Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-3xl font-semibold tracking-tighter text-balance @3xl:text-4xl"
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

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-3 gap-6 @3xl:grid-cols-4 @3xl:gap-8">
          {TECH.items.map((tech, index) => (
            <motion.a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-2 @3xl:items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
            >
              <div className="relative flex h-16 w-16 items-start justify-start @3xl:h-20 @3xl:w-20 @3xl:items-center @3xl:justify-center">
                <tech.icon className="text-primary group-hover:text-primary perspective-1000 h-12 w-12 transform-gpu transition-all duration-300 text-shadow-lg group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-2 group-hover:drop-shadow-sm @3xl:h-16 @3xl:w-16" />
              </div>
              <span className="text-muted-foreground group-hover:text-primary text-left font-mono text-xs transition-colors duration-300 @3xl:text-center @3xl:text-sm">
                {tech.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  )
}

export { Tech }
