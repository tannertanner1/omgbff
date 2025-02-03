import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserOrganizations } from '@/db/queries'
import { Component } from './component'

export default async function Page({
  params: paramsPromise
}: {
  params: Promise<{ userId: string }>
}) {
  const [session, params] = await Promise.all([auth(), paramsPromise])
  if (!session) {
    redirect('/login')
  }

  const { userId } = params
  if (session.user.id !== userId) {
    redirect(`/${session.user.id}/organizations`)
  }

  const userOrganizations = await getUserOrganizations()
  const organizations = userOrganizations.map(uo => ({
    ...uo.organization,
    userId
  }))

  return <Component organizations={organizations} userId={userId} />
}
