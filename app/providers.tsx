"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      {children}
      <ToasterProvider />
    </ThemeProvider>
  );
}

function ToasterProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      closeButton
      position="top-center"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}

// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { type ThemeProviderProps } from "next-themes";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Toaster } from "@/components/ui/sonner";

// export function Providers({
//   children,
//   ...props
// }: ThemeProviderProps & { children: React.ReactNode }) {
//   return (
//     <NextThemesProvider {...props}>
//       <TooltipProvider>
//         {children}
//         <Toaster />
//       </TooltipProvider>
//     </NextThemesProvider>
//   );
// }

// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { type ThemeProviderProps } from "next-themes/dist/types";
// export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }

// import { TooltipProvider } from "@/components/ui/tooltip";
// export default function Providers({ children }: { children: React.ReactNode }) {
//   return <TooltipProvider>{children}</TooltipProvider>;
// }

// import { Toaster } from "@/components/ui/sonner";
// <Toaster />
