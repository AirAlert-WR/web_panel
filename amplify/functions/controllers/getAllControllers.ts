import {IoTClient, ListThingsCommand, ListThingsCommandOutput} from "@aws-sdk/client-iot";
import {AppError} from "../types/errors";
import {TYPE_CONTROLLER} from "../types/controller.cloud";

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
                    nextToken: nextToken,
                    thingTypeName: TYPE_CONTROLLER,
                    maxResults: 50,
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