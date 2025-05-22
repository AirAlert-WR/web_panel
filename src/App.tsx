import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function App() {

    return (
        <Authenticator hideSignUp={true}>
            {({ signOut }) => (



                <div style = {{
                    width: "90vw",
                    height: "90vh"
                }}>

                    <Tabs defaultValue="data">
                        <TabsList>
                            <TabsTrigger value="data">Data</TabsTrigger>
                            <TabsTrigger value="controller">Controller</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                            {/*TODO Logo and Items*/}
                            <Button onClick={signOut}>Logout</Button>
                        </TabsList>
                        <TabsContent value="data">

                            <Card>
                                <CardHeader>
                                    <CardTitle>Data</CardTitle>
                                    <CardDescription>Diagrams showing and filtering the measuring data</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    Content
                                </CardContent>
                                <CardFooter>
                                    Footer
                                </CardFooter>
                            </Card>

                        </TabsContent>
                        <TabsContent value="controller">

                            <Card>
                                <CardHeader>
                                    <CardTitle>Controller</CardTitle>
                                    <CardDescription>Listing, modifying and deleting controllers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    Content
                                </CardContent>
                                <CardFooter>
                                    Footer
                                </CardFooter>
                            </Card>

                        </TabsContent>
                        <TabsContent value="about">

                            <Card>
                                <CardHeader>
                                    <CardTitle>About</CardTitle>
                                    <CardDescription>Telling the background of the project</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    Content
                                </CardContent>
                                <CardFooter>
                                    Footer
                                </CardFooter>
                            </Card>

                        </TabsContent>
                    </Tabs>

                </div>

            )}
        </Authenticator>
    );
}