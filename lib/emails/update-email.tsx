import { EmailTemplate } from '@/components/email-template'

const updateEmail = {
  preview: 'Confirm change of email',
  heading: 'Confirm change of email',
  body: 'Click the button below to confirm the update of your email.',
  button: 'Update email',
  footer: "If you didn't request this change, you can safely ignore this email."
}

function UpdateEmail({ url }: { url: string }) {
  return <EmailTemplate {...updateEmail} url={url} />
}

export { UpdateEmail }
