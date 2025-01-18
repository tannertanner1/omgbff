import { EmailTemplate } from './email-template'

const loginEmail = {
  preview: 'Sign in to your account',
  heading: 'Sign in to your account',
  body: 'Click the button below to securely sign in to your account.',
  button: 'Sign in',
  footer: "If you didn't try to sign in, you can safely ignore this email."
}

function LoginEmail({ url }: { url: string }) {
  return <EmailTemplate {...loginEmail} url={url} />
}

export { LoginEmail }
