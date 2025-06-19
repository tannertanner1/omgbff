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
      borderRadius: "9999px",
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
