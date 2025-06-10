import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function InvoiceEmail() {
  return <Email {...emails.invoice} />
}

// import { Email } from '@/components/email'
// import { invoiceEmail } from '@/data/email-templates'

// export default function InvoiceEmail({ url }: { url: string }) {
//   return <Email {...invoiceEmail} url={url} />
// }
