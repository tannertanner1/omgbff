import { withForm } from "."
import { data } from "@/app/tanstack-form/form"
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
                  className="rounded-[0.625rem] border border-dashed pt-2"
                >
                  <Badge className="bg-accent border-accent text-primary rounded-full border">
                    Address {i + 1}
                  </Badge>
                  <form.AppField name={`address[${i}].label`}>
                    {(subField) => <subField.Input label="Label" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].line1`}>
                    {(subField) => <subField.Input label="Street line 1" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].line2`}>
                    {(subField) => <subField.Input label="Street line 2" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].city`}>
                    {(subField) => <subField.Input label="City" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].region`}>
                    {(subField) => <subField.Input label="Region" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].postal`}>
                    {(subField) => <subField.Input label="Postal code" />}
                  </form.AppField>
                  <form.AppField name={`address[${i}].country`}>
                    {(subField) => <subField.Input label="Country" />}
                  </form.AppField>
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="[&[data-slot=button]]:bg-background [&[data-slot=button]]:hover:text-background mt-6 border transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-full [&[data-slot=button]]:border-[#DB4437] [&[data-slot=button]]:text-[#DB4437] [&[data-slot=button]]:hover:bg-[#DB4437]"
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
                className="[&[data-slot=button]]:border-muted [&[data-slot=button]]:hover:border-primary [&[data-slot=button]]:bg-muted [&[data-slot=button]]:text-primary [&[data-slot=button]]:hover:bg-background [&[data-slot=button]]:hover:text-primary mt-4 border bg-transparent transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-full"
                onClick={() =>
                  field.pushValue({
                    label: "",
                    line1: "",
                    line2: "",
                    city: "",
                    region: "",
                    postal: "",
                    country: "",
                  })
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
