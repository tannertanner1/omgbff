import { auth } from "@/lib/auth"
// import { Menu } from "@/components/menu"
import { Landing } from "@/components/landing"
import { cn } from "@/lib/utils"

export default async function Page() {
  const session = await auth()

  return (
    <>
      <div className="inset-ring-background relative flex min-h-fit flex-col inset-ring">
        <main className="mx-auto w-full max-w-5xl grow">
          <Landing />
        </main>
      </div>
    </>
  )
}
