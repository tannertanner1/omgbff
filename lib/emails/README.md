[Resend Server Actions](https://resend.com/changelog/adding-support-for-nextjs-14#using-server-actions)

```ts
import { Resend } from "resend";

export default async function Page() {
  async function send() {
    "use server";

    const resend = new Resend(process.env.AUTH_RESEND_KEY);

    const { data } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello World",
      html: "<strong>It works!</strong>",
    });

    console.log(data);
  }

  return (
    <form action={send}>
      <button type="submit">Send email</button>
    </form>
  );
}
```

[React Email Templates](https://demo.react.email/preview/notifications/vercel-invite-user)

```ts
import * as React from "react";
import { Resend } from "resend";

interface EmailTemplateProps {
  firstName: string;
}
const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);

export default async function ContactForm() {
  async function send() {
    "use server";

    const resend = new Resend(process.env._API_KEY);

    const { data } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello World",
      react: EmailTemplate({ firstName: "John" }),
    });

    console.log(data);
  }

  return (
    <form action={send}>
      <button type="submit">Send email</button>
    </form>
  );
}
```
