import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function App() {

    return (
        <Authenticator hideSignUp={true}>
            {({ signOut, user }) => (

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <header style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#1e40af',
                        color: 'white'
                    }}>
                        <div><strong>{user?.username}</strong></div>


                        <button onClick={signOut} style={{ background: 'white', color: '#1e40af', padding: '0.4rem 0.8rem' }}>
                            Logout
                        </button>
                    </header>

                    {/* Main Content */}
                    <main style={{ flex: 1, padding: '2rem' }}>

                        <Tabs defaultValue="data">
                            <TabsList>
                                <TabsTrigger value="data">Data</TabsTrigger>
                                <TabsTrigger value="controller">Controller</TabsTrigger>
                            </TabsList>
                            <TabsContent value="data">Tab content for data</TabsContent>
                            <TabsContent value="controller">Tab content for controller</TabsContent>
                        </Tabs>

                    </main>
                </div>
            )}
        </Authenticator>
    );
}