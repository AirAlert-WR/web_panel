import {
    DataAirQualityForController,
    DataAirQualityForTime,
    DataAirQualityStoredEntry,
    DataAirQualityStoredEntrySchema
} from "../types/data";
import {AppError} from "../types/errors";

import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {getAllControllers} from "../controllers/getAllControllers";

// Global instances
const ddbClient = new DynamoDBClient({})

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Helper function for splitting a timestamp range (untilISO to now()) into segments
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param fromISO the time border in the "present"
 * @param untilISO the time border in the past
 * @param segments the number of resulting time entries inside the range
 *
 * @return the time array
 */
function createTimeSegmentsFromUntil(fromISO: string, untilISO: string, segments: number): string[] {
    // Getting boundaries and interval
    const start = new Date(untilISO).getTime();
    const end = new Date(fromISO).getTime(); // now()
    const interval = (end - start) / segments;

    // Returning an array of ISO dates according to the previously determined margins
    return Array.from({ length: segments }).map((_, i) =>
        new Date(start + i * interval).toISOString()
    );
}

/**
 * Helper function for determining the closest database entry to the timestamp
 * This function is necessary for maintaining data consistency while converting into the other structure
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param entries the collection of database entries
 * @param controllerID the controller's id to filter for
 * @param timeISO the target timestamp to approximate for
 *
 * @return the according stored entry
 */
function findClosestDataBefore(
    entries: DataAirQualityStoredEntry[],
    controllerID: string,
    timeISO: string
): DataAirQualityStoredEntry {
    const relevant = entries.filter(e => e.controllerID === controllerID);

    // If no entry for controller found (ATTENTION: EMERGENCY SOLUTION)
    if (relevant.length === 0) {
        // Adding item with zero values
        const value: DataAirQualityStoredEntry = {
            timeStampISO: timeISO,
            controllerID: controllerID,
            data: {
                pm2_5: 0,
                pm10: 0,
                co2: 0,
                temperature: 0,
                humidity: 0,
            }
        }
        relevant.push(value)

        // throw new Error(`No data found for controller '${controllerID}'`);
    }

    // Trying to find the entry at the nearest timeStamp BEFORE THE ENTRY
    const beforeOrAt = relevant
        .filter(e => e.timeStampISO <= timeISO)
        .sort((a, b) => b.timeStampISO.localeCompare(a.timeStampISO));

    if (beforeOrAt.length > 0) return beforeOrAt[0];

    // Fallback: nearest entry after thath
    const after = relevant
        .filter(e => e.timeStampISO > timeISO)
        .sort((a, b) => a.timeStampISO.localeCompare(b.timeStampISO));

    if (after.length > 0) return after[0];

    // Securing the Result gathering with a potential exception
    throw new Error(`Unexpected: No entries found even though controller '${controllerID}' exists`);

}

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for getting the air quality per controller at a specific time.
 * While not every measuring entry was made at the exact same time, merging operations with the previous values are done
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param untilTimestamp the earliest timestamp until the values should be fetched
 * @param segments the number of splits (-1) performed to the collected raw data; finally the result's length
 *
 * @return the data array
 * @see DataAirQualityForTime
 */
export async function getDataForTime(untilTimestamp: string, segments: number): Promise<DataAirQualityForTime[]> {

    try {
        // Generating the "now" timestamp
        const timeNow = new Date(Date.now()).toISOString()

        // Fetching all data from the database
        const raw = await ddbClient.send(new ScanCommand({
            TableName: process.env.DDB_TABLE_NAME,
            FilterExpression: "timeStampISO BETWEEN :start AND :end",
            ExpressionAttributeValues: {
                ":start": { S: untilTimestamp },
                ":end": { S: timeNow },
            }
        }));
        const items = raw.Items?.map(i => unmarshall(i)) ?? [];
        // Parsing the entries against the stored entry schema
        const entries = items.map((item) => DataAirQualityStoredEntrySchema.parse(item));

        console.log(items)
        console.log(entries)

        // Get all controller ids and segments
        const controllerIDs = await getAllControllers();
        const timeSegments = createTimeSegmentsFromUntil(timeNow, untilTimestamp, segments);

        // Putting out the result for all time segments
        const result: DataAirQualityForTime[] = []
        for (const timeISO of timeSegments) {

            console.log(timeISO)

            // Collecting all entries for a timestamp
            const entriesForTime: DataAirQualityForController[] = [];
            for (const controllerID of controllerIDs) {

                console.log(controllerID)

                // Finding the closest data to a timestamp
                const found = findClosestDataBefore(entries, controllerID, timeISO);

                console.log(found)

                // Creating the entry
                if (found) {
                    entriesForTime.push({
                        controllerID: found.controllerID,
                        data: found.data
                    });
                }
            }

            // Adding tho the main array
            result.push({
                timeStampISO: timeISO,
                entries: entriesForTime
            });
        }

        // Returning the result
        return result;

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to get the data entries : ${msg}`)
    }

}