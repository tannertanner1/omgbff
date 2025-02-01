import { Form } from '@/components/form'
import { getOrganizationById } from '@/db/queries'
import { updateAction } from '../../actions'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string }
}) {
  const organization = await getOrganizationById(params.organizationId)

  if (!organization) {
    return null
  }

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true,
      defaultValue: organization.name
    }
  ]

  const editAction = async (prevState: any, formData: FormData) => {
    formData.append('id', organization.id)
    return updateAction(prevState, formData)
  }

  return (
    <Form
      fields={fields}
      action={editAction}
      button='Save'
      data={organization}
    />
  )
}

// import { Form } from '@/components/form'
// import { getOrganizationById } from '@/db/queries'
// import { updateAction, deleteAction } from '../../../actions'

// export default async function Page({
//   params
// }: {
//   params: { userId: string; organizationId: string }
// }) {
//   const organization = await getOrganizationById(params.organizationId)

//   if (!organization) {
//     return null
//   }

//   const fields = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true,
//       defaultValue: organization.name
//     }
//   ]

//   const editAction = async (prevState: any, formData: FormData) => {
//     formData.append('id', organization.id)
//     return updateAction(prevState, formData)
//   }

//   const handleDelete = async (prevState: any, formData: FormData) => {
//     formData.append('id', organization.id)
//     return deleteAction(prevState, formData)
//   }

//   return (
//     <Form
//       fields={fields}
//       action={editAction}
//       deleteAction={handleDelete}
//       button='Save'
//       data={organization}
//     />
//   )
// }

// import { Form } from '@/components/form'
// import { getOrganizationById } from '@/db/queries'
// import { updateAction } from '../../actions'

// export default async function Page({
//   params
// }: {
//   params: { userId: string; organizationId: string }
// }) {
//   const organization = await getOrganizationById(params.organizationId)

//   if (!organization) {
//     return null
//   }

//   const fields = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true,
//       defaultValue: organization.name
//     }
//   ]

//   // Create a wrapped action that includes the organizationId
//   const editAction = async (prevState: any, formData: FormData) => {
//     formData.append('id', organization.id)
//     return updateAction(prevState, formData)
//   }

//   return (
//     <Form
//       fields={fields}
//       action={editAction}
//       button='Save'
//       data={organization}
//     />
//   )
// }

/**
import { Form } from '@/components/form'
import { getOrganizationById } from '@/db/queries'
import { updateAction } from '@/app/(protected)/[userId]/organizations/actions'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string }
}) {
  const organization = await getOrganizationById(params.organizationId)

  if (!organization) {
    return <div>Organization not found</div>
  }

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true
    }
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button='Save'
      initialData={{
        id: organization.id,
        name: organization.name
      }}
    />
  )
}
*/
