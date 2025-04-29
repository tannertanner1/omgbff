"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { DEMOS } from "@/data/landing-content"
import { Section } from "./section"

type Clip = (typeof DEMOS.items)[number]["items"][number]

function Demo({ item, index }: { item: Clip; index: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <motion.div
      className="group w-[256px] flex-none cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? (
        <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl">
          <video
            ref={videoRef}
            src={item.video}
            controls
            className="h-full w-full object-cover"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="mb-4">
          <div className="pt-2">
            <Card
              className={cn(
                "inset-ring-border dark:bg-input/30 bg-transparent inset-ring-1",
                "dark:inset-ring-background dark:border-border border-background",
                "aspect-video"
              )}
            >
              <CardContent className="p-0">
                <div className="relative h-full w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="line-clamp-1 font-medium">{item.title}</h3>
          {item.status && (
            <Badge
              variant="outline"
              className={cn(
                "h-5 rounded-full border-0 py-0 text-xs font-medium capitalize",
                {
                  // "bg-[#d2e3fc] text-[#4285f4]": item.status === "live",
                  // "bg-[#feefc3] text-[#fbbc04]": item.status === "soon",
                  // "bg-[#e8eaed] text-[#3c4043]": item.status === "planned",
                  "-inset-shadow-2xs bg-[#d2e3fc] text-[#4285f4] inset-ring-1 inset-shadow-[#d2e3fc] inset-ring-[#4285f4]/50":
                    item.status === "live",
                  "-inset-shadow-2xs bg-[#feefc3] text-[#fbbc04] inset-ring-1 inset-shadow-[#feefc3] inset-ring-[#fbbc04]/50":
                    item.status === "soon",
                  "-inset-shadow-2xs bg-[#e8eaed] text-[#3c4043] inset-ring-1 inset-shadow-[#e8eaed] inset-ring-[#3c4043]/50":
                    item.status === "planned",
                }
              )}
            >
              {item.status}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 px-2 text-sm leading-normal">
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
            {DEMOS.section}
          </Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-3xl font-semibold tracking-tighter text-balance @3xl:text-4xl"
        >
          {DEMOS.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mb-4 text-lg"
        >
          {DEMOS.description}
        </motion.p>
      </Section>

      <div>
        {DEMOS.items.map((demo, demoIndex) => (
          <motion.div
            key={demo.title}
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * demoIndex }}
          >
            <div className="mx-auto max-w-5xl px-6">
              <div className="flex flex-col items-start justify-start text-left">
                <motion.h3
                  className="mb-2 text-2xl font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + 0.05 * demoIndex }}
                >
                  {demo.title}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground mb-2 text-base leading-normal text-pretty"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + 0.05 * demoIndex }}
                >
                  {demo.description}
                </motion.p>
              </div>
            </div>

            <motion.div
              className="relative mb-4 w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + 0.05 * demoIndex }}
            >
              <ScrollArea className="w-full [&_[data-slot=scroll-area-thumb]]:bg-transparent">
                <div className="mx-auto max-w-5xl px-6">
                  <div className="flex gap-8 pt-2 pb-6">
                    {demo.items.map((item, index) => (
                      <Demo key={item.title} item={item} index={index} />
                    ))}
                    <div
                      className="-ml-1.5 w-0.5 flex-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export { Demos }

// @note

// "use client"

// import * as React from "react"
// import { motion, useMotionValue, animate } from "motion/react"
// import { Badge } from "@/components/ui/badge"
// import { Section } from "./section"
// import { DEMOS } from "@/data/landing-content"
// import { cn } from "@/lib/utils"
// import { Card, CardContent } from "@/components/ui/card"

// type Clip = (typeof DEMOS.items)[number]["items"][number]

// function Demo({ item, index }: { item: Clip; index: number }) {
//   const [isPlaying, setIsPlaying] = React.useState(false)
//   const videoRef = React.useRef<HTMLVideoElement>(null)

//   return (
//     <motion.div
//       className="group w-[300px] flex-none cursor-default"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.1 * index }}
//       onClick={() => setIsPlaying(!isPlaying)}
//     >
//       {isPlaying ? (
//         <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl">
//           <video
//             ref={videoRef}
//             src={item.video}
//             controls
//             className="h-full w-full object-cover"
//             autoPlay
//           >
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       ) : (
//         <div className="mb-4">
//           <Card
//             className={cn(
//               "inset-ring-border dark:bg-input/30 bg-transparent inset-ring-1",
//               "dark:inset-ring-background dark:border-border border-background",
//               "aspect-video"
//             )}
//           >
//             <CardContent className="p-0">
//               <div className="relative h-full w-full" />
//             </CardContent>
//           </Card>
//         </div>
//       )}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between">
//           <h3 className="line-clamp-1 font-medium">{item.title}</h3>
//           {item.status && (
//             <Badge
//               variant="outline"
//               className={cn(
//                 "h-5 rounded-full border-0 py-0 text-xs font-medium capitalize",
//                 {
//                   "bg-[#d2e3fc] text-[#4285f4]": item.status === "live",
//                   "bg-[#feefc3] text-[#fbbc04]": item.status === "soon",
//                   "bg-[#e8eaed] text-[#3c4043]": item.status === "planned",
//                 }
//               )}
//             >
//               {item.status}
//             </Badge>
//           )}
//         </div>
//         <p className="text-muted-foreground line-clamp-2 text-sm">
//           {item.description}
//         </p>
//       </div>
//     </motion.div>
//   )
// }

// function useScrollMask(element: HTMLDivElement | null) {
//   const maskImage = useMotionValue(
//     `linear-gradient(90deg, #000, #000 0%, #000 80%, #0000)`
//   )

//   React.useEffect(() => {
//     if (!element) return

//     const checkScroll = () => {
//       const isStart = element.scrollLeft <= 10
//       const isEnd =
//         Math.abs(
//           element.scrollWidth - element.clientWidth - element.scrollLeft
//         ) <= 10

//       animate(
//         maskImage,
//         isStart
//           ? `linear-gradient(90deg, #000, #000 0%, #000 80%, #0000)`
//           : isEnd
//             ? `linear-gradient(90deg, #0000, #000 20%, #000 100%, #000)`
//             : `linear-gradient(90deg, #0000, #000 20%, #000 80%, #0000)`
//       )
//     }

//     checkScroll()
//     element.addEventListener("scroll", checkScroll)
//     return () => element.removeEventListener("scroll", checkScroll)
//   }, [element, maskImage])

//   return maskImage
// }

// function ScrollList({ demo }: { demo: (typeof DEMOS.items)[number] }) {
//   const containerRef = React.useRef<HTMLDivElement>(null)
//   const [element, setElement] = React.useState<HTMLDivElement | null>(null)
//   const maskImage = useScrollMask(element)

//   React.useEffect(() => {
//     setElement(containerRef.current)
//   }, [])

//   return (
//     <div className="relative mb-4 w-full overflow-visible">
//       <motion.div
//         style={{ maskImage, WebkitMaskImage: maskImage }}
//         className="w-full overflow-visible"
//       >
//         <div
//           ref={containerRef}
//           className="mb-4 flex gap-8 overflow-auto overflow-x-auto px-4 pb-6"
//         >
//           {demo.items.map((item, index) => (
//             <Demo key={item.title} item={item} index={index} />
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// function Demos() {
//   return (
//     <div>
//       <Section>
//         <Badge
//           variant="secondary"
//           className="mb-8 flex w-fit px-4 py-1.5 text-sm font-medium shadow-sm"
//         >
//           {DEMOS.section}
//         </Badge>

//         <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
//           {DEMOS.title}
//         </h2>
//         <p className="text-muted-foreground mb-4 text-lg">
//           {DEMOS.description}
//         </p>
//       </Section>

//       <div>
//         {DEMOS.items.map((demo) => (
//           <div key={demo.title} className="mb-16">
//             <div className="mx-auto max-w-5xl">
//               <div className="flex flex-col items-start justify-start text-left">
//                 <h3 className="mb-4 text-2xl font-medium">{demo.title}</h3>
//                 <p className="text-muted-foreground mb-8 max-w-3xl text-base">
//                   {demo.description}
//                 </p>
//               </div>
//             </div>

//             <ScrollList demo={demo} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export { Demos }
