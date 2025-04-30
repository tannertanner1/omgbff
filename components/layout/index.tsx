"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"

function Layout({ children }: { children: React.ReactNode }) {
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile and get viewport height
  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)

      // Capture the viewport height
      const vh = window.innerHeight
      setViewportHeight(vh)

      // Apply fixed height to main container on mobile
      if (containerRef.current) {
        containerRef.current.style.height = isMobileDevice ? `${vh}px` : "100vh"
      }

      // Set CSS variable for viewport height
      document.documentElement.style.setProperty(
        "--viewport-height",
        isMobileDevice ? `${vh}px` : "100vh"
      )

      // Prevent body scrolling
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    }

    checkMobileAndViewport()
    window.addEventListener("resize", checkMobileAndViewport)
    return () => window.removeEventListener("resize", checkMobileAndViewport)
  }, [])

  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset
        ref={containerRef}
        className="flex flex-col overflow-hidden"
        style={{
          height: isMobile ? `${viewportHeight}px` : "100vh",
          maxHeight: isMobile ? `${viewportHeight}px` : "100vh",
        }}
      >
        <SiteHeader />
        <div className="content-wrapper">
          <div className="content-container @container">
            <div className="scrollable-content">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}

export { Layout }

// @note

// "use client"

// import { SidebarInset } from "@/components/ui/sidebar"
// import { AppSidebar } from "./app-sidebar"
// import { SiteHeader } from "./site-header"

// function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <AppSidebar variant="inset" />
//       <SidebarInset className="@container flex h-[98svh] flex-col overflow-hidden">
//         <SiteHeader />
//         <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-2">
//           <div className="border-border bg-background -mt-2 overflow-auto rounded-xl border @3xl:mt-0">
//             <div className="flex-1 overflow-y-auto">{children}</div>
//           </div>
//         </div>
//       </SidebarInset>
//     </>
//   )
// }

// export { Layout }
