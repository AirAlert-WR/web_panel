import { Separator } from "@/components/ui/separator.tsx"
import { SidebarTrigger } from "@/components/ui/sidebar.tsx"
import { Button } from "@/components/ui/button.tsx";

import * as Icons from "@tabler/icons-react"

import * as Pages from "@/pages"

export function MySiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 size-10" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-5xl m-3 font-light">{Pages.useCurrentPage().title}</h1>
      </div>
      <div className="ml-auto flex gap-2 w-[320px] shrink-0">
          <h1 className="text-sm font-medium content-center">Copyright (C) 2025 AirAlert</h1>
          <Button asChild size="lg" className="hidden sm:flex" color={"black"}>
          <a
              href="https://github.com/AirAlert-WR"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
          >
            <Icons.IconBrandGithub />
            GitHub
          </a>
        </Button>
      </div>
    </header>
  )
}
