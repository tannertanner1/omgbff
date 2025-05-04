"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Session } from "next-auth"
import { ITEMS } from "@/data/menu-items"
import { role } from "@/data/system-roles"
import { logout } from "@/actions/logout"
import {
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
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  IconSlash,
  IconPlus,
  IconDotsVertical,
  IconRosetteDiscountCheckFilled,
  IconPhotoCircle,
  IconUserCircle,
  IconSettings,
} from "@tabler/icons-react"

function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session?: Session | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isActive = (url: string) => pathname === url
  const isLoginPage = pathname === "/login"

  const handleLogout = async () => {
    try {
      await logout()
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader className="flex h-[52px] items-center pt-[10px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconSlash className="h-5 w-5" />
                <span className="text-base font-semibold">omgbff</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-1 flex-col">
        {/* Group */}
        {session && (
          <SidebarGroup className="mt-0 pt-0 group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <SidebarMenu>
                {ITEMS[0].map((item) => (
                  <SidebarMenuItem key={item.title} className="group">
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
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
                        <span className="sr-only">Create {item.title}</span>
                      </Link>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <div className="flex-1" />
        {/* Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS[1].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      {session && (
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
                          {session.user.id}
                          <IconRosetteDiscountCheckFilled
                            className="ml-1.5 h-5 w-5 text-shadow-lg"
                            style={{
                              color: role[session.user.role].color,
                              transform: "translateY(-1px)", // Fine-tuned alignment
                            }}
                          />
                        </span>
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {session.user.email}
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
                            {session.user.id}
                            <IconRosetteDiscountCheckFilled
                              className="ml-1.5 h-5 w-5"
                              style={{
                                color: role[session.user.role].color,
                                transform: "translateY(-1px)", // Fine-tuned alignment
                              }}
                            />
                          </span>
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* {ITEMS[2].map((item, index) => (
                    <div key={item.title}>
                      {index === 2 && <DropdownMenuSeparator />}
                      <DropdownMenuItem>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </DropdownMenuItem>
                    </div>
                  ))} */}
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2">
                      <IconUserCircle className="h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <IconSettings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2">
                    <IconPhotoCircle className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      {!session && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {pathname === "/login" ? (
                  <Link href="/">
                    <IconPhotoCircle className="mr-2 h-4 w-4" />
                    Go back
                  </Link>
                ) : (
                  <Link href="/login">
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      {/* {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="bg-border rounded-lg">
                  {session.user?.name?.[0] ||
                    session.user?.email?.[0] ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  <span className="inline-flex items-center">
                    {session.user?.id?.substring(0, 12) || "User"}
                    <IconRosetteDiscountCheckFilled className="ml-1.5 h-5 w-5 text-shadow-lg" />
                  </span>
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {session.user?.email || ""}
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
                  <AvatarFallback className="rounded-lg placeholder-black/50">
                    {session.user?.name?.[0] ||
                      session.user?.email?.[0] ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    <span className="inline-flex items-center">
                      {session.user?.id?.substring(0, 12) || "User"}
                      <IconRosetteDiscountCheckFilled className="ml-1.5 h-5 w-5" />
                    </span>
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session.user?.email || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <IconMail className="h-4 w-4" />
                Contact
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/feedback" className="flex items-center gap-2">
                <IconSend className="h-4 w-4" />
                Feedback
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2">
              <IconPhotoCircle className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SidebarMenuButton asChild>
          {isLoginPage ? (
            <Link href="/" className="flex items-center gap-2">
              <IconPhotoCircle className="h-4 w-4" />
              Go back
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2">
              <IconUserCircle className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </SidebarMenuButton>
      )} */}
      {/* Rail */}
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar }
