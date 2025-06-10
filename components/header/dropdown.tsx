"use client"

import { revalidatePath } from "next/cache"
import Link from "next/link"
import { logout } from "@/actions/logout"
import {
  IconCircle,
  IconMail,
  IconPhotoCircle,
  IconRosetteDiscountCheckFilled,
  IconSend,
  IconUserCircle,
} from "@tabler/icons-react"
import type { Session } from "next-auth"
import { role } from "@/data/system-roles"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Dropdown({ session }: { session: Session | null }) {
  const handleLogout = async () => {
    try {
      await logout()
      revalidatePath("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full">
            <IconCircle className="h-6 w-6 cursor-pointer" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={
            session ? "w-[200px]" : "w-(--radix-dropdown-menu-trigger-width)"
          }
        >
          {session && (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="flex items-center truncate text-sm font-medium">
                    {session.user.id}
                    <span className="inline-flex items-center">
                      <IconRosetteDiscountCheckFilled
                        className="ml-1.5 h-5 w-5"
                        style={{
                          color: role[session.user.role].color,
                          transform: "translateY(-1px)", // Fine-tuned alignment
                        }}
                      />
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
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
          {session ? (
            <DropdownMenuItem onClick={handleLogout} className="gap-2">
              <IconPhotoCircle className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2">
                <IconUserCircle className="h-4 w-4" />
                Sign in
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
