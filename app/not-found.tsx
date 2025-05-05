"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="bg-background flex min-h-[75dvh] flex-col items-center justify-center pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="text-primary container h-12 w-12" />
        <h1 className="text-foreground text-6xl font-bold tracking-tight text-balance">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-4 text-balance">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Button
            className={cn(
              "bg-background text-primary after:bg-primary relative text-base shadow-none after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out hover:bg-transparent hover:after:origin-bottom-right hover:after:scale-x-0 dark:hover:bg-transparent"
            )}
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
