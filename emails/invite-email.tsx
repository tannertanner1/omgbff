import { Email } from '@/components/email'
import { emails } from '@/data/email-templates'

export default function InviteEmail() {
  return <Email {...emails.invite} />
}
