import Link from "next/link"
import { IconMoodEmpty } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function Empty({
  name,
  form,
  back,
}: {
  name: string
  form: string
  back: string
}) {
  return (
    <div className="flex h-fit">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="container mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center text-muted-foreground">
              <IconMoodEmpty className="h-24 w-24" />
            </div>
            <div className="mx-auto mt-6 flex w-full max-w-5xl flex-col justify-center gap-4">
              <Link href={form} className="w-full" prefetch={false}>
                <Button
                  variant="outline"
                  className="w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background"
                >
                  Create {name}
                </Button>
              </Link>
              <Link href={back} className="inline-flex" prefetch={false}>
                <Button
                  variant="outline"
                  className="w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background"
                >
                  Go back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
