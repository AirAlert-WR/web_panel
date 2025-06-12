import * as React from "react"

import {
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarGroupContent,
    SidebarMenuItem,
    SidebarMenu,
    SidebarMenuButton,
    SidebarContent,
    Sidebar,
} from "@/components/ui/sidebar.tsx"

//import { SidebarUserComponent } from "@/components/custom/embedded/sidebarUser.tsx"

import * as Pages from "@/pages"
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import type {SidebarUserData} from "@/components/custom/embedded/sidebarUser.types.ts";
import { Button } from "@aws-amplify/ui-react";

function NavigationSection(
    { ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>
) {
    const items= Pages.usePageStore.getState().pages
  return (
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                      variant="default" disabled={!item.enabled}
                      onClick={() =>  Pages.usePageStore.getState().setCurrentPage(item.id)}>

                    {item.icon && <item.icon />}
                    <span>{item.title}</span>

                  </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
  )
}

export function MySidebar(
    { userData, ...props }: {
        userData: SidebarUserData
    } & React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Application caption as a button*/}
            <SidebarMenuButton
              className="bg-primary text-primary-foreground h-56 flex flex-col items-center justify-center gap-1 px-2 py-3 text-center"
              onClick={() =>  Pages.usePageStore.getState().setCurrentPage(Pages.DefaultPageID)}
            >
                <Avatar className="h-40 w-40">
                    <AvatarImage src="/logo.png" alt="App Logo" />
                    <AvatarFallback>AA</AvatarFallback>
                </Avatar>
              <span className="text-base font-semibold">AirAlert Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>

        {/* Primary navigation items */}
        <NavigationSection />

        {/* Secondary navigation items TODO OPTIONALLY */}
        {/*<NavigationSection id={"NavigationSecondary"} items={data.navSecondary} className={"mt-auto"}/>*/}

      </SidebarContent>
      <SidebarFooter>

        {/* User account button */}
          {/*<SidebarUserComponent data={userData} />*/}
          <Button variation="warning" colorTheme="info" onClick={() => userData.onLogout()}>Logout</Button>


      </SidebarFooter>
    </Sidebar>
  )
}
