import {
    DataAirQuality,
    DataAirQualityForTime,
    DataAirQualityForTimeSchema, DataAirQualitySchema
} from "../../amplify/functions/types/data.ts";
import {
    MutableControllerCloudSettings,
    ControllerCloudSettings,
    ControllerCloudSettingsSchema,
    MutableControllerCloudSettingsSchema,
} from "../../amplify/functions/types/controller.cloud.ts";

export type FilteredMeasurementData = DataAirQualityForTime
export const FilteredMeasurementDataSchema = DataAirQualityForTimeSchema;
export type MeasurementData = DataAirQuality
export const MeasurementDataSchema = DataAirQualitySchema;

export type ControllerProperties = MutableControllerCloudSettings
export const ControllerProperties = MutableControllerCloudSettings
export const ControllerPropertiesSchema = MutableControllerCloudSettingsSchema
export type FullControllerProperties = ControllerCloudSettings
export const FullControllerPropertiesSchema = ControllerCloudSettingsSchema