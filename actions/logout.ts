"use server"

import { signOut } from "@/lib/auth"

export async function logout() {
  await signOut({ redirectTo: "/" })
}
