import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import * as Tabs from './tabs';

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
                        {/* TODO */}
                    </main>
                </div>
            )}
        </Authenticator>
    );
}