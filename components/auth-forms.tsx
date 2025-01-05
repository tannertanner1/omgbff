// 'use client'

// import { useActionState } from 'react'
// import { signin } from '@/lib/actions'
// import { signOut } from '@/lib/auth'
// import { ActionState } from '@/lib/actions'

// const initialState: ActionState = {
//   success: false,
//   message: undefined,
//   error: undefined
// }

// function Signin() {
//   const [state, formAction, isPending] = useActionState(signin, initialState)

//   return (
//     <form className='flex flex-col items-center gap-2' action={formAction}>
//       <input
//         className='border p-2'
//         type='email'
//         name='email'
//         placeholder='Email'
//         required
//       />
//       <button
//         className='rounded-md bg-background p-2 text-primary'
//         type='submit'
//         disabled={isPending}
//       >
//         {isPending ? 'Signing in...' : 'Sign in'}
//       </button>
//       {state.error && <p className='text-red-500'>{state.error}</p>}
//       {state.success && state.message && (
//         <p className='text-green-500'>{state.message}</p>
//       )}
//     </form>
//   )
// }

// function Signout() {
//   const [state, formAction, isPending] = useActionState(signout, initialState)

//   return (
//     <form className='flex flex-col items-center gap-2' action={formAction}>
//       <button
//         className='rounded-md bg-background p-2 text-primary'
//         type='submit'
//         disabled={isPending}
//       >
//         {isPending ? 'Signing out...' : 'Sign out'}
//       </button>
//       {state.error && <p className='text-red-500'>{state.error}</p>}
//       {state.success && state.message && (
//         <p className='text-green-500'>{state.message}</p>
//       )}
//     </form>
//   )
// }

// export { Signin, Signout }

// import { signin } from "@/lib/actions";
// import { signOut } from "@/lib/auth";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// export function SignIn() {
//   return (
//     <div>
//       <form action={signin} className="flex flex-col items-center gap-2">
//         <Input
//           className={cn("p-2")}
//           type="email"
//           name="email"
//           placeholder="Email"
//           autoComplete="email"
//           // required
//           // defaultValue={formData.get("email")}
//         />
//         <Button className="mt-2 w-full" type="submit">
//           Continue
//         </Button>
//       </form>
//     </div>
//   );
// }

// export function SignOut() {
//   return (
//     <div>
//       <form
//         action={async (formData) => {
//           "use server";
//           await signOut();
//         }}
//       >
//         <button type="submit">Sign out</button>
//       </form>
//     </div>
//   );
// }
