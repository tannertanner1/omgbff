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
  Tailwind,
} from "@react-email/components";

export function EmailTemplate({
  preview,
  heading,
  body,
  button,
  url,
  footer,
}: {
  preview: string;
  heading: string;
  body: string;
  button: string;
  url: string;
  footer: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[448px] px-5 py-5">
            <Heading className="mb-4 text-left font-serif text-xl font-bold text-zinc-950">
              {heading}
            </Heading>
            <Text className="mb-6 text-left text-[16px] text-muted-foreground">
              {body}
            </Text>
            <Section className="mb-8 text-left align-middle">
              <Button
                className="block max-w-[320px] rounded-full bg-zinc-950 px-[23px] py-[11px] text-center text-[15px] font-medium tracking-wide text-white no-underline"
                href={url}
              >
                {button}
              </Button>
            </Section>
            <Text className="mb-6 text-left text-[14px] text-muted">
              {footer}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/**

import React from "react";

function EmailTemplate({
  preview,
  heading,
  body,
  button,
  url,
  footer,
}: {
  preview: string;
  heading: string;
  body: string;
  button: string;
  url: string;
  footer: string;
}) {
  return (
    <div>
      <div style={{ maxWidth: "448px", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{
            marginBottom: "16px",
            fontFamily: "serif",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#18181b",
          }}
        >
          {heading}
        </h1>
        <p style={{ marginBottom: "24px", fontSize: "16px", color: "#71717a" }}>
          {body}
        </p>
        <div style={{ marginBottom: "32px", textAlign: "left" }}>
          <a
            href={url}
            style={{
              display: "inline-block",
              maxWidth: "320px",
              padding: "11px 23px",
              backgroundColor: "#18181b",
              color: "white",
              fontSize: "15px",
              fontWeight: "500",
              textDecoration: "none",
              borderRadius: "9999px",
            }}
          >
            {button}
          </a>
        </div>
        <p style={{ marginBottom: "24px", fontSize: "14px", color: "#a1a1aa" }}>
          {footer}
        </p>
      </div>
    </div>
  );
}

export { EmailTemplate };

*/
