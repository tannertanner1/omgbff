import { auth } from "@/lib/auth"
// import { Menu } from "@/components/menu"
import { Landing } from "@/components/landing"

export default async function Page() {
  const session = await auth()

  return (
    <>
      {/* <div className="inset-ring-background relative flex min-h-fit flex-col inset-ring">
        <main className="mx-auto w-full grow">
          <Landing />
        </main>
      </div> */}
      <Landing />
    </>
  )
}
