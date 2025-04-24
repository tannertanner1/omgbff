"use client"

// Error boundaries must be Client Components

import React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="bg-background flex min-h-[40dvh] flex-col items-center justify-center pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="text-primary h-12 w-12" />
        <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance">
          Something went wrong!
        </h1>
        <div className="mt-6 flex flex-row items-center justify-center gap-2">
          <Link href="/" className="inline-flex" prefetch={false}>
            <Button
              variant="ghost"
              className={cn(
                "shadown-none text-primary after:bg-primary relative bg-transparent after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out hover:bg-transparent hover:after:origin-bottom-right hover:after:scale-x-0 dark:hover:bg-transparent"
              )}
              onClick={() => router.back()}
            >
              Go back
            </Button>
          </Link>
          <Link href="/" className="inline-flex" prefetch={false}>
            <Button
              variant="ghost"
              className={cn(
                "shadown-none text-primary after:bg-primary relative bg-transparent after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out hover:bg-transparent hover:after:origin-bottom-right hover:after:scale-x-0 dark:hover:bg-transparent"
              )}
              onClick={() => reset()}
            >
              Try again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
