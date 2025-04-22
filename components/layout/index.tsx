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
