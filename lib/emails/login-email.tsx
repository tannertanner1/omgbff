import { EmailTemplate } from '@/components/email-template'

const loginEmail = {
  preview: 'Log in to your account',
  heading: 'Log in to your account',
  body: 'Click the button below to securely log in to your account.',
  button: 'Log in',
  footer: "If you didn't try to log in, you can safely ignore this email."
}

function LoginEmail({ url }: { url: string }) {
  return <EmailTemplate {...loginEmail} url={url} />
}

export { LoginEmail }

// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Html,
//   Preview,
//   Section,
//   Text,
// } from "@react-email/components"
// import { Tailwind } from "@react-email/tailwind"

// interface LoginEmailProps {
//   url: string
// }

// export function LoginEmail({ url }: LoginEmailProps) {
//   return (
//     <Html>
//       <Head />
//       <Preview>Sign in to your account</Preview>
//       <Tailwind>
//         <Body className="bg-white">
//           <Container>
//             <Section>
//               <Text>Click the button below to sign in to your account.</Text>
//               <Button
//                 className="bg-primary px-6 py-3 text-white rounded"
//                 href={url}
//               >
//                 Sign in
//               </Button>
//               <Text className="text-sm text-gray-500">
//                 If you didn't request this email, you can safely ignore it.
//               </Text>
//             </Section>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   )
// }
