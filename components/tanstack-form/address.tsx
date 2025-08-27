import { withForm } from "."
import { data } from "@/app/tanstack-form/form"
import {
  ADDRESS,
  COUNTRY,
  STATE,
  PROVINCE,
  PREFECTURE,
  CONFIG,
} from "@/data/customer-fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const Address = withForm({
  ...data,
  render: function Render({ form }) {
    return (
      <div>
        <form.Field name="address" mode="array">
          {(field) => (
            <div className="pt-4">
              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="rounded-[0.625rem] border border-dashed"
                >
                  <Badge className="bg-accent border-accent text-primary rounded-full border">
                    {form.getFieldValue(`address[${i}].label`) ||
                      `Address ${i + 1}`}
                  </Badge>
                  <form.AppField name={`address[${i}].label`}>
                    {(subField) => (
                      <subField.Select
                        label="Label"
                        required
                        options={ADDRESS.filter(
                          (label) =>
                            !form
                              .getFieldValue("address")
                              ?.some(
                                (addr, idx) => idx !== i && addr.label === label
                              )
                        )}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name={`address[${i}].line1`}>
                    {(subField) => (
                      <subField.Input label="Street line 1" required />
                    )}
                  </form.AppField>
                  <form.AppField name={`address[${i}].line2`}>
                    {(subField) => <subField.Input label="Street line 2" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].city`}>
                    {(subField) => <subField.Input label="City" required />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].region`}>
                    {(subField) => {
                      const country = form.getFieldValue(
                        `address[${i}].country`
                      )
                      const options =
                        country === "Canada"
                          ? PROVINCE
                          : country === "United States"
                            ? STATE
                            : country === "Japan"
                              ? PREFECTURE
                              : []
                      return (
                        <subField.Select
                          label="Region"
                          required
                          options={options}
                        />
                      )
                    }}
                  </form.AppField>
                  <form.AppField name={`address[${i}].postal`}>
                    {(subField) => {
                      const country = form.getFieldValue(
                        `address[${i}].country`
                      )
                      const config = CONFIG[country as keyof typeof CONFIG]
                      return (
                        <subField.Mask
                          label={config.postalLabel}
                          required
                          mask={config.postalMask}
                          definitions={{ a: /[A-Za-z]/, "9": /[0-9]/ }}
                        />
                      )
                    }}
                  </form.AppField>
                  <form.AppField
                    name={`address[${i}].country`}
                    listeners={{
                      onChange: ({ value }) => {
                        const config = CONFIG[value as keyof typeof CONFIG]
                        if (config) {
                          form.setFieldValue(
                            `address[${i}].region`,
                            config.defaultRegion
                          )
                          // Backup retry if field wasn't updated
                          setTimeout(() => {
                            const currentRegion = form.getFieldValue(
                              `address[${i}].region`
                            )
                            if (currentRegion !== config.defaultRegion) {
                              form.setFieldValue(
                                `address[${i}].region`,
                                config.defaultRegion
                              )
                            }
                          }, 100)
                        }
                      },
                    }}
                  >
                    {(subField) => (
                      <subField.Select
                        label="Country"
                        required
                        options={COUNTRY}
                      />
                    )}
                  </form.AppField>
                  <div className="my-8">
                    <Button
                      type="button"
                      variant="outline"
                      className="[&[data-slot=button]]:bg-background [&[data-slot=button]]:hover:text-background border transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-full [&[data-slot=button]]:border-[#DB4437] [&[data-slot=button]]:text-[#DB4437] [&[data-slot=button]]:hover:bg-[#DB4437]"
                      onClick={() => field.removeValue(i)}
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
                    form.getFieldValue("address")?.map((addr) => addr.label) ||
                    []
                  const nextLabel =
                    ADDRESS.find((label) => !usedLabels.includes(label)) ||
                    ADDRESS[0]
                  field.pushValue({
                    ...data.defaultValues.address[0],
                    label: nextLabel,
                  })
                }}
                disabled={
                  form.getFieldValue("address")?.length >= ADDRESS.length
                }
              >
                Add
              </Button>
            </div>
          )}
        </form.Field>
      </div>
    )
  },
})

export { Address }
