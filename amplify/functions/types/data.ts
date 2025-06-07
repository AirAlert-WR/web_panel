import z from "zod"

/**
 * Schema for general air quality data
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member pm2_5 the amount of pm2.5 particles in the air (ppm)
 * @member pm10 the amount of pm10 particles in the air (ppm)
 * @member co2 the amount of co2 molecules in the air (ppm)
 * @member temperature the environmental temperature (°C)
 * @member humidity the relative humidity inside the air (%rhm)
 */
export const DataAirQualitySchema = z.object({
    pm2_5: z.number(),
    pm10: z.number(),
    co2: z.number(),
    temperature: z.number(),
    humidity: z.number(),
})
/**
 * Type for the general air quality data
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see DataAirQualitySchema
 */
export type DataAirQuality = z.infer<typeof DataAirQualitySchema>

/**
 * Schema for air quality data as a database entry
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member controllerID the id of the controller performing the measurement
 * @member timeStampISO the time of inserting into the database (ISO standard time)
 * @member data the nested air quality data
 * @see DataAirQuality
 */
export const DataAirQualityStoredEntrySchema = z.object({
    controllerID: z.string().min(1),
    timeStampISO: z.string().min(1), //TODO decide over time()-Function
    data: DataAirQualitySchema,
})
/**
 * Type for air quality data as a database entry
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see DataAirQualityStoredEntrySchema
 */
export type DataAirQualityStoredEntry = z.infer<typeof DataAirQualityStoredEntrySchema>

/**
 * Schema for air quality data in combination with the corresponding controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member controllerID the id of the controller performing the measurement
 * @member data the nested air quality data
 * @see DataAirQuality
 */
export const DataAirQualityForControllerSchema = z.object({
    controllerID: z.string().min(1),
    data: DataAirQualitySchema,
})
/**
 * Type for air quality data in combination with the corresponding controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see DataAirQualityForControllerSchema
 */
export type DataAirQualityForController = z.infer<typeof DataAirQualityForControllerSchema>

/**
 * Schema for controller-aligned air quality data to a specific time
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member timeStampISO the time of capturing the measurement (ISO standard time)
 * @member entries an array containing all targeting controller-data pairs
 * @see DataAirQualityForController
 */
export const DataAirQualityForTimeSchema = z.object({
    timeStampISO: z.string().min(1),
    entries: z.array(DataAirQualityForControllerSchema)
})
/**
 * Type for controller-aligned air quality data to a specific time
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see DataAirQualityForTimeSchema
 */
export type DataAirQualityForTime = z.infer<typeof DataAirQualityForTimeSchema>