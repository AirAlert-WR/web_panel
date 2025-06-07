import {IoTClient, ListThingsCommand, ListThingsCommandOutput} from "@aws-sdk/client-iot";
import type {APIGatewayProxyHandler} from "aws-lambda";
import {AppError} from "../common/errors";

// Global instances
const ioTClient = new IoTClient({});

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for getting all controller IDs
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @return all controller id strings inside an array
 */
export async function getAllControllers(): Promise<string[]> {

    try {
        // Define temporary variables
        const result: string[] = [];
        let nextToken: string | undefined = undefined;

        // Fetching all controller (thing) ids in loop
        do {
            const response: ListThingsCommandOutput = await ioTClient.send(
                new ListThingsCommand({
                    nextToken,
                    maxResults: 50
                    // TODO filter for thingTypeName!
                })
            );

            // Copying to the array
            const names = response.things?.map(thing => thing.thingName!).filter(Boolean) ?? [];
            result.push(...names);
            nextToken = response.nextToken;

        } while (nextToken);

        // Returning the result
        return result;
    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to fetch all controller ids: ${msg}`)
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
export const handler: APIGatewayProxyHandler = async () => {

    try {

        // Calling the function; fetching all IDs
        const controllerIds = await getAllControllers();

        // Returning all controller ids
        return {
            statusCode: 200,
            body: JSON.stringify(controllerIds)
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
};