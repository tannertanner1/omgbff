import { Email } from '@/components/email'
import { emails } from '@/data/email-templates'

export default function InviteEmail({ url }: { url: string }) {
  return <Email {...emails.invite} url={url} />
}
