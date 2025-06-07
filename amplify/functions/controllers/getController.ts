import type {APIGatewayProxyHandler} from "aws-lambda";
import {AppError, ValidationError} from "../common/errors";
import {ControllerCloudSettings, ControllerCloudSettingsSchema} from "../types/controller.cloud";
import {GetThingShadowCommand, IoTDataPlaneClient} from "@aws-sdk/client-iot-data-plane";
import {getAllControllers} from "./getAllControllers";
import {parseWithSchema} from "../common/helpers.parse";

// Global instances
const ioTDataClient = new IoTDataPlaneClient({ endpoint: process.env.IOT_ENDPOINT! });

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for getting all properties of a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param controllerID the controller's identification
 *
 * @return the controller properties
 */
export async function getController(controllerID: string): Promise<ControllerCloudSettings> {

    try {

        // Checking for existence of ID
        const controllers = await getAllControllers();
        if (!controllers.includes(controllerID)) {
            throw new AppError("Controller not found")
        }

        // Read Device Shadow
        const response = await ioTDataClient.send(new GetThingShadowCommand({
            thingName: controllerID
        }));
        const payload = response.payload?.transformToString("utf-8")
        if (!payload) throw new AppError("No device shadow available")

        // Parsing shadow
        const json = JSON.parse(payload)
        const desired = json.state?.desired
        if (!desired) throw new AppError("Invalid device shadow format")

        // Return after validation
        return parseWithSchema(desired, ControllerCloudSettingsSchema)

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to get the controller/properties : ${msg}`)
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

        // Fetching controller settings
        const properties = await getController(controllerID)

        // Returning success with properties
        return {
            statusCode: 200,
            body: JSON.stringify(properties)
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