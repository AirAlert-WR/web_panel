import * as Icons from "@tabler/icons-react";
import {type Page} from "@/pages/index.ts";

import { z } from "zod"

import {
    ControllerAddButton,
    ControllerCard,
    ControllerDialogSubmitResult,
} from "@/components/custom/embedded/controllers";

import {
    ControllerProperties,
    FullControllerProperties,
    FullControllerPropertiesSchema
} from "@/types/apiTypes.ts"
import {useEffect, useState} from "react";
import {get, put, post, del} from "aws-amplify/api";

/**
 * Method for calling the API for getting all controllers
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 *
 * @return An array of all controller settings or error string
 * @see FullControllerProperties
 */
async function getControllers(): Promise<FullControllerProperties[] | string> {
    try {
        // Getting all controller ids first
        const getControllerIDsOperation = get({
            apiName: "AirAlertRestApi2",
            path: "controllers",
        });
        const getControllerIDsResponse = await getControllerIDsOperation.response
        const getControllerIDsBody = await getControllerIDsResponse.body.json()

        // Typechecking and converting
        const controllerIDs = z.string().array().parse(getControllerIDsBody)

        // Getting all controller properties
        const result : FullControllerProperties[] = []
        for (const controllerID of controllerIDs) {

            // Performing raw rest call
            const getControllerOperation = get({
                apiName: "AirAlertRestApi2",
                path: `controllers/${controllerID}`
            })
            const getControllerResponse = await getControllerOperation.response
            const getControllerRaw = await getControllerResponse.body.json()

            // Parsing and pushing the result
            const controller = FullControllerPropertiesSchema.parse(getControllerRaw)
            result.push(controller)
        }

        // Return the Map
        return result
    } catch (error) {
        // Returning and printing errors
        console.error("API call failed", error)
        return "Failed to load controllers"
    }
}

/**
 * Method for calling the API to add a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param properties The controller's properties
 * @see ControllerProperties
 *
 * @return nothing or error string
 */
async function addController(properties: ControllerProperties) :Promise<void | string> {

    try {
        // trying to modify the controller's properties
        const addControllerOperation = post({
            apiName: "AirAlertRestApi2",
            path: "controllers/",
            options: {
                body: properties
            }
        });
        const addControllerResponse = await addControllerOperation.response
        const addControllerStatusCode = addControllerResponse.statusCode

        // Throw error if call not successfull
        if (addControllerStatusCode !== 200) {
            throw new Error("Could not perform")
        }

    } catch (error) {
        // Returning and printing errors
        console.error("API call failed", error)
        return `Failed to add controller`
    }
}

/**
 * Method for calling the API to modify a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param id The controller's id
 * @param properties The controller's properties
 * @see ControllerProperties
 *
 * @return nothing or error string
 */
async function modController(id: string, properties: ControllerProperties) :Promise<void | string> {

    try {
        // trying to modify the controller's properties
        const modControllerOperation = put({
            apiName: "AirAlertRestApi2",
            path: `controllers/${id}`,
            options: {
                body: properties
            }
        });
        const modControllerResponse = await modControllerOperation.response
        const modControllerStatusCode = modControllerResponse.statusCode

        // Throw error if call not successfull
        if (modControllerStatusCode !== 200) {
            throw new Error("Could not perform")
        }

    } catch (error) {
        // Returning and printing errors
        console.error("API call failed", error)
        return `Failed to modify controller ${id}`
    }
}

/**
 * Method for calling the API to delete a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param id The controller's id
 *
 * @return nothing or error string
 */
async function delController(id: string) :Promise<void | string> {

    try {
        // Getting all controller ids first
        const delControllerOperation = del({
            apiName: "AirAlertRestApi2",
            path: `controllers/${id}`,
        });
        const delControllerResponse = await delControllerOperation.response
        const delControllerStatusCode = delControllerResponse.statusCode

        // Throw error if call not successfull
        if (delControllerStatusCode !== 200) {
            throw new Error("Could not perform")
        }

    } catch (error) {
        // Returning and printing errors
        console.error("API call failed", error)
        return `Failed to delete controller ${id}`
    }
}


/**
 * Method for drawing the page content
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @constructor
 */
function Content() {

    // Defining state constants for controller showings
    const [controllers, setControllers] = useState<FullControllerProperties[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<boolean>(false);

    // Do only if triggered
    useEffect(() => { const call = async () => {

        // Resetting all variables
        setControllers(null);
        setError(null);

        // Calling rest function and setting states
        const fetchedControllers = await getControllers()
        if (typeof fetchedControllers === "string") {
            setError(fetchedControllers)
        } else {
            setControllers(fetchedControllers)
        }


    }; call().then()}, [trigger])

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (controllers === null) {
        return <div className="text-gray-500">Load controllers...</div>;
    }

    // Returning the page
    return (

        /* Flex container wrapper */
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

                    {/* First element: Button for adding a new controller */}
                    <ControllerAddButton onDialogSubmit={(result, properties) => {

                        // Exit if Wrong
                        if (result!=ControllerDialogSubmitResult.SUBMIT) return

                        // Calling the rest function
                        const call = async () => {

                            const controllerAdded = await addController(properties)
                            if (typeof controllerAdded !== "string") {
                                // If no error: Trigger because of update
                                setTrigger(!trigger)
                            }

                        }
                        call().then()

                    }}/>

                    {/* Other elements: fetched controllers */}
                    {controllers.map((currentController) => {

                        return (

                        <ControllerCard controller={currentController} onDialogSubmit={
                            (result, properties) => {

                                console.log(currentController.id)

                                switch (result) {
                                    case ControllerDialogSubmitResult.SUBMIT: {



                                        // Calling the rest function to ADD a controller
                                        const call = async () => {
                                            const controllerModified = await modController(currentController.id, properties)
                                            if (typeof controllerModified !== "string") {
                                                // If no error: Trigger because of update
                                                setTrigger(!trigger)
                                            }
                                        }
                                        call().then()
                                        break;
                                    }
                                    case ControllerDialogSubmitResult.DELETE: {

                                        // Calling the rest function to ADD a controller
                                        const call = async () => {
                                            const controllerDeleted = await delController(currentController.id)
                                            if (typeof controllerDeleted !== "string") {
                                                // If no error: Trigger because of update
                                                setTrigger(!trigger)
                                            }
                                        }
                                        call().then()
                                        break;

                                    }

                                }

                            }
                        } />

                    )})}

                </div>

            </div>
        </div>

    )
}

/**
 * Exporting data for the page navigation
 *
 * @author Danilo Bleul
 * @since 1.0
 */
export const DATA: Page = {
    id: "controllers",
    title: "Controllers",
    icon: Icons.IconDeviceRemote,
    component: Content,
    enabled: true,
}