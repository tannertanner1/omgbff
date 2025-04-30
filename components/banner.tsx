"use client"

import { useState, type ReactNode, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

function Banner({
  children,
  icon,
  dismissible = true,
  onDismiss,
  className,
}: {
  children: ReactNode
  icon?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [height, setHeight] = useState<number | null>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  // Measure banner height on mount
  useEffect(() => {
    if (bannerRef.current) {
      setHeight(bannerRef.current.offsetHeight)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <div
      style={{ height: isVisible ? "auto" : height ? `${height}px` : "auto" }}
    >
      <div
        ref={bannerRef}
        className={cn(
          "bg-accent text-foreground overflow-hidden py-3",
          isVisible ? "opacity-100" : "pointer-events-none opacity-0",
          "transition-opacity duration-300",
          className
        )}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3 pl-4 @3xl:mx-auto @3xl:w-fit @3xl:pl-0">
            {icon && (
              <div
                className="flex shrink-0 items-center opacity-60"
                aria-hidden="true"
              >
                {icon}
              </div>
            )}

            <div className="text-sm font-medium tracking-tight">{children}</div>
          </div>

          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className="group absolute right-2 -my-1.5 size-8 shrink-0 p-0 hover:bg-transparent"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
            >
              <IconX
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { Banner }
