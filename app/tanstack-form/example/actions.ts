"use server"

import {
  createServerValidate,
  ServerValidateError,
} from "@tanstack/react-form/nextjs"
import { Resend } from "resend"
import { data, schema } from "./form"
import { DOMAIN } from "@/data/public-routes"

const serverValidate = createServerValidate({
  ...data,
  onServerValidate: ({ value }) => {
    // console.log("validatedData:", value)
  },
})

const resend = new Resend(process.env.RESEND_API_KEY)

async function serverAction(prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData)

    // Extract files directly from FormData rather than TanStack Form validation handling File objects
    const files = formData.getAll("files") as File[]

    // Validate file size limit
    if (files.length > 0) {
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
      if (totalBytes > 10 * 1024 * 1024) {
        return {
          errors: [{ message: "Max. 10MB" }],
          values: validatedData,
        }
      }
    }
    const { name, email, message } = validatedData
    const replyTo = name ? `${name} <${email}>` : email
    const subject = name ? `Message from ${name}` : `Message from ${DOMAIN}`

    // Process attachments if any
    const attachments =
      files && files.length > 0
        ? await Promise.all(
            files.map(async (file: File) => {
              const buffer = Buffer.from(await file.arrayBuffer())
              return {
                content: buffer.toString("base64"),
                filename: file.name,
              }
            })
          )
        : []

    // prettier-ignore
    console.log("FormData:", JSON.stringify({...Object.fromEntries(Object.entries(validatedData).filter(([key]) => !key.startsWith("$ACTION_") && key !== "files")), files: files.map(f => f.name)}, null, 2))

    // Send email
    await resend.emails.send({
      from: `${config.name} <${config.email}>` as string,
      to: [`${config.name} <${config.email}>` as string],
      replyTo: replyTo,
      subject: subject,
      html: `<p>${message}</p>`,
      attachments: attachments,
    })

    return {
      // values: {
      //   name: "",
      //   email: "",
      //   message: "",
      //   files: [],
      // },
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }
    console.error("Error:", e)
    return {
      errors: [{ message: "Something went wrong. Please try again." }],
    }
  }
}

export { serverAction }
