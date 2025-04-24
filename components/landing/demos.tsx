"use client"

import * as React from "react"
import { motion } from "motion/react"
import { IconPlayerPlayFilled } from "@tabler/icons-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Section } from "./section"
import { DEMOS } from "@/data/landing-content"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type Clip = (typeof DEMOS.items)[number]["items"][number]

function Demo({ item, index }: { item: Clip; index: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <motion.div
      className="group w-[300px] flex-none cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <div
        // className="from-muted/50 to-muted/10 relative mb-4 aspect-video overflow-hidden rounded-2xl bg-linear-to-br"
        className="relative mb-4 aspect-video overflow-hidden rounded-2xl"
      >
        {isPlaying ? (
          <video
            ref={videoRef}
            src={item.video}
            controls
            className="h-full w-full object-cover"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            {/* <img
              src={item.thumbnail || "/placeholder.svg?height=180&width=320"}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="bg-background/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="bg-primary/90 flex h-16 w-16 items-center justify-center rounded-full">
                <IconPlayerPlayFilled className="text-primary-foreground h-8 w-8" />
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "absolute top-2 right-2 h-5 rounded-full border-0 py-0 text-xs font-medium capitalize",
                {
                  "bg-[#d2e3fc] text-[#4285f4]": item.status === "live",
                  "bg-[#feefc3] text-[#fbbc04]": item.status === "soon",
                  "bg-[#e8eaed] text-[#3c4043]": item.status === "planned",
                }
              )}
            >
              {item.status}
            </Badge> */}
            <Card
              className={cn(
                // "aspect-video object-cover",
                // "flex w-full max-w-4xl flex-col gap-4 px-0",
                // "inset-ring-border dark:bg-input/30 bg-transparent inset-ring-1",
                // "dark:inset-ring-background dark:border-border"
                "bg-background",
                "border-0",
                "inset-ring-border inset-ring-1",
                "inset-shawdow inset-shawdow-lg"
              )}
            >
              <CardContent className="p-0">
                <div className="relative h-[300px] md:h-[400px]" />
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <div className="-mr-4 space-y-2">
        <h3 className="line-clamp-1 font-medium">{item.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

function Demos() {
  return (
    <div>
      <Section>
        <Badge
          variant="secondary"
          className={cn(
            "mb-8 flex w-fit",
            "px-4 py-1.5 text-sm font-medium shadow-sm"
          )}
        >
          {DEMOS.section}
        </Badge>

        <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
          {DEMOS.title}
        </h2>
        <p className="text-muted-foreground mb-4 text-lg">
          {DEMOS.description}
        </p>
      </Section>

      <div>
        {DEMOS.items.map((demo) => (
          <div key={demo.title}>
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col items-start justify-start text-left">
                <h3 className="mb-4 text-2xl font-medium">{demo.title}</h3>
                <p className="text-muted-foreground mb-8 max-w-3xl text-base">
                  {demo.description}
                </p>
              </div>
            </div>

            <div className="relative mb-4 w-full overflow-hidden">
              <ScrollArea className="w-full">
                <div className="mb-4 flex gap-8 pr-4 pb-6 pl-4 md:pr-4 md:pl-4">
                  {demo.items.map((item, index) => (
                    <Demo key={item.title} item={item} index={index} />
                  ))}
                </div>
                <ScrollBar
                  orientation="horizontal"
                  className="opacity-0 transition-opacity hover:opacity-100"
                />
              </ScrollArea>

              {/* Fade effect on the left edge */}
              <div className="from-background pointer-events-none absolute top-0 left-0 h-full w-12 bg-linear-to-r to-transparent" />

              {/* Fade effect on the right edge */}
              <div className="from-background pointer-events-none absolute top-0 right-0 h-full w-12 bg-linear-to-l to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Demos }
