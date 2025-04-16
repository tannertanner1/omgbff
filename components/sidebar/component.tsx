"use client"

import type * as React from "react"
import Link from "next/link"
import {
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  IconLayoutSidebarRightFilled,
  IconLayoutSidebarFilled,
  IconSlash,
  IconPlus,
  IconAt,
  IconFolder,
  IconUser,
  IconInvoice,
  IconMail,
  IconSend,
  IconDotsVertical,
  IconRosetteDiscountCheckFilled,
  IconSettings,
  IconUserCircle,
  IconCreditCard,
  IconBell,
  IconLogout,
  IconPhotoCircle,
} from "@tabler/icons-react"

const data = {
  header: {
    icon: IconSlash,
    name: "omgbff",
    url: "/",
  },
  main: [
    {
      icon: IconAt,
      name: "Users",
      url: "/users",
    },
    {
      icon: IconFolder,
      name: "Organizations",
      url: "/organizations",
    },
    {
      icon: IconUser,
      name: "Customers",
      url: "/customers",
    },
    {
      icon: IconInvoice,
      name: "Invoices",
      url: "/invoices",
    },
  ],
  secondary: [
    {
      icon: IconSettings,
      name: "Settings",
      url: "#",
      disabled: true,
    },
    {
      icon: IconMail,
      name: "Contact",
      url: "#",
    },
    {
      icon: IconSend,
      name: "Feedback",
      url: "#",
    },
  ],
  user: {
    id: "012345abcdef",
    email: "tanner@tannertanner.me",
  },
  footer: [
    {
      icon: IconUserCircle,
      name: "Account",
      url: "#",
      disabled: true,
    },
    {
      icon: IconCreditCard,
      name: "Billing",
      url: "#",
      disabled: true,
    },
    {
      icon: IconBell,
      name: "Notifications",
      url: "#",
      disabled: true,
    },
    {
      icon: IconLogout,
      name: "Logout",
      url: "#",
      disabled: false,
    },
  ],
}

function ControlledTrigger({ className }: { className?: string }) {
  const { state, toggleSidebar } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 w-8 p-0 ${className}`}
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      data-slot="sidebar-trigger"
    >
      {isExpanded ? (
        <IconLayoutSidebarFilled className="h-5 w-5 text-shadow-lg" />
      ) : (
        <IconLayoutSidebarRightFilled className="h-5 w-5 text-shadow-lg" />
      )}
    </Button>
  )
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {/* Header - Aligned with top of content container */}
      <SidebarHeader className="flex h-[52px] items-center pt-[10px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconSlash className="h-5 w-5" />
                <span className="text-base font-semibold">omgbff</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-1 flex-col">
        <SidebarGroup className="mt-0 pt-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.main.map((item) => (
                <SidebarMenuItem key={item.name} className="group">
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <SidebarMenuAction
                    showOnHover
                    className="flex items-center justify-center"
                  >
                    <Link
                      href={`${item.url}/new`}
                      className="flex items-center justify-center"
                    >
                      <IconPlus className="h-4 w-4" />{" "}
                      <span className="sr-only">Create {item.name}</span>
                    </Link>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1"></div>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.secondary.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="h-[60px] max-h-[60px] min-h-[60px]">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="bg-border rounded-lg"></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        <span className="inline-flex items-center">
                          {data.user.id}
                          <IconRosetteDiscountCheckFilled className="ml-1.5 h-5 w-5 text-shadow-lg" />
                        </span>
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                    <IconDotsVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="top"
                  align="center"
                  sideOffset={4}
                  alignOffset={0}
                  data-slot="dropdown-footer"
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg placeholder-black/50"></AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          <span className="inline-flex items-center">
                            {data.user.id}
                            <IconRosetteDiscountCheckFilled className="ml-1.5 h-5 w-5" />
                          </span>
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {data.footer.slice(0, 3).map((item, index) => (
                      <DropdownMenuItem key={index}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconPhotoCircle className="mr-2 h-4 w-4" />
                    {data.footer[3]?.name || "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

export { ControlledTrigger, AppSidebar }
