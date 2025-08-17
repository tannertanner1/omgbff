import { withForm } from "."

const Phone = withForm({
  defaultValues: {
    phone: [] as Array<{
      label: string
      number: string
    }>,
  },
  render: ({}) => {
    return <></>
  },
})

export { Phone }
