import { Email } from '@/components/email'
import { emails } from '@/data/email-templates'

export default function UpdateEmail({ url }: { url: string }) {
  return <Email {...emails.update} url={url} />
}

// import { Email } from '@/components/email'
// import { updateEmail } from '@/data/email-templates'

// export default function UpdateEmail({ url }: { url: string }) {
//   return <Email {...updateEmail} url={url} />
// }
