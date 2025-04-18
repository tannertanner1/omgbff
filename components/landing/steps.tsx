"use client"

import { Section } from "./section"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconRosetteDiscountCheckFilled,
  IconClockFilled,
  IconCoinFilled,
} from "@tabler/icons-react"
import { STEPS } from "@/data/landing-content"

const Steps = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <Section className="py-12 md:py-24">
        <Badge
          variant="outline"
          className="bg-background text-muted-foreground mb-8 text-sm"
        >
          <span className="cursor-pointer select-none">{STEPS.section}</span>
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          {STEPS.title}
        </h1>

        <p className="text-muted-foreground mb-8 max-w-[42rem] text-lg leading-normal text-balance sm:leading-8 md:text-xl">
          {STEPS.description}
        </p>

        <div className="mt-12 w-full max-w-4xl px-0">
          <Tabs defaultValue="feature-1">
            <TabsList className="bg-background flex h-auto w-full flex-col gap-2 lg:flex-row">
              <TabsTrigger
                value="feature-1"
                className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left text-balance whitespace-normal"
              >
                <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                  <span className="bg-accent flex size-8 items-center justify-center rounded-full lg:size-10">
                    <IconRosetteDiscountCheckFilled className="text-primary size-4" />
                  </span>
                  <p className="text-lg font-semibold md:text-2xl lg:text-xl">
                    {STEPS.items[0].title}
                  </p>
                </div>
                <p className="text-muted-foreground font-normal md:block">
                  {STEPS.items[0].description}
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="feature-2"
                className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left whitespace-normal"
              >
                <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                  <span className="bg-accent flex size-8 items-center justify-center rounded-full lg:size-10">
                    <IconRosetteDiscountCheckFilled className="text-primary size-4" />
                  </span>
                  <p className="text-lg font-semibold md:text-2xl lg:text-xl">
                    {STEPS.items[1].title}
                  </p>
                </div>
                <p className="text-muted-foreground font-normal md:block">
                  {STEPS.items[1].description}
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="feature-3"
                className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left whitespace-normal"
              >
                <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                  <span className="bg-accent flex size-8 items-center justify-center rounded-full lg:size-10">
                    <IconCoinFilled className="text-primary size-4" />
                  </span>
                  <p className="text-lg font-semibold md:text-2xl lg:text-xl">
                    {STEPS.items[2].title}
                  </p>
                </div>
                <p className="text-muted-foreground font-normal md:block">
                  {STEPS.items[2].description}
                </p>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="feature-1"
              className="border-border bg-background rounded-lg border"
            >
              <img
                src="https://placehold.co/1920x1200/transparent/transparent"
                alt=""
                className="aspect-video rounded-md object-cover"
              />
            </TabsContent>
            <TabsContent
              value="feature-2"
              className="border-border bg-background rounded-lg border"
            >
              <img
                src="https://placehold.co/1920x1200/transparent/transparent"
                alt=""
                className="aspect-video rounded-md object-cover"
              />
            </TabsContent>
            <TabsContent
              value="feature-3"
              className="border-border bg-background rounded-lg border"
            >
              <img
                src="https://placehold.co/1920x1200/transparent/transparent"
                alt=""
                className="aspect-video rounded-md object-cover"
              />
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </section>
  )
}

export { Steps }
