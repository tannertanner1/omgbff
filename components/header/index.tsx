"use client"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { IconCircleFilled } from "@tabler/icons-react"
import { Dropdown } from "./dropdown"
// import { Theme } from "@/components/theme"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  IconLayoutSidebarFilled,
  IconLayoutSidebarRightFilled,
  IconCircle,
  IconCircleHalf,
} from "@tabler/icons-react"

async function Header() {
  const session = await auth()
  return (
    <div className="mx-auto flex h-14 max-w-5xl grow items-center justify-between px-4">
      <div className="flex items-center">
        <Link href="/">
          <div>
            <IconCircleFilled className="h-6 w-6" />
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* <Dropdown session={session} />
        <Toggle /> */}
        <IconCircle className="h-4 w-4" />
        <IconCircleHalf className="h-4 w-4" />
      </div>
    </div>
  )
}

export { Header }

// @note

// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { auth } from "@/lib/auth"
// import { IconCircleFilled } from "@tabler/icons-react"
// import { Dropdown } from "./dropdown"
// // import { Theme } from "@/components/theme"
// import { ModeToggle } from "@/components/mode"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   IconLayoutSidebarFilled,
//   IconLayoutSidebarRightFilled,
//   IconCircle,
//   IconCircleHalf,
// } from "@tabler/icons-react"

// async function Header() {
//   const session = await auth()
//   return (
//     <div className="mx-auto flex h-14 max-w-5xl grow items-center justify-between px-4">
//       <div className="flex items-center">
//         <Link href="/">
//           <div>
//             <IconCircleFilled className="h-6 w-6" />
//           </div>
//         </Link>
//       </div>
//       <div className="flex items-center gap-2">
//         {/* <Dropdown session={session} />
//         <Toggle /> */}
//         <IconCircle className="h-4 w-4" />
//         <IconCircleHalf className="h-4 w-4" />
//       </div>
//     </div>
//     // <header className="sticky top-0 z-50 w-full py-4">
//     //   <div className="container mx-auto flex items-center justify-between px-0">
//     //     <div className="ml-[-0.5rem]">
//     //       <AppSidebar />
//     //     </div>
//     //     <div className="mr-[-0.5rem]">
//     //       <Theme />
//     //     </div>
//     //   </div>
//     // </header>
//   )
// }

// export { Header }

// function AppSidebar() {
//   const [isOpen, setOpen] = useState(false)
//   return (
//     <>
//       <Button
//         onClick={() => setOpen(!isOpen)}
//         aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
//         variant="outline"
//         size="icon"
//         className="group/toggle text-primary rounded-full bg-transparent hover:bg-transparent"
//       >
//         {isOpen ? (
//           <IconLayoutSidebarRightFilled className="text-primary h-6 w-6 transition-colors" />
//         ) : (
//           <IconLayoutSidebarFilled className="text-primary h-6 w-6 transition-colors" />
//         )}
//         <span className="sr-only">Toggle sidebar</span>
//       </Button>
//     </>
//   )
// }

// @note

// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { auth } from "@/lib/auth"
// import { IconCircleFilled } from "@tabler/icons-react"
// import { Dropdown } from "./dropdown"
// // import { Toggle } from "./toggle"
// import { ModeToggle } from "@/components/mode"

// import { Theme } from "@/components/theme"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   IconLayoutSidebarFilled,
//   IconLayoutSidebarRightFilled,
// } from "@tabler/icons-react"

// function AppSidebar() {
//   const [isOpen, setOpen] = useState(false)
//   return (
//     <>
//       {/* <SidebarProvider open={open} onOpenChange={setOpen}>
//         <Sidebar />
//       </SidebarProvider> */}
//       <Button
//         onClick={() => setOpen(!isOpen)}
//         aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
//         variant="outline"
//         size="icon"
//         className="group/toggle text-primary rounded-full bg-transparent hover:bg-transparent"
//       >
//         {isOpen ? (
//           <IconLayoutSidebarRightFilled className="text-primary h-6 w-6 transition-colors" />
//         ) : (
//           <IconLayoutSidebarFilled className="text-primary h-6 w-6 transition-colors" />
//         )}
//         <span className="sr-only">Toggle sidebar</span>
//       </Button>
//     </>
//   )
// }

// // export async function Header() {
// //   const session = await auth()

// function Header() {
//   // const session = await auth()

//   return (
//     // <div className='mx-auto flex h-14 max-w-5xl grow items-center justify-between px-4'>
//     //   <div className='flex items-center'>
//     //     <Link href='/'>
//     //       <div>
//     //         <IconCircleFilled className='h-6 w-6' />
//     //       </div>
//     //     </Link>
//     //   </div>
//     //   <div className='flex items-center gap-2'>
//     //     <Dropdown session={session} />
//     //     <Toggle />
//     //   </div>
//     // </div>
//     <header className="sticky top-0 z-50 w-full py-4">
//       <div className="container mx-auto flex items-center justify-between px-0">
//         <div className="ml-[-0.5rem]">
//           <AppSidebar />
//         </div>
//         <div className="mr-[-0.5rem]">
//           <Theme />
//         </div>
//       </div>
//     </header>
//   )
// }

// export { Header }

// @note

// export function AppSidebar() {
//   const [isOpen, setOpen] = useState(false)
//   return (
//     <>
//       {/* <SidebarProvider open={open} onOpenChange={setOpen}>
//         <Sidebar />
//       </SidebarProvider> */}
//       <Button
//         onClick={() => setOpen(!isOpen)}
//         aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
//         variant='outline'
//         size='icon'
//         className='group/toggle rounded-full bg-transparent text-primary hover:bg-transparent'
//       >
//         {isOpen ? (
//           <IconLayoutSidebarRightFilled className='h-6 w-6 text-primary transition-colors' />
//         ) : (
//           <IconLayoutSidebarFilled className='h-6 w-6 text-primary transition-colors' />
//         )}
//         <span className='sr-only'>Toggle sidebar</span>
//       </Button>
//     </>
//   )
// }

// import * as React from 'react'
// import Link from 'next/link'
// import { auth } from '@/lib/auth'
// import { IconCircleFilled } from '@tabler/icons-react'
// import { Dropdown } from './dropdown'
// import { Toggle } from './toggle'

// import { AppSidebar } from '@/components/app-sidebar'
// import { Theme } from '@/components/theme'

// export async function Header() {
//   const session = await auth()

//   return (
//     // <div className='mx-auto flex h-14 max-w-5xl grow items-center justify-between px-4'>
//     //   <div className='flex items-center'>
//     //     <Link href='/'>
//     //       <div>
//     //         <IconCircleFilled className='h-6 w-6' />
//     //       </div>
//     //     </Link>
//     //   </div>
//     //   <div className='flex items-center gap-2'>
//     //     <Dropdown session={session} />
//     //     <Toggle />
//     //   </div>
//     // </div>
//     <header className='sticky top-0 z-50 w-full py-4'>
//       <div className='container mx-auto flex items-center justify-between px-0'>
//         <div className='ml-[-0.5rem]'>
//           <AppSidebar />
//         </div>
//         <div className='mr-[-0.5rem]'>
//           <Theme />
//         </div>
//       </div>
//     </header>
//   )
// }
