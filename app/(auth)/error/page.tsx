"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

enum Error {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
}

const errorMap: Record<Error, string> = {
  [Error.Configuration]:
    "There was a problem with the authentication configuration. Please contact us if this error persists.",
  [Error.AccessDenied]:
    "Access denied. You do not have permission to access this resource.",
  [Error.Verification]:
    "The verification process failed. Please try signing in again.",
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Authentication Error
        </h2>
        <Alert variant="destructive">
          {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
          <AlertDescription>
            {errorMap[error] ||
              "An unexpected error occurred. Please try again or contact support."}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <a
            href="/signin"
            className="font-medium text-blue-600 hover:underline"
          >
            Return to sign in
          </a>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useSearchParams } from "next/navigation";

// enum Error {
//   Configuration = "Configuration",
// }

// const errorMap = {
//   [Error.Configuration]: (
//     <p>
//       There was a problem when trying to authenticate. Please contact us if this
//       error persists. Unique error code:{" "}
//       <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
//     </p>
//   ),
// };

// export default function AuthErrorPage() {
//   const search = useSearchParams();
//   const error = search.get("error") as Error;

//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center">
//       <a
//         href="#"
//         className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
//       >
//         <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
//           Something went wrong
//         </h5>
//         <div className="font-normal text-gray-700 dark:text-gray-400">
//           {errorMap[error] || "Please contact us if this error persists."}
//         </div>
//       </a>
//     </div>
//   );
// }

// "use client";

// import { useSearchParams } from "next/navigation";

// enum Error {
//   Configuration = "Configuration",
// }

// const errorMap = {
//   [Error.Configuration]: (
//     <p>
//       There was a problem when trying to authenticate. Please contact us if this
//       error persists. Unique error code:{" "}
//       <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
//     </p>
//   ),
// };

// export default function AuthErrorPage() {
//   const search = useSearchParams();
//   const error = search.get("error") as Error;

//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center">
//       <a
//         href="#"
//         className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
//       >
//         <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
//           Something went wrong
//         </h5>
//         <div className="font-normal text-gray-700 dark:text-gray-400">
//           {errorMap[error] || "Please contact us if this error persists."}
//         </div>
//       </a>
//     </div>
//   );
// }

/**

// @note ???

"use client";

import { useSearchParams } from "next/navigation";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{" "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
    </p>
  ),
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <a
        href="#"
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Something went wrong
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {errorMap[error] || "Please contact us if this error persists."}
        </div>
      </a>
    </div>
  );
}

*/

// @note ?!

// import { AuthError } from "next-auth";
// import { ErrorCard } from "@/components/error-card";

// export default function AuthErrorPage({
//   searchParams,
// }: {
//   searchParams: { error?: string };
// }) {
//   const error = searchParams.error ? searchParams.error : null;
//   let errorMessage: string;

//   if (error) {
//     switch (error) {
//       case "Configuration":
//         errorMessage = "There is a problem with the server configuration.";
//         break;
//       case "AccessDenied":
//         errorMessage = "You do not have permission to sign in.";
//         break;
//       case "Verification":
//         errorMessage = "The sign in link is no longer valid.";
//         break;
//       default:
//         errorMessage = "An unknown error occurred.";
//     }
//   } else {
//     errorMessage = "An unknown error occurred.";
//   }

//   return <ErrorCard title="Authentication Error" description={errorMessage} />;
// }
