import { cn } from "@/lib/utils"

function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main
      className={cn("mx-auto w-full max-w-3xl overflow-x-hidden", className)}
    >
      {children}
    </main>
  )
}
