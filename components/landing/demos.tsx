"use client"

import * as React from "react"
import { motion } from "motion/react"
import { IconPlayerPlayFilled } from "@tabler/icons-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Section } from "./section"
import { DEMOS } from "@/data/landing-content"
import { cn } from "@/lib/utils"

type Clip = (typeof DEMOS.items)[number]["items"][number]

function Demo({ item, index }: { item: Clip; index: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <motion.div
      className="group w-[300px] flex-none cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <div className="from-muted/50 to-muted/10 relative mb-4 aspect-video overflow-hidden rounded-lg bg-linear-to-br">
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
            <img
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
            </Badge>
          </>
        )}
      </div>
      <div className="-mr-4 space-y-2">
        <h3 className="line-clamp-1 font-semibold">{item.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

function Demos() {
  return (
    <div className="py-16 md:py-24">
      <Section>
        <Badge
          variant="outline"
          className="bg-background text-muted-foreground mb-8 text-sm"
        >
          <span className="cursor-pointer select-none">{DEMOS.section}</span>
        </Badge>

        <h2 className="text-3xl font-bold tracking-tighter text-balance sm:text-4xl md:text-5xl">
          {DEMOS.title}
        </h2>

        <p className="text-muted-foreground mt-4 max-w-3xl text-lg">
          {DEMOS.description}
        </p>
      </Section>

      <div className="mt-16 space-y-20">
        {DEMOS.items.map((demo) => (
          <div key={demo.title} className="space-y-8">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="flex flex-col items-start justify-start text-left">
                <h3 className="text-2xl font-bold">{demo.title}</h3>
                <p className="text-muted-foreground max-w-3xl text-lg">
                  {demo.description}
                </p>
              </div>
            </div>

            <div className="relative w-full overflow-hidden">
              <ScrollArea className="w-full">
                <div className="flex space-x-6 pr-4 pb-6 pl-4 md:pr-4 md:pl-4">
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
