import {APIGatewayProxyHandler} from "aws-lambda";
import { addController } from "./addController";
import {parseWithSchema} from "../types/helpers.parse";
import {MutableControllerCloudSettingsSchema} from "../types/controller.cloud";
import { getAllControllers } from "./getAllControllers";
import { getController } from "./getController";
import { modController } from "./modController";
import { delController } from "./delController";
import {AppError, NotFoundError} from "../types/errors";

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
        // Getting the target method
        const method = event.httpMethod;
        // Getting the controller id
        const controllerID = event.pathParameters?.id

        // ID not existent: global controller functions
        if (!controllerID) {

            // GET: method "GetAllControllers"
            if (method === "GET") {
                // Running function
                const result = await getAllControllers()
                // Returning success + result
                return { statusCode: 200, body: JSON.stringify(result) }
            }
            // POST: method "AddController"
            if (method === "POST") {
                // Parse controller settings
                const settings = parseWithSchema(event.body ?? "{}", MutableControllerCloudSettingsSchema)
                // Running function
                await addController(settings)
                // Returning success
                return { statusCode: 200, body: JSON.stringify({ message: "Successfully added new controller"})}
            }

        }
        // ID existent: controller-related functions
        else {

            // GET: method "GetController"
            if (method === "GET") {
                // Running function
                const result = await getController(controllerID)
                // Returning success + result
                return { statusCode: 200, body: JSON.stringify(result) }
            }
            // PUT: method "ModController"
            if (method === "PUT") {
                // Parse controller settings
                const settings = parseWithSchema(event.body ?? "{}", MutableControllerCloudSettingsSchema)
                // Running function
                await modController(controllerID, settings)
                // Returning success
                return { statusCode: 200, body: JSON.stringify({ message: `Successfully updated controller ${controllerID}`})}
            }
            // DELETE: method "DelController"
            if (method === "DELETE") {
                // Running function
                await delController(controllerID)
                // Returning success
                return { statusCode: 200, body: JSON.stringify({ message: `Successfully delete controller controller ${controllerID}`})}
            }
        }

        // If no function was called: throw request error
        throw new NotFoundError("Invalid request")

    } catch (e) {
        // On exception: Output error
        const error = e instanceof AppError
            ? e
            : new AppError("Unexpected error occurred");

        console.error("Handler error: ",error)

        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ message: error.message })
        };
    }
}