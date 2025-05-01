import { auth } from "@/lib/auth"
import { Menu } from "@/components/menu"
import { Landing } from "@/components/landing"

export default async function Page() {
  const session = await auth()

  return <>{session ? <Menu user={session.user} /> : <Landing />}</>
}
