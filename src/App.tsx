import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import * as Tabs from './tabs';

export default function App() {

    const [activeTab, setActiveTab] = useState(Tabs.GetTab(Tabs.DEFAULT_TAB_ID));

    function getNavigationBar() {

        return (
            <nav style={{ display: 'flex', gap: '1rem' }}>
                {
                    Tabs.TAB_IDS.map((tabId) => {
                        const temporaryTab = Tabs.GetTab(tabId);
                        return (
                            <button key={tabId} onClick={() => setActiveTab(temporaryTab)}>
                                {temporaryTab.caption}
                            </button>
                        );
                    })
                }
            </nav>
        );
    }

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

                        {
                            getNavigationBar()
                        }

                        <button onClick={signOut} style={{ background: 'white', color: '#1e40af', padding: '0.4rem 0.8rem' }}>
                            Logout
                        </button>
                    </header>

                    {/* Main Content */}
                    <main style={{ flex: 1, padding: '2rem' }}>
                        <activeTab.displayContent />
                    </main>
                </div>
            )}
        </Authenticator>
    );
}