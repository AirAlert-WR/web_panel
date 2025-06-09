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

        return {
            pm2_5: 0,
            pm10: 0,
            co2: 0,
            temperature: 0,
            humidity: 0
        }

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to get the controller/properties : ${msg}`)
    }
}