import {IoTDataPlaneClient, UpdateThingShadowCommand} from "@aws-sdk/client-iot-data-plane";
import type {APIGatewayProxyHandler} from "aws-lambda";
import {parseWithSchema} from "../common/helpers.parse";
import {
    ControllerCloudSettings,
    MutableControllerCloudSettings,
    MutableControllerCloudSettingsSchema
} from "../types/controller.cloud";
import {AppError, ValidationError} from "../common/errors";
import {getController} from "./getController";

const ioTDataClient = new IoTDataPlaneClient({ endpoint: process.env.IOT_ENDPOINT! });

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for modifying a controller's cloud-based settings
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param controllerID the controller's identification
 * @param settings the mutable (publicly writable) settings of the controller
 *
 * @return nothing
 */
async function modController(controllerID: string, settings: MutableControllerCloudSettings): Promise<void> {

    try {

        // Testing if controller existent
        const storedSettings: ControllerCloudSettings = await getController(controllerID)

        // Adding mutable settings to fetched settings
        storedSettings.settings = settings;

        // Update Device Shadow
        await ioTDataClient.send(new UpdateThingShadowCommand({
            thingName: controllerID,
            payload: Buffer.from(JSON.stringify({
                state: { desired: storedSettings }
            }))
        }));

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to modify the controller's settings : ${msg}`)
    }

}

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * The AWS lambda handler to export
 *
 * @author Danilo Bleul
 * @since 1.0
 */
export const handler: APIGatewayProxyHandler = async (event) => {

    try {
        // Getting the controller id
        const controllerID = event.pathParameters?.id
        // Not existent -> Error
        if (!controllerID) {
            throw new ValidationError("ID not set as path parameter")
        }
        // Parsing the json body
        const settings: MutableControllerCloudSettings = parseWithSchema(event.body ?? "{}", MutableControllerCloudSettingsSchema);


        // Running the function
        await modController(controllerID, settings)

        // Returning success
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully updated controller ${controllerID}`,
            })
        }

    } catch (e) {
        // On exception: Output error
        const error = e instanceof AppError
            ? e
            : new AppError("Unexpected error occurred");

        console.log(error)

        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ message: error.message })
        };
    }
}