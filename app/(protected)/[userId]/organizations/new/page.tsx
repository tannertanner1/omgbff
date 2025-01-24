import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Form } from '@/components/form'
import { createAction } from './actions'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  if (session.user.id !== params.userId) {
    redirect(`/${session.user.id}/organizations/new`)
  }

  const fields = [
    {
      name: 'name',
      label: 'Organization Name',
      type: 'text' as const,
      required: true
    }
  ]

  return (
    <div className='min-h-screen bg-black'>
      <div className='mx-auto max-w-5xl p-4'>
        <h1 className='mb-8 text-2xl font-bold text-white'>
          Create New Organization
        </h1>
        <Form
          fields={fields}
          action={createAction}
          button='Create Organization'
          redirectPath={`/${params.userId}/organizations`}
        />
      </div>
    </div>
  )
}

// import { Form } from '@/components/form'
// import { createAction } from './actions'

// export default function Page() {
//   const fields = [
//     {
//       name: 'name',
//       label: 'Name',
//       required: true
//     }
//   ]

//   return (
//     <div className='mx-auto max-w-5xl px-4'>
//       <div className='flex items-center justify-center'>
//         <Form fields={fields} action={createAction} button='Create' />
//       </div>
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { createAction } from './actions'

// export default async function Page({ params }: { params: { userId: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userId = params.userId

//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/new`)
//   }

//   const fields: Field[] = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true
//     }
//   ]

//   return (
//     <div className='mx-auto max-w-2xl space-y-8 p-8'>
//       <h1 className='text-3xl font-bold'>Create New Organization</h1>
//       <Form
//         title='New Organization'
//         description='Create a new organization'
//         fields={fields}
//         action={createAction}
//         redirect={`/${userId}/organizations`}
//       />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { createAction } from './actions'

// export default async function Page({ params }: { params: { userId: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userId = await params.userId

//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/new`)
//   }

//   const fields: Field[] = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true
//     }
//   ]

//   return (
//     <div className='mx-auto max-w-2xl space-y-8 p-8'>
//       <h1 className='text-3xl font-bold'>Create New Organization</h1>
//       <Form
//         title='New Organization'
//         description='Create a new organization'
//         fields={fields}
//         action={(prevState, formData) =>
//           createAction(userId, prevState, formData)
//         }
//         redirect={`/${userId}/organizations`}
//       />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { createAction } from './actions'

// export default async function Page({ params }: { params: { userId: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userId = params.userId as string

//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/new`)
//   }

//   const fields: Field[] = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true
//     }
//   ]

//   return (
//     <div className='mx-auto max-w-2xl space-y-8 p-8'>
//       <h1 className='text-3xl font-bold'>Create New Organization</h1>
//       <Form
//         title='New Organization'
//         description='Create a new organization'
//         fields={fields}
//         action={(prevState, formData) =>
//           createAction(userId, prevState, formData)
//         }
//         redirect={`/${userId}/organizations`}
//       />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { Form } from '@/components/form'
// import { createAction } from './actions'

// export default async function Page({ params }: { params: { userId: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userId = params.userId as string

//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/new`)
//   }

//   const fields = [{ name: 'name', label: 'Name', type: 'text', required: true }]

//   return (
//     <div className='mx-auto max-w-2xl space-y-8 p-8'>
//       <h1 className='text-3xl font-bold'>Create New Organization</h1>
//       <Form
//         title='New Organization'
//         description='Create a new organization'
//         fields={fields}
//         action={(prevState, formData) =>
//           createAction(userId, prevState, formData)
//         }
//         redirect={`/${userId}/organizations`}
//       />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { CreateForm } from './form'

// export default async function Page({ params }: { params: { userId: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userId = params.userId as string

//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/new`)
//   }

//   return (
//     <div className='mx-auto max-w-2xl space-y-8 p-8'>
//       <h1 className='text-3xl font-bold'>Organization</h1>
//       <CreateForm userId={userId} />
//     </div>
//   )
// }
