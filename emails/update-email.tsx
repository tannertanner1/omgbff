import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function UpdateEmail({ url }: { url: string }) {
  return <Email {...emails.update} url={url} />
}
