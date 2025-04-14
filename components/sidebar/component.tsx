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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  IconLayoutSidebarRightFilled,
  IconLayoutSidebarFilled,
  IconSlash,
  IconPlus,
  IconAt,
  IconFolder,
  IconUser,
  IconInvoice,
  IconSettings,
  IconMail,
  IconSend,
  IconDotsVertical,
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckFilled,
  IconUserCircle,
  IconCreditCard,
  IconBell,
  IconLogout,
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
      url: "#",
    },
    {
      icon: IconFolder,
      name: "Organizations",
      url: "#",
    },
    {
      icon: IconUser,
      name: "Customers",
      url: "#",
    },
    {
      icon: IconInvoice,
      name: "Invoices",
      url: "#",
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
      icon: IconRosetteDiscountCheck,
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
      {/* Header */}
      <SidebarHeader>
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
        {/* Main */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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
                  <SidebarMenuAction showOnHover>
                    <Link href={`${item.url}/new`}>
                      <IconPlus className="h-4 w-4" />{" "}
                      <span className="sr-only">Create {item.name}</span>
                    </Link>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary */}
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

        <SidebarFooter>
          {/* User */}
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
                        {/* {data.user.id} */}
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
                  {/* Footer */}
                  <DropdownMenuSeparator />
                  {/* {data.footer.map((item) => ( ... ))} */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <IconRosetteDiscountCheck />
                      {data.footer[0]?.name || "Account"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconCreditCard />
                      {data.footer[1]?.name || "Billing"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconBell />
                      {data.footer[2]?.name || "Notifications"}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconLogout />
                    {data.footer[3]?.name || "Logout"}
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
