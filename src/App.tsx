import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function App() {

    return (
        <Authenticator hideSignUp={true}>
            {({ signOut }) => (



                <div>
                    <Button onClick={signOut}>Logout</Button>

                    <Tabs defaultValue="data">
                        <TabsList>
                            <TabsTrigger value="data">Data</TabsTrigger>
                            <TabsTrigger value="controller">Controller</TabsTrigger>
                            {/*TODO Logo and Items*/}
                        </TabsList>
                        <TabsContent value="data">

                        </TabsContent>
                        <TabsContent value="controller">

                        </TabsContent>
                    </Tabs>

                </div>

            )}
        </Authenticator>
    );
}