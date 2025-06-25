import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function LoginEmail({ url }: { url: string }) {
  return <Email {...emails.login} url={url} />
}
