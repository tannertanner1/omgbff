import { emails } from "@/data/email-templates"
import { Email } from "@/components/email"

export default function VerifyEmail({ url }: { url: string }) {
  return <Email {...emails.verify} url={url} />
}

// import { Email } from '../components/email'
// import { verifyEmail } from '@/data/email-templates'

// export default function VerifyEmail({ url }: { url: string }) {
//   return <Email {...verifyEmail} url={url} />
// }
