import {
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Heading,
  Button,
  Hr,
  Container,
} from "@react-email/components";

<>
  <Img
    alt="Atoms Vacuum Canister"
    className="rounded-[12px] [margin:12px_auto_12px]"
    height={150}
    src="https://react.email/static/atmos-vacuum-canister.jpg"
  />
  <Img
    alt="Atoms Vacuum Canister"
    className="rounded-[12px] [margin:12px_auto_12px]"
    height={200}
    src="https://react.email/static/atmos-vacuum-canister.jpg"
  />
  <Img
    alt="Atoms Vacuum Canister"
    className="rounded-[12px] [margin:12px_auto_12px]"
    height={250}
    src="https://react.email/static/atmos-vacuum-canister.jpg"
  />

  <Container className="bg-gray-400">
    <Text className="px-[12px] text-white">
      Hello, I am a container. I keep content centered and maintain it to a
      maximum width while still taking up as much space as possible!
    </Text>
  </Container>

  <Section className="px-[32px] py-[40px]">
    <Row>
      <Column className="w-[80%]">
        <Img
          alt="React Email logo"
          height="42"
          src="https://react.email/static/logo-without-background.png"
        />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column>
            <Link href="#">
              <Img
                alt="X"
                className="mx-[4px]"
                height="36"
                src="https://react.email/static/x-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Instagram"
                className="mx-[4px]"
                height="36"
                src="https://react.email/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Facebook"
                className="mx-[4px]"
                height="36"
                src="https://react.email/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>

  <Text className="text-[24px] font-semibold leading-[32px] text-indigo-400">
    Amazing content
  </Text>
  <Text>
    This is the actual content that the accented text above refers to.
  </Text>

  <Button
    className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
    href="https://react.email"
  >
    Get started
  </Button>

  <Row>
    <Column align="center">
      <Row>
        <td align="center" className="w-1/2 pr-[16px]" colSpan={1}>
          <Button
            className="box-border w-full rounded-[8px] bg-indigo-600 px-[20px] py-[12px] text-center font-semibold text-white"
            href="https://react.email"
          >
            Login
          </Button>
        </td>
        <td align="center" className="w-1/2 pl-[16px]" colSpan={1}>
          <Button
            className="box-border w-full rounded-[8px] border border-solid border-gray-200 bg-white px-[20px] py-[12px] text-center font-semibold text-gray-900"
            href="https://react.email"
          >
            Sign up
          </Button>
        </td>
      </Row>
    </Column>
  </Row>

  <Text>
    This is <Link href="https://react.email">React Email</Link>
  </Text>

  <table
    align="center"
    border={0}
    cellPadding="0"
    cellSpacing="0"
    className="my-[16px] h-[424px] rounded-[12px] bg-blue-600"
    role="presentation"
    style={{
      // This url must be in quotes for Yahoo
      backgroundImage: "url('/static/my-image.png')",
      backgroundSize: "100% 100%",
    }}
    width="100%"
  >
    <tbody>
      <tr>
        <td align="center" className="p-[40px] text-center">
          <Text className="m-0 font-semibold text-gray-200">New article</Text>
          <Heading as="h1" className="m-0 mt-[4px] font-bold text-white">
            Artful Accents
          </Heading>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-white">
            Uncover the power of accent furniture in transforming your space
            with subtle touches of style, personality, and functionality, as we
            explore the art of curating captivating accents.
          </Text>
          <Button
            className="mt-[24px] rounded-[8px] border border-solid border-gray-200 bg-white px-[40px] py-[12px] font-semibold text-gray-900"
            href="https://react.email"
          >
            Read more
          </Button>
        </td>
      </tr>
    </tbody>
  </table>

  <Text>Before divider</Text>
  <Hr className="my-[16px] border-t-2 border-gray-300" />
  <Text>After divider</Text>

  <Section>
    <Row>
      <Column colSpan={4}>
        <Img
          alt="React Email logo"
          height="42"
          src="https://react.email/static/logo-without-background.png"
        />
        <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
          Acme corporation
        </Text>
        <Text className="mb-[0px] mt-[4px] text-[16px] leading-[24px] text-gray-500">
          Think different
        </Text>
      </Column>
      <Column align="left" className="table-cell align-bottom">
        <Row className="table-cell h-[44px] w-[56px] align-bottom">
          <Column className="pr-[8px]">
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="https://react.email/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column className="pr-[8px]">
            <Link href="#">
              <Img
                alt="X"
                height="36"
                src="https://react.email/static/x-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Instagram"
                height="36"
                src="https://react.email/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
        <Row>
          <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-500">
            123 Main Street Anytown, CA 12345
          </Text>
          <Text className="mb-[0px] mt-[4px] text-[16px] font-semibold leading-[24px] text-gray-500">
            mail@example.com +123456789
          </Text>
        </Row>
      </Column>
    </Row>
  </Section>
</>;
