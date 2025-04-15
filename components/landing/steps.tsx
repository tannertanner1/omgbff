"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { IconCheck } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"

// Use a single icon for all steps
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react"

const STEPS = {
  section: "How it works",
  title: "Modern solutions, less overhead.",
  description: "Faster workflows. Less admin. More control.",
  items: [
    {
      title: "Simplify Onboarding",
      features: [
        {
          title: "Email-only signup",
          description: "No passwords or paper forms required",
        },
        {
          title: "Self-service options",
          description: "Clients choose and update services anytime",
        },
        {
          title: "Secure account handoff",
          description: "Transfer access when needed without hassle",
        },
      ],
    },
    {
      title: "Streamline Management",
      features: [
        {
          title: "Centralized dashboard",
          description: "Manage info, invoices, and groups in one place",
        },
        {
          title: "Activity tracking",
          description: "Built-in logs and history for complete visibility",
        },
        {
          title: "Hands-off monitoring",
          description: "Stay in the loop without manual intervention",
        },
      ],
    },
    {
      title: "Automate Billing",
      features: [
        {
          title: "Automatic invoicing",
          description: "Invoices send themselves on schedule",
        },
        {
          title: "Payment tracking",
          description: "Payments update automatically in real-time",
        },
        {
          title: "Simplified reporting",
          description: "Skip spreadsheets and focus on what matters",
        },
      ],
    },
  ],
}

export function Steps() {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  // Function to handle tab changes with direction
  const handleTabChange = (index: number) => {
    setDirection(index > activeTab ? 1 : -1)
    setActiveTab(index)
  }

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="bg-background text-muted-foreground mb-8 text-sm"
          >
            <span className="cursor-pointer select-none">{STEPS.section}</span>
          </Badge>

          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {STEPS.title}
          </motion.h2>

          <motion.p
            className="text-muted-foreground mt-4 max-w-2xl text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {STEPS.description}
          </motion.p>

          <motion.div
            className="mt-12 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Desktop: 3 cards in a row, each with vertical bullet points */}
            <div className="mb-10 hidden lg:grid lg:grid-cols-3 lg:gap-6">
              {STEPS.items.map((item, index) => (
                <Card
                  key={index}
                  className={cn(
                    "group relative border-2 transition-all duration-300",
                    activeTab === index
                      ? "border-primary" // Use primary color for active
                      : "hover:border-primary/30 border-transparent" // Use primary with opacity for hover
                  )}
                  onClick={() => handleTabChange(index)}
                >
                  <CardHeader className="pb-2 text-left">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "bg-primary/10 text-primary",
                          "ring-primary/30 inline-flex rounded-lg p-3 ring-2 ring-inset"
                        )}
                      >
                        <IconRosetteDiscountCheckFilled className="h-6 w-6" />
                      </span>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 text-left">
                    <div className="space-y-4">
                      {item.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <IconCheck className="text-primary mt-1 h-4 w-4" />
                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-medium">
                              {feature.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mobile: Single card with horizontal bullet points */}
            <div className="mb-10 lg:hidden">
              {STEPS.items.map((item, index) => (
                <Card
                  key={index}
                  className={cn(
                    "group relative mb-6 border-2 transition-all duration-300",
                    activeTab === index
                      ? "border-primary" // Use primary color for active
                      : "hover:border-primary/30 border-transparent" // Use primary with opacity for hover
                  )}
                  onClick={() => handleTabChange(index)}
                >
                  <CardHeader className="pb-2 text-left">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "bg-primary/10 text-primary",
                          "ring-primary/30 inline-flex rounded-lg p-3 ring-2 ring-inset"
                        )}
                      >
                        <IconRosetteDiscountCheckFilled className="h-6 w-6" />
                      </span>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 text-left">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {item.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex flex-col">
                          <div className="flex items-start gap-2">
                            <IconCheck className="text-primary mt-1 h-4 w-4" />
                            <p className="text-sm font-medium">
                              {feature.title}
                            </p>
                          </div>
                          <p className="text-muted-foreground ml-6 text-xs">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Image Display Area with AnimatePresence */}
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-md md:h-[400px]">
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                {STEPS.items.map(
                  (item, index) =>
                    activeTab === index && (
                      <motion.div
                        key={index}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            type: "spring",
                            duration: 0.5,
                            bounce: 0.3,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          x: direction * -50,
                          transition: {
                            duration: 0.3,
                          },
                        }}
                        className="absolute inset-0"
                      >
                        <div className="relative h-full w-full">
                          <div
                            className={cn(
                              "absolute inset-0",
                              "[background-size:20px_20px]",
                              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                              "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
                            )}
                          />
                          <div className="bg-primary/10 relative z-10 h-full w-full rounded-xl" />
                        </div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// @note

// "use client"

// import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { cn } from "@/lib/utils"
// import {
//   IconRosetteDiscountCheckFilled,
//   IconClockFilled,
//   IconCoinFilled,
//   IconCheck,
// } from "@tabler/icons-react"

// const STEPS = {
//   section: "How it works",
//   title: "Modern solutions, less overhead.",
//   description: "Faster workflows. Less admin. More control.",
//   items: [
//     {
//       icon: IconRosetteDiscountCheckFilled,
//       title: "Simplify Onboarding",
//       iconColor: "text-green-700",
//       bgColor: "bg-green-50 dark:bg-green-950/30",
//       ringColor: "ring-green-700/30",
//       borderColor: "border-green-700",
//       bgHex: {
//         light: "f0fdf4", // green-50
//         dark: "052e16", // green-950
//       },
//       features: [
//         {
//           title: "Email-only signup",
//           description: "No passwords or paper forms required",
//         },
//         {
//           title: "Self-service options",
//           description: "Clients choose and update services anytime",
//         },
//         {
//           title: "Secure account handoff",
//           description: "Transfer access when needed without hassle",
//         },
//       ],
//     },
//     {
//       icon: IconClockFilled,
//       title: "Streamline Management",
//       iconColor: "text-red-700",
//       bgColor: "bg-red-50 dark:bg-red-950/30",
//       ringColor: "ring-red-700/30",
//       borderColor: "border-red-700",
//       bgHex: {
//         light: "fef2f2", // red-50
//         dark: "450a0a", // red-950
//       },
//       features: [
//         {
//           title: "Centralized dashboard",
//           description: "Manage info, invoices, and groups in one place",
//         },
//         {
//           title: "Activity tracking",
//           description: "Built-in logs and history for complete visibility",
//         },
//         {
//           title: "Hands-off monitoring",
//           description: "Stay in the loop without manual intervention",
//         },
//       ],
//     },
//     {
//       icon: IconCoinFilled,
//       title: "Automate Billing",
//       iconColor: "text-blue-700",
//       bgColor: "bg-blue-50 dark:bg-blue-950/30",
//       ringColor: "ring-blue-700/30",
//       borderColor: "border-blue-700",
//       bgHex: {
//         light: "eff6ff", // blue-50
//         dark: "172554", // blue-950
//       },
//       features: [
//         {
//           title: "Automatic invoicing",
//           description: "Invoices send themselves on schedule",
//         },
//         {
//           title: "Payment tracking",
//           description: "Payments update automatically in real-time",
//         },
//         {
//           title: "Simplified reporting",
//           description: "Skip spreadsheets and focus on what matters",
//         },
//       ],
//     },
//   ],
// }

// export function Steps() {
//   const [activeTab, setActiveTab] = useState(0)
//   // Simple dark mode detection without hooks to avoid re-render issues
//   const isDarkMode =
//     typeof document !== "undefined"
//       ? document.documentElement.classList.contains("dark")
//       : false

//   return (
//     <div className="bg-background py-16 md:py-24">
//       <div className="container mx-auto max-w-5xl px-4">
//         <div className="flex flex-col items-center text-center">
//           <Badge
//             variant="outline"
//             className="bg-background text-muted-foreground mb-8 text-sm"
//           >
//             <span className="cursor-pointer select-none">{STEPS.section}</span>
//           </Badge>

//           <h2 className="animate-in fade-in slide-in-from-bottom-5 text-3xl font-bold tracking-tighter duration-700 sm:text-4xl md:text-5xl">
//             {STEPS.title}
//           </h2>

//           <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-5 mt-4 max-w-2xl text-lg delay-150 duration-700">
//             {STEPS.description}
//           </p>

//           <div className="animate-in fade-in slide-in-from-bottom-5 mt-12 w-full delay-300 duration-700">
//             {/* Desktop: 3 cards in a row, each with vertical bullet points */}
//             <div className="mb-10 hidden lg:grid lg:grid-cols-3 lg:gap-6">
//               {STEPS.items.map((item, index) => {
//                 const Icon = item.icon
//                 return (
//                   <Card
//                     key={index}
//                     className={cn(
//                       "group relative border-2 transition-all duration-300",
//                       activeTab === index
//                         ? item.borderColor // Darker border when active
//                         : "hover:border-opacity-30 hover: border-transparent" +
//                             item.borderColor // Lighter border on hover
//                     )}
//                     onClick={() => setActiveTab(index)}
//                   >
//                     <CardHeader className="pb-2 text-left">
//                       <div className="flex items-center gap-3">
//                         <span
//                           className={cn(
//                             item.bgColor,
//                             item.iconColor,
//                             "inline-flex rounded-lg p-3 ring-2 ring-inset",
//                             item.ringColor
//                           )}
//                         >
//                           <Icon className="h-6 w-6" />
//                         </span>
//                         <CardTitle className="text-base">
//                           {item.title}
//                         </CardTitle>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="pt-2 text-left">
//                       <div className="space-y-4">
//                         {item.features.map((feature, featureIndex) => (
//                           <div
//                             key={featureIndex}
//                             className="flex items-start gap-3"
//                           >
//                             <IconCheck
//                               className={cn("mt-1 h-4 w-4", item.iconColor)}
//                             />
//                             <div className="flex flex-col gap-0.5">
//                               <p className="text-sm font-medium">
//                                 {feature.title}
//                               </p>
//                               <p className="text-muted-foreground text-xs">
//                                 {feature.description}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>

//             {/* Mobile: Single card with horizontal bullet points */}
//             <div className="mb-10 lg:hidden">
//               {STEPS.items.map((item, index) => {
//                 const Icon = item.icon
//                 return (
//                   <Card
//                     key={index}
//                     className={cn(
//                       "group relative mb-6 border-2 transition-all duration-300",
//                       activeTab === index
//                         ? item.borderColor // Darker border when active
//                         : "hover:border-opacity-30 hover: border-transparent" +
//                             item.borderColor // Lighter border on hover
//                     )}
//                     onClick={() => setActiveTab(index)}
//                   >
//                     <CardHeader className="pb-2 text-left">
//                       <div className="flex items-center gap-3">
//                         <span
//                           className={cn(
//                             item.bgColor,
//                             item.iconColor,
//                             "inline-flex rounded-lg p-3 ring-2 ring-inset",
//                             item.ringColor
//                           )}
//                         >
//                           <Icon className="h-6 w-6" />
//                         </span>
//                         <CardTitle className="text-base">
//                           {item.title}
//                         </CardTitle>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="pt-2 text-left">
//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                         {item.features.map((feature, featureIndex) => (
//                           <div key={featureIndex} className="flex flex-col">
//                             <div className="flex items-start gap-2">
//                               <IconCheck
//                                 className={cn("mt-1 h-4 w-4", item.iconColor)}
//                               />
//                               <p className="text-sm font-medium">
//                                 {feature.title}
//                               </p>
//                             </div>
//                             <p className="text-muted-foreground ml-6 text-xs">
//                               {feature.description}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>

//             {/* Image with icon bg color */}
//             <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-md md:h-[400px]">
//               {STEPS.items.map((item, index) => {
//                 // Use the appropriate color based on dark/light mode
//                 const bgColor = isDarkMode ? item.bgHex.dark : item.bgHex.light

//                 return (
//                   <div
//                     key={index}
//                     className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
//                       activeTab === index ? "z-10 opacity-100" : "z-0 opacity-0"
//                     }`}
//                   >
//                     <div className="relative h-full w-full">
//                       <div
//                         className={cn(
//                           "absolute inset-0",
//                           "[background-size:20px_20px]",
//                           "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
//                           "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
//                         )}
//                       />
//                       <img
//                         src={`https://placehold.co/1920x1200/${bgColor}/${bgColor}`}
//                         alt={item.title}
//                         className="relative z-10 h-full w-full rounded-xl object-cover"
//                       />
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

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

//         <div ref={contentRef} className="mt-12">
//           {/* Tab */}
//           <div className="mb-10 flex w-full flex-col gap-2 md:flex-row">
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
