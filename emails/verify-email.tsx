import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function VerifyEmail({ url }: { url: string }) {
  return <Email {...emails.verify} url={url} />
}
