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
            <TabsList className="bg-background flex h-auto w-full flex-col gap-2 md:flex-row">
              <TabsTrigger
                value="feature-1"
                className="text-primary hover:border-primary/40 data-[state=active]:border-primary flex w-full flex-col items-start justify-start gap-1 rounded-md border p-4 text-left whitespace-normal"
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
                    <IconClockFilled className="text-primary size-4" />
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

// @note

// "use client"

// import { useEffect, useRef, useState } from "react"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"
// import { Section } from "./section"
// import { STEPS } from "@/data/landing-content"

// type Tab = (typeof STEPS.items)[number]

// function Step({
//   item,
//   index,
//   isActive,
//   onClick,
// }: {
//   item: Tab
//   index: number
//   isActive: boolean
//   onClick: () => void
// }) {
//   const Icon = item.icon

//   return (
//     <button
//       className={cn(
//         "group relative flex w-full flex-col items-start rounded-lg p-4 text-left transition-all duration-300",
//         isActive ? "bg-muted" : "hover:bg-accent/50"
//       )}
//       onClick={onClick}
//     >
//       <div className="mb-3 flex items-center gap-3">
//         <Icon className="text-primary h-8 w-8" />
//         <div className="text-base font-semibold">{item.title}</div>
//       </div>
//       <p className="text-muted-foreground z-10 m-0 text-sm leading-relaxed">
//         {item.description}
//       </p>
//     </button>
//   )
// }

// function Steps() {
//   const [activeStep, setActiveStep] = useState(0)
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const headingRef = useRef<HTMLHeadingElement>(null)
//   const contentRef = useRef<HTMLDivElement>(null)

//   // Set up scroll animation
//   useEffect(() => {
//     if (!sectionRef.current) return

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             // Animate heading if it exists
//             if (headingRef.current) {
//               headingRef.current.style.opacity = "0"
//               headingRef.current.style.transform = "translateY(20px)"

//               setTimeout(() => {
//                 headingRef.current!.style.transition =
//                   "opacity 0.6s ease, transform 0.6s ease"
//                 headingRef.current!.style.opacity = "1"
//                 headingRef.current!.style.transform = "translateY(0)"
//               }, 100)
//             }

//             // Animate content if it exists
//             if (contentRef.current) {
//               contentRef.current.style.opacity = "0"
//               contentRef.current.style.transform = "translateY(20px)"

//               setTimeout(() => {
//                 contentRef.current!.style.transition =
//                   "opacity 0.6s ease, transform 0.6s ease"
//                 contentRef.current!.style.opacity = "1"
//                 contentRef.current!.style.transform = "translateY(0)"
//               }, 200)
//             }

//             // Disconnect after animation
//             observer.disconnect()
//           }
//         })
//       },
//       { threshold: 0.1 }
//     )

//     observer.observe(sectionRef.current)

//     return () => {
//       observer.disconnect()
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="bg-background py-16 md:py-24">
//       <Section>
//         <Badge
//           variant="outline"
//           className="bg-background text-muted-foreground mb-8 text-sm"
//         >
//           <span className="cursor-pointer select-none">{STEPS.section}</span>
//         </Badge>

//         <h2
//           ref={headingRef}
//           className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
//         >
//           {STEPS.title}
//         </h2>

//         <p className="text-muted-foreground mt-4 text-lg">
//           {STEPS.description}
//         </p>

//         <div ref={contentRef} className="mx-auto mt-12 w-full max-w-4xl">
//           {/* Tab */}
//           <div className="mb-10 flex w-full flex-col gap-2 sm:flex-row">
//             {STEPS.items.map((item, index) => (
//               <Step
//                 key={index}
//                 item={item}
//                 index={index}
//                 isActive={activeStep === index}
//                 onClick={() => setActiveStep(index)}
//               />
//             ))}
//           </div>

//           <div className="relative h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]">
//             {STEPS.items.map((item, index) => (
//               <div
//                 key={index}
//                 className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
//                   activeStep === index ? "z-10 opacity-100" : "z-0 opacity-0"
//                 }`}
//               >
//                 <div className="relative h-full w-full">
//                   <div
//                     className={cn(
//                       "absolute inset-0",
//                       "[background-size:20px_20px]",
//                       "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
//                       "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
//                     )}
//                   />
//                   <img
//                     src={item.image || "/placeholder.svg?height=400&width=800"}
//                     alt={item.title}
//                     className="relative z-10 h-full w-full object-cover"
//                     style={{
//                       maskImage:
//                         "linear-gradient(to top, transparent, black 20%)",
//                       WebkitMaskImage:
//                         "linear-gradient(to top, transparent, black 20%)",
//                     }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Section>
//     </div>
//   )
// }

// export { Steps }
