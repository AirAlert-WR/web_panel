import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import {SidebarInset, SidebarProvider} from './components/ui/sidebar';
import {MySidebar, MySiteHeader} from './components/custom/global';
import {useCurrentPage} from "@/pages";
import {SidebarUserData} from "@/components/custom/embedded/sidebarUser.types.ts";

export default function App() {

    return (
        // Authenticator
        <Authenticator hideSignUp={true}>
            {({ user, signOut }) => {

                // Saving userdata
                const userData : SidebarUserData = {
                    userName: user!.username,
                    email: user!.userId,
                    avatarPath: "/logo.png",
                    onLogout: () => signOut!()
                }

                // Returning page
            return (
                <AppContent userData={userData}/>
            )}}
        </Authenticator>
    );
}

function AppContent({userData}: {userData: SidebarUserData}) {
    const CurrentPage = useCurrentPage().component;

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <SidebarProvider>
                <MySidebar variant="inset" userData={userData} />
                <SidebarInset>
                    <MySiteHeader />
                    <div className="flex flex-1 flex-col">
                        <CurrentPage />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
