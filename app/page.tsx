import { auth } from "@/lib/auth"
import { Landing } from "@/components/landing"
import { Menu } from "@/components/menu"

export default async function Page() {
  const session = await auth()

  return <>{session ? <Menu user={session.user} /> : <Landing />}</>
}
