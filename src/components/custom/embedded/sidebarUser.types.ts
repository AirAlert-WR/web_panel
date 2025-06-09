/**
 * Const definition of a user entry
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member userName The name of the user
 * @member email  the user's email
 * @member avatarPath the path to the avatar picture (inside the web page)
 * @member onLogout the event function if a logout procedure is requested
 */
export const SidebarUserData = {
    userName: "anUser",
    email: "anEmail",
    avatarPath: "/logo.png",
    onLogout: () => {}
}
/**
 * Type definition on the base of the const
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see SidebarUserData
 */
export type SidebarUserData = typeof SidebarUserData;