import {
    DataAirQuality,
    DataAirQualityForTime,
    DataAirQualityForTimeSchema
} from "../../amplify/functions/types/data.ts";
import {
    MutableControllerCloudSettings,
    MutableControllerCloudSettingsSchema
} from "../../amplify/functions/types/controller.cloud.ts";

export type FilteredMeasurementData = DataAirQualityForTime
export const FilteredMeasurementDataSchema = DataAirQualityForTimeSchema;
export type MeasurementData = DataAirQuality

export type ControllerProperties = MutableControllerCloudSettings
export const ControllerProperties = MutableControllerCloudSettings
export const ControllerPropertiesSchema = MutableControllerCloudSettingsSchema;