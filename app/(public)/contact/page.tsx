import { Form } from './form'

export default async function Page() {
  return (
    <div className='mx-auto w-[400px] flex-1 px-4'>
      <div className='flex items-center gap-2 self-center'>
        <Form />
      </div>
    </div>
  )
}
