import { withForm } from "."
import { data } from "@/app/tanstack-form/form"
import { PHONE } from "@/data/customer-fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const Phone = withForm({
  ...data,
  render: function Render({ form }) {
    return (
      <>
        <form.Field name="phone" mode="array">
          {(field) => (
            <div className="py-4">
              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="rounded-[0.625rem] border border-dashed"
                >
                  <Badge className="bg-accent border-accent text-primary rounded-full border">
                    {form.getFieldValue(`phone[${i}].label`) ||
                      `Phone ${i + 1}`}
                  </Badge>
                  <form.AppField
                    name={`phone[${i}].label`}
                    listeners={{
                      onChange: ({ value }) => {
                        if (!value) {
                          form.setFieldValue(`phone[${i}].label`, PHONE[0])
                        }
                      },
                    }}
                  >
                    {(subField) => (
                      <subField.Select
                        label="Label"
                        required
                        options={PHONE.filter(
                          (label) =>
                            !form
                              .getFieldValue("phone")
                              ?.some(
                                (phone, idx) =>
                                  idx !== i && phone.label === label
                              )
                        )}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name={`phone[${i}].number`}>
                    {(subField) => (
                      <subField.Mask
                        label="Number"
                        required
                        mask="(000) 000-0000"
                        definitions={{ "0": /[0-9]/ }}
                      />
                    )}
                  </form.AppField>
                  <div className="my-8">
                    <Button
                      type="button"
                      variant="outline"
                      className="[&[data-slot=button]]:bg-background [&[data-slot=button]]:hover:text-background border transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-full [&[data-slot=button]]:border-[#DB4437] [&[data-slot=button]]:text-[#DB4437] [&[data-slot=button]]:hover:bg-[#DB4437]"
                      onClick={() => field.removeValue(i)}
                      disabled={field.state.value.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="[&[data-slot=button]]:border-muted [&[data-slot=button]]:hover:border-primary [&[data-slot=button]]:bg-muted [&[data-slot=button]]:text-primary [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary border bg-transparent transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-full"
                onClick={() => {
                  const usedLabels =
                    form.getFieldValue("phone")?.map((phone) => phone.label) ||
                    []
                  const nextLabel =
                    PHONE.find((label) => !usedLabels.includes(label)) ||
                    PHONE[0]
                  field.pushValue({
                    ...data.defaultValues.phone[0],
                    label: nextLabel,
                  })
                }}
                disabled={form.getFieldValue("phone")?.length >= PHONE.length}
              >
                Add
              </Button>
            </div>
          )}
        </form.Field>
      </>
    )
  },
})

export { Phone }
