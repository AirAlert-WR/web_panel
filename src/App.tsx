import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function App() {

    const module_data = 'data'
    const module_controller = 'controller'
    const module_about = 'about'

    const [activeTab, setActiveTab] = useState(module_data);

    const renderContent = () => {
        switch (activeTab) {
            case module_data:
                return <div>Module "Data" Content</div>;
            case module_controller:
                return <div>Module "Controller" Content</div>;
            case module_about:
                return <div>Module "About" Content</div>;
            default:
                return <div>Please select a module.</div>;
        }
    };

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

                        <nav style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setActiveTab(module_data)}>Data</button>
                            <button onClick={() => setActiveTab(module_controller)}>Controller</button>
                            <button onClick={() => setActiveTab(module_about)}>About</button>
                        </nav>

                        <button onClick={signOut} style={{ background: 'white', color: '#1e40af', padding: '0.4rem 0.8rem' }}>
                            Logout
                        </button>
                    </header>

                    {/* Main Content */}
                    <main style={{ flex: 1, padding: '2rem' }}>
                        {renderContent()}
                    </main>
                </div>
            )}
        </Authenticator>
    );
}