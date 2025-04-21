"use client"

import type * as React from "react"
import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"

function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
        <SiteHeader />
        <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-2">
          <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { Layout }

// @note

// "use client"

// import type * as React from "react"
// import { useState } from "react"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// // import { ControlledTrigger, AppSidebar } from "./component"
// import { ControlledTrigger, AppSidebar } from "@/components/app-sidebar"

// import { Theme } from "@/components/theme"

// function Sidebar({ children }: { children: React.ReactNode }) {
//   const [open, setOpen] = useState(true)

//   return (
//     <SidebarProvider open={open} onOpenChange={setOpen}>
//       <AppSidebar variant="inset" collapsible="offcanvas" />
//       <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
//         <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             <ControlledTrigger className="-ml-1" />
//             {/* <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Active</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb> */}
//           </div>
//           <div className="flex items-center">
//             <Theme />
//           </div>
//         </header>
//         <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-4">
//           <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
//             <div className="flex-1 overflow-y-auto p-4">{children}</div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// export { Sidebar }

// @note

// "use client"

// import type * as React from "react"
// import { useState } from "react"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// import { ControlledTrigger, AppSidebar } from "./component"
// import { Theme } from "@/components/theme"

// // const SIDEBAR_WIDTH = "14rem"
// // const SIDEBAR_WIDTH_MOBILE = "16rem"

// function Sidebar({ children }: { children: React.ReactNode }) {
//   // Initialize state here instead of using useSidebar
//   const [open, setOpen] = useState(true)

//   return (
//     <SidebarProvider
//       open={open}
//       onOpenChange={setOpen}
//       // style={
//       //   {
//       //     "--sidebar-width": SIDEBAR_WIDTH,
//       //     "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
//       //   } as React.CSSProperties
//       // }
//     >
//       <AppSidebar variant="inset" collapsible="offcanvas" />
//       <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
//         <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             <ControlledTrigger className="-ml-1" />
//             {/* <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Active</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb> */}
//           </div>
//           <div className="flex items-center">
//             <Theme />
//           </div>
//         </header>
//         <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-4">
//           <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
//             <div className="flex-1 overflow-y-auto p-4">{children}</div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// export { Sidebar }

// @note ugg idk.

// "use client"

// import type * as React from "react"
// import { useState } from "react"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// import { ControlledTrigger, AppSidebar } from "./component"
// import { Theme } from "@/components/theme"

// // const SIDEBAR_WIDTH = "14rem"
// // const SIDEBAR_WIDTH_MOBILE = "16rem"

// function Sidebar({ children }: { children: React.ReactNode }) {
//   // Initialize state here instead of using useSidebar
//   const [open, setOpen] = useState(true)

//   return (
//     <SidebarProvider
//       open={open}
//       onOpenChange={setOpen}
//       // style={
//       //   {
//       //     "--sidebar-width": SIDEBAR_WIDTH,
//       //     "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
//       //   } as React.CSSProperties
//       // }
//     >
//       <AppSidebar variant="inset" collapsible="offcanvas" />
//       <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
//         <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             <ControlledTrigger className="-ml-1" />
//             {/* <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Active</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb> */}
//           </div>
//           <div className="flex items-center">
//             <Theme />
//           </div>
//         </header>
//         <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-4">
//           <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
//             <div className="flex-1 overflow-y-auto p-4">{children}</div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// export { Sidebar }

// @note original

// "use client"

// import type * as React from "react"
// import { useState } from "react"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// import { ControlledTrigger, AppSidebar } from "./component"
// import { Theme } from "@/components/theme"

// function Sidebar({ children }: { children: React.ReactNode }) {
//   // Initialize state here instead of using useSidebar
//   const [open, setOpen] = useState(true)

//   return (
//     <SidebarProvider open={open} onOpenChange={setOpen}>
//       <AppSidebar variant="inset" collapsible="offcanvas" />
//       <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
//         <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             <ControlledTrigger className="-ml-1" />
//             {/* <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Active</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb> */}
//           </div>
//           <div className="flex items-center">
//             <Theme />
//           </div>
//         </header>
//         <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-4">
//           <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
//             <div className="flex-1 overflow-y-auto p-4">{children}</div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// export { Sidebar }
