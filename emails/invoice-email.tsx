import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function InvoiceEmail() {
  return <Email {...emails.invoice} />
}
