import { CustomTrigger } from "./custom-trigger"
import { ModeToggle } from "@/components/mode-toggle"
import { Theme } from "@/components/theme"

function SiteHeader() {
  return (
    // <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
    //   <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    //     <SidebarTrigger className="-ml-1" />
    //     <Separator
    //       orientation="vertical"
    //       className="mx-2 data-[orientation=vertical]:h-4"
    //     />
    //     <h1 className="text-base font-medium">Documents</h1>
    //   </div>
    // </header>

    // <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
    //   <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    //     <CustomTrigger className="-ml-1" />
    //   </div>
    // </header>

    <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
      <div className="flex items-center">
        <CustomTrigger className="-ml-1" />
      </div>
      <div className="flex items-center">
        {/* <ModeToggle /> */}
        <Theme />
      </div>
    </header>
  )
}

export { SiteHeader }
