import { Geist, Geist_Mono, Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable
)
