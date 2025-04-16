"use client"

import type * as React from "react"
import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { ControlledTrigger, AppSidebar } from "./component"
import { Theme } from "@/components/theme"

function Sidebar({ children }: { children: React.ReactNode }) {
  // Initialize state here instead of using useSidebar
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar variant="inset" collapsible="offcanvas" />
      <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
        <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ControlledTrigger className="-ml-1" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Active</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
          <div className="flex items-center">
            <Theme />
          </div>
        </header>
        <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-4">
          <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { Sidebar }
