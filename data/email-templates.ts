const template = (
  heading: string,
  body: string,
  button: string,
  footer: string
): {
  preview: string
  heading: string
  body: string
  button: string
  footer: string
} => ({
  preview: heading,
  heading,
  body,
  button,
  footer,
})

export const emails = {
  verify: template(
    "Verify your email",
    "Click the button below to verify your email.",
    "Verify email",
    "If you didn't try to sign up, you can safely ignore this email."
  ),
  login: template(
    "Sign in to your account",
    "Click the button below to securely sign in to your account.",
    "Sign in",
    "If you didn't try to sign in, you can safely ignore this email."
  ),
  invite: template(
    "You've been invited!",
    "You have been invited to join an organization. Click the button below to accept the invitation.",
    "Accept invite",
    "If you weren't expecting this invitation, you can safely ignore this email."
  ),
  invoice: template(
    "New invoice ready",
    "Your invoice is due for payment.",
    "Pay invoice",
    "If you believe this invoice was issued in error, you can safely ignore this email."
  ),
  update: template(
    "Confirm change of email",
    "Click the button below to confirm the update of your email.",
    "Update email",
    "If you didn't request this change, you can safely ignore this email."
  ),
}

/**
export const email = {
  preview: '',
  heading: '',
  body: '',
  button: '',
  footer: '',
}
*/
