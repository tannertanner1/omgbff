import * as React from "react"
import Link from "next/link"
import { IconCircle } from "@tabler/icons-react"
import { auth } from "@/lib/auth"
import { Dropdown } from "./dropdown"
import { Toggle } from "./toggle"

export async function Header() {
  const session = await auth()
  return (
    <div className="mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4">
      <div className="flex items-center">
        <Link href="/">
          <div>
            <IconCircle className="h-6 w-6" />
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Dropdown session={session} />
        <Toggle />
      </div>
    </div>
  )
}
