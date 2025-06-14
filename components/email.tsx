import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export const Email = ({
  preview,
  heading,
  body,
  url,
  button,
  footer,
}: {
  preview: string
  heading: string
  body: string
  url?: string
  button: string
  footer: string
}) => {
  const styles = {
    body: {
      backgroundColor: "#fff",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      padding: "20px",
    },
    container: {
      margin: "0 auto",
      maxWidth: "560px",
    },
    heading: {
      fontSize: "24px",
      letterSpacing: "-0.5px",
      lineHeight: "1.3",
      fontWeight: "400",
      color: "#000",
      padding: "4px 0 0",
    },
    text: {
      margin: "0 0 15px",
      fontSize: "16px",
      lineHeight: "1.4",
      color: "#000",
    },
    button: {
      backgroundColor: "#000",
      borderRadius: "3px",
      fontWeight: "400",
      color: "#fff",
      fontSize: "16px",
      textDecoration: "none",
      textAlign: "center" as const,
      display: "block",
      padding: "11px 23px",
      margin: "0 auto",
    },
    footer: {
      fontSize: "14px",
      color: "#000",
    },
  }

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{heading}</Heading>
          <Text style={styles.text}>{body}</Text>
          <Section>
            <Button style={styles.button} href={url}>
              {button}
            </Button>
          </Section>
          <Text style={styles.footer}>{footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Heading,
//   Html,
//   Preview,
//   Section,
//   Text
// } from '@react-email/components'
// import { IconCircle } from '@tabler/icons-react'

// export const Email = ({
//   preview,
//   heading,
//   body,
//   url,
//   button,
//   footer
// }: {
//   preview: string
//   heading: string
//   body: string
//   url: string
//   button: string
//   footer: string
// }) => (
//   <Html>
//     <Head />
//     <Preview>{preview}</Preview>
//     <Body
//       style={{
//         backgroundColor: '#fff',
//         fontFamily:
//           '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
//         padding: '20px'
//       }}
//     >
//       <Container
//         style={{
//           margin: '0 auto',
//           maxWidth: '560px'
//         }}
//       >
//         <IconCircle
//           style={{
//             display: 'inline-block',
//             margin: '0 auto 16px',
//             marginBottom: '0px',
//             color: '#000',
//             width: '40px',
//             height: '40px'
//           }}
//         />
//         <Heading
//           style={{
//             fontSize: '24px',
//             letterSpacing: '-0.5px',
//             lineHeight: '1.3',
//             fontWeight: '400',
//             color: '#000',
//             padding: '4px 0 0'
//           }}
//         >
//           {heading}
//         </Heading>
//         <Text
//           style={{
//             margin: '0 0 15px',
//             fontSize: '16px',
//             lineHeight: '1.4',
//             color: '#000'
//           }}
//         >
//           {body}
//         </Text>
//         <Section
//           style={{
//             padding: '20px 0 16px'
//           }}
//         >
//           <Button
//             style={{
//               backgroundColor: '#000',
//               borderRadius: '3px',
//               fontWeight: '400',
//               color: '#fff',
//               fontSize: '16px',
//               textDecoration: 'none',
//               textAlign: 'center' as const,
//               display: 'block',
//               padding: '11px 23px',
//               margin: '0 auto'
//             }}
//             href={url}
//           >
//             {button}
//           </Button>
//         </Section>
//         <Text
//           style={{
//             fontSize: '14px',
//             color: '#000'
//           }}
//         >
//           {footer}
//         </Text>
//       </Container>
//     </Body>
//   </Html>
// )
