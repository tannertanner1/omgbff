import { Email } from '@/components/email'
import { emails } from '@/data/email-templates'

export default function LoginEmail({ url }: { url: string }) {
  return <Email {...emails.login} url={url} />
}

// import { Email } from '@/components/email'
// import { loginEmail } from '@/data/email-templates'

// export default function LoginEmail({ url }: { url: string }) {
//   return <Email {...loginEmail} url={url} />
// }
