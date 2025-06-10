import { cache } from "react"
import { redirect } from "next/navigation"
import type { User } from "@/lib/abac"
import { auth } from "@/lib/auth"

export const verifySession = cache(async (): Promise<User> => {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  return session.user as User
})
