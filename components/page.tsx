// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// // import ThemeDropdown from "@/components/theme-dropdown";
// import { SigninForm } from "./form";

// export default async function SigninPage() {
//   const session = await auth();
//   // if (!session?.user?.id) return <Form />;
//   if (session) {
//     redirect("/dashboard");
//   }

//   return (
//     <>
//       <header className="sticky flex justify-center border-b">
//         <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6" />
//       </header>
//       <div className="flex flex-col items-center py-12">
//         <SigninForm />
//       </div>
//     </>
//   );
// }

// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// // import ThemeDropdown from "@/components/theme-dropdown";
// // import { SigninForm } from "../components/form";

// export default async function SigninPage() {
//   const session = await auth();
//   // if (!session?.user?.id) return <Form />;
//   if (session) {
//     redirect("/dashboard");
//   }

//   return (
//     <>
//       <header className="sticky flex justify-center border-b">
//         <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6" />
//       </header>
//       <div className="flex flex-col items-center py-12">
//         {/* <SigninForm /> */}
//       </div>
//     </>
//   );
// }
