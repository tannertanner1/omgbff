"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/actions/logout"
import {
  IconDotsVertical,
  IconPhotoCircle,
  IconPlus,
  IconRosetteDiscountCheckFilled,
  IconSettings,
  IconSlash,
  IconUserCircle,
} from "@tabler/icons-react"
import type { Session } from "next-auth"
import { ITEMS } from "@/data/menu-items"
import { role } from "@/data/system-roles"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session?: Session | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
  const isActive = (url: string) => pathname === url

  const handleLogout = async () => {
    setOpenMobile(false)
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" onClick={() => setOpenMobile(false)}>
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
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      className={cn(
                        "flex items-center justify-center",
                        pathname === `${item.url}/new`
                          ? "[&[data-slot=sidebar-menu-action]]:bg-sidebar-accent [&[data-slot=sidebar-menu-action]]:text-sidebar-accent-foreground [&[data-slot=sidebar-menu-action]]:md:opacity-100"
                          : "[&[data-slot=sidebar-menu-action]]:hover:text-sidebar-accent-foreground [&[data-slot=sidebar-menu-action]]:md:text-transparent"
                      )}
                    >
                      <Link
                        href={`${item.url}/new`}
                        className="flex items-center justify-center"
                        onClick={() => setOpenMobile(false)}
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
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
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
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-0 focus-visible:outline-none"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="bg-border rounded-lg" />
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
                  className="[&[data-slot=dropdown-menu-content]]:bg-sidebar w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="top"
                  align="center"
                  sideOffset={4}
                  alignOffset={0}
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
                                transform: "translateY(-1px)",
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
                  <DropdownMenuItem
                    asChild
                    className="[&[data-slot=dropdown-menu-item]]:focus:bg-sidebar-accent [&[data-slot=dropdown-menu-item]]:focus:text-sidebar-accent-foreground cursor-not-allowed"
                  >
                    <Link
                      href="/account"
                      className="flex items-center gap-2"
                      onClick={() => setOpenMobile(false)}
                    >
                      <IconUserCircle className="h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="[&[data-slot=dropdown-menu-item]]:focus:bg-sidebar-accent [&[data-slot=dropdown-menu-item]]:focus:text-sidebar-accent-foreground cursor-not-allowed"
                  >
                    <Link
                      href="/settings"
                      className="flex items-center gap-2"
                      onClick={() => setOpenMobile(false)}
                    >
                      <IconSettings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="[&[data-slot=dropdown-menu-item]]:focus:bg-sidebar-accent [&[data-slot=dropdown-menu-item]]:focus:text-sidebar-accent-foreground gap-2"
                  >
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
                  <Link href="/" onClick={() => setOpenMobile(false)}>
                    <IconPhotoCircle className="mr-2 h-4 w-4" />
                    Go back
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setOpenMobile(false)}>
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar }
