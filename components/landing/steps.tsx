"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { STEPS } from "@/data/landing-content"
import { Section } from "./section"

const Steps = () => {
  return (
    <Section className="@container">
      <Badge
        variant="secondary"
        className={cn(
          "mb-8 flex w-fit",
          "px-4 py-1.5 text-sm font-medium shadow-sm"
        )}
      >
        {STEPS.section}
      </Badge>

      <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
        {STEPS.title}
      </h2>
      <p className="text-muted-foreground mb-8 text-lg">{STEPS.description}</p>

      <div className="px-0">
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
                    "dark:inset-ring-background dark:border-border border-background"
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-primary size-8">
                      <item.icon className="text-primary size-8 text-shadow-lg" />
                    </span>
                    <p className="text-primary text-xl">{item.title}</p>
                  </div>
                  <p className="text-muted-foreground text-base md:block">
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
                    <div className="relative h-[300px] md:h-[400px]" />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </Section>
  )
}

export { Steps }
