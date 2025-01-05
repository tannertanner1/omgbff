import { EmailTemplate } from '@/components/email-template'

const verifyEmail = {
  preview: 'Verify your email',
  heading: 'Verify your email',
  body: 'Click the button below to verify your email.',
  button: 'Verify email',
  footer: "If you didn't try to sign up, you can safely ignore this email."
}

function VerifyEmail({ url }: { url: string }) {
  return <EmailTemplate {...verifyEmail} url={url} />
}

export { VerifyEmail }
