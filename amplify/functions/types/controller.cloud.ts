import z from "zod"

/**
 * Constant for the IoT thing type (-> CONTROLLER)
 */
export const TYPE_CONTROLLER = "AirAlert Controller"

/**
 * Schema for the cloud-based WRITABLE controller config
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member name the controller's custom name for additional identification
 * @member interval the time interval (IN s) between two measurement triggers
 */
export const MutableControllerCloudSettingsSchema = z.object({
    name: z.string().min(1),
    interval: z.number().int().positive().min(10),
})
/**
 * Type for the cloud-based writable controller config
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see MutableControllerCloudSettingsSchema
 */
export type MutableControllerCloudSettings = z.infer<typeof MutableControllerCloudSettingsSchema>
/**
 * Default values for the cloud-based writable controller config
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see MutableControllerCloudSettings
 */
export const MutableControllerCloudSettings: MutableControllerCloudSettings = {
    name: "AControllerName",
    interval: 15,
}

/**
 * Schema for the cloud-based FULL controller config
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member id the controller's initial NON-CHANGEABLE identification
 * @member configURL the link to the ZIP archive containing the local configuration files
 * @member settings the embedded writable settings
 * @see MutableControllerSettings
 */
export const ControllerCloudSettingsSchema = z.object({
    id: z.string().min(1),
    configURL: z.string().min(1),
    settings: MutableControllerCloudSettingsSchema,
})
/**
 * Type for the cloud-based full controller config
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see ControllerCloudSettingsSchema
 */
export type ControllerCloudSettings = z.infer<typeof ControllerCloudSettingsSchema>