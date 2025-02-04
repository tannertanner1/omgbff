import { Component } from './component'

export function Form({
  fields,
  action,
  button,
  data,
  title
}: {
  fields: Array<{
    name: string
    label?: string
    type?: 'text' | 'email' | 'number' | 'textarea' | 'hidden'
    required?: boolean
    defaultValue?: string
  }>
  action: (prevState: any, formData: FormData) => Promise<any>
  button?: string
  data?: Record<string, any>
  title?: string
}) {
  return (
    <div className='flex h-fit'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center'>
            <Component
              fields={fields}
              action={action}
              button={button}
              data={data}
              title={title}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
