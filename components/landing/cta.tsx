"use client"

import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "./section"
import { CTA } from "@/data/landing-content"
import { cn } from "@/lib/utils"

function Cta() {
  // const Icon = CTA.button.icon

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
          {CTA.section}
        </Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl"
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
          variant="secondary"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
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

// @note

// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Section } from "./section"
// import { CTA } from "@/data/landing-content"
// import { cn } from "@/lib/utils"

// function Cta() {
//   const Icon = CTA.button.icon

//   return (
//     <Section>
//       <Badge
//         variant="secondary"
//         className={cn(
//           "mb-8 flex w-fit",
//           "px-4 py-1.5 text-sm font-medium shadow-sm"
//         )}
//       >
//         {CTA.section}
//       </Badge>

//       <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
//         {CTA.title}
//       </h2>
//       {CTA.description ? (
//         <p className="text-muted-foreground mb-8 text-lg">{CTA.description}</p>
//       ) : (
//         <div className="mb-8" />
//       )}

//       <Button
//         variant="outline"
//         className="border-primary mb-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
//         asChild
//       >
//         <a href={CTA.button.href} target="_blank" rel="noopener noreferrer">
//           {Icon && <Icon className="h-4 w-4" />}
//           {CTA.button.text}
//         </a>
//       </Button>
//     </Section>
//   )
// }

// export { Cta }
