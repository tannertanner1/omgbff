import Link from "next/link"
import { redirect } from "next/navigation"
import { IconCircleDot } from "@tabler/icons-react"
import { auth } from "@/lib/auth"
import { Form, type Field } from "@/components/form"
import { login } from "./actions"

export default async function Page() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  const fields: Field[] = [
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      required: true,
    },
  ]

  return (
    <>
      <div className="mt-12 flex h-fit flex-col items-center gap-2">
        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex items-center justify-center rounded-md">
            <IconCircleDot className="h-12 w-12" />
          </div>
          <span className="sr-only">OMG BFF</span>
        </Link>
        <h1 className="mb-2 text-2xl font-medium tracking-wide">Welcome</h1>
      </div>
      <Form fields={fields} action={login} button="Continue" />
      <div className="text-muted-foreground container mx-auto mt-7 text-center text-xs text-balance">
        <div>By clicking continue, you agree to our</div>
        <div>
          <Link
            href="/terms"
            className="after:bg-muted-foreground relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="after:bg-muted-foreground relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </>
  )
}

{
  /* <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary'>
  By clicking continue, you agree to our
  <a href='#'>Terms of Service</a>{' '}and <a href='#'>Privacy Policy</a>.
</div> */
}
