import { PageWrapper } from '@/components/page-wrapper'
import { auth } from '@/lib/auth'
import { Header } from '@/components/header'
import { Form } from './form'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  return (
    <PageWrapper>
      <Header />
      <div className='container flex flex-col items-center py-12'>
        {!session ? <Form /> : redirect('/dashboard')}
      </div>
    </PageWrapper>
  )
}
