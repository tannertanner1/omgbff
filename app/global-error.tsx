"use client"

// Error boundaries must be Client Components
import { Button } from "@/components/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        {/* <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button> */}
        <div className="flex h-fit">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="container mx-auto w-full max-w-5xl">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="sr-only">Global error</span>
                <h1 className="mt-6 text-balance text-4xl font-semibold">
                  Something went wrong!
                </h1>
                <Button className="mt-6 inline-block" onClick={() => reset()}>
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
