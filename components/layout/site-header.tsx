import { CustomTrigger } from "./custom-trigger"
import { ThemeSelector } from "./theme-selector"
import { ModeToggle } from "./mode-toggle"

function SiteHeader() {
  return (
    <header className="site-header mx-2 flex items-center justify-between">
      <div className="ml-1 flex items-center">
        <CustomTrigger />
      </div>
      <div className="mr-1 flex items-center gap-2">
        <ThemeSelector />
        <ModeToggle />
      </div>
    </header>
  )
}

export { SiteHeader }

// @note

// import { CustomTrigger } from "./custom-trigger"
// import { ThemeSelector } from "./theme-selector"
// import { ModeToggle } from "./mode-toggle"

// function SiteHeader() {
//   return (
//     <header className="bg-sidebar flex h-12 shrink-0 items-center justify-between px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//       {/* <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <CustomerTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         <h1 className="text-base font-medium">Documents</h1>
//       </div> */}
//       <div className="flex items-center">
//         <CustomTrigger />
//       </div>
//       <div className="ml-auto flex items-center gap-4">
//         <ThemeSelector />
//         <ModeToggle />
//       </div>
//     </header>
//   )
// }

// export { SiteHeader }
