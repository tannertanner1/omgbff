import { auth } from "@/lib/auth"
// import { Menu } from "@/components/menu"
import { Landing } from "@/components/landing"

export default async function Page() {
  const session = await auth()

  return (
    <>
      <div className="inset-ring-background relative flex min-h-fit flex-col inset-ring">
        <main className="mx-auto w-full max-w-5xl grow">
          {/* <div className="flex flex-1 flex-col gap-12 p-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="bg-sidebar aspect-video h-12 w-full rounded-lg"
              />
            ))}
          </div> */}
          <Landing />
        </main>
      </div>
    </>
  )
}

// @note

// import { auth } from "@/lib/auth"
// // import { Menu } from "@/components/menu"
// import { Landing } from "@/components/landing"

// export default async function Page() {
//   const session = await auth()

//   return (
//     <>
//       {/* <div className="relative min-h-screen"> */}
//       <div className="inset-ring-background relative flex min-h-fit flex-col inset-ring">
//         <main className="container mx-auto w-full max-w-5xl grow px-6">
//           {/* <div className="py-10">
//             <div className="space-y-32"> */}
//           {/* <Landing /> */}
//           <div className="flex flex-1 flex-col gap-4 p-4">
//             {Array.from({ length: 24 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
//               />
//             ))}
//           </div>
//           {/* </div>
//           </div> */}
//         </main>
//       </div>
//       {/* </div> */}
//     </>
//   )
// }
