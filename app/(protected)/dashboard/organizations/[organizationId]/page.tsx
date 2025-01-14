import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface OrganizationPageProps {
  params: {
    organizationId: string
  }
}

export default async function OrganizationPage({
  params
}: OrganizationPageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-xl font-bold'>Organization Dashboard</h1>
      {/* We'll add organization details and management here */}
    </div>
  )
}
