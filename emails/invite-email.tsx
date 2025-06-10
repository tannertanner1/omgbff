import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function InviteEmail({ url }: { url: string }) {
  return <Email {...emails.invite} url={url} />
}
