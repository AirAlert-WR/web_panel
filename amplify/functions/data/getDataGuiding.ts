import {DataAirQuality} from "../types/data";
import {AppError} from "../types/errors";

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for getting the guiding data entries for the air quality measurement
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @return the data structure
 * @see DataAirQuality
 */
export async function getDataGuiding(): Promise<DataAirQuality> {

    try {

        // Tried to fetch Data from openAQ, left blank instead

        return {
            pm2_5: 25,
            pm10: 40,
            co2: 750,
            temperature: 20,
            humidity: 50
        }

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to get the controller/properties : ${msg}`)
    }
}