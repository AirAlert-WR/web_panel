import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.tsx"
import type {SidebarUserData} from "@/components/custom/embedded/sidebarUser.types.ts";

/**
 * Method for creating an avatar subcomponent
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param user The user data to display
 * @see SidebarUserData
 *
 * @constructor
 */
function AvatarElement(
    {user}: {
      user: SidebarUserData
    }
)
{
  return (
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={user.avatarPath} alt={user.userName} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.userName}</span>
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
        </div>
      </div>
  )
}

/**
 * Method for creating the user management component, displayed in the sidebar
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param data The user data to display
 * @see SidebarUserData
 *
 * @constructor
 */
export function SidebarUserComponent(
    {data}: {
      data: SidebarUserData
    }
) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Avatar element*/}
              <AvatarElement user={data} />

              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">

              {/*Avatar element*/}
              <AvatarElement user={data} />

            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={true}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => data.onLogout()}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
