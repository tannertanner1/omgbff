"use client"

import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { STEPS } from "@/data/landing-content"
import { Section } from "./section"

function Steps() {
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
          {STEPS.section}
        </Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-3xl font-semibold tracking-tighter text-balance @3xl:text-4xl"
      >
        {STEPS.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground mb-8 text-lg"
      >
        {STEPS.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="px-0"
      >
        <Tabs defaultValue="feature-1">
          <div className="flex flex-col">
            <TabsList className="bg-background mb-4 grid h-auto gap-6 @[900px]:grid-cols-3">
              {STEPS.items.map((item, index) => (
                <TabsTrigger
                  key={`feature-${index + 1}`}
                  value={`feature-${index + 1}`}
                  className={cn(
                    "text-primary flex w-full flex-col items-start justify-start gap-1 rounded-2xl p-4 text-left text-pretty whitespace-normal",
                    "hover:inset-ring-border hover:border-background hover:inset-ring-1",
                    "data-[state=active]:inset-ring-border data-[state=active]:border-background data-[state=active]:inset-ring-1",
                    "dark:inset-ring-background border-background dark:hover:border-border"
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-primary size-8">
                      <item.icon className="text-primary size-8 text-shadow-lg" />
                    </span>
                    <p className="text-primary text-xl font-medium">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-base leading-normal md:block">
                    {item.description}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>

            {STEPS.items.map((item, index) => (
              <TabsContent
                key={`feature-${index + 1}`}
                value={`feature-${index + 1}`}
                className="flex flex-col gap-4 px-0"
              >
                <Card
                  className={cn(
                    "inset-ring-border dark:bg-input/30 bg-transparent inset-ring-1",
                    "dark:inset-ring-background dark:border-border border-background"
                  )}
                >
                  <CardContent className="p-0">
                    <div className="relative h-[300px] @3xl:h-[400px]" />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </motion.div>
    </Section>
  )
}

export { Steps }
