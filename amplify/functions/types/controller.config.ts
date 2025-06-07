import { z } from "zod";

/**
 * Schema for the local controller config (ATTENTION: INI file format)
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member mqtt INI section "mqtt"
 *
 * @member username the login username
 * @member password the login password
 * @member path_RootCA the local file path to the root CA
 * @member path_Certificate the local file path to the certificate
 * @member path_PrivateKey the local file path to the private key
 * @member use_tls state for using tls als connection base
 * @member host link/ip to the IoT server
 * @member port public server port
 * @member id the id of the controller (CRITICAL)
 */
export const ControllerConfigSchema = z.object({
    mqtt: z.object({
        username: z.string(),
        password: z.string(),
        path_RootCA: z.string(),
        path_Certificate: z.string(),
        path_PrivateKey: z.string(),
        use_tls: z.boolean(),
        host: z.string().min(1),
        port: z.number().int().min(0).max(65535),
        id: z.string().min(1),
    }),
})
/**
 * Type for the controller configuration
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @see ControllerConfigSchema
 */
export type ControllerConfig = z.infer<typeof ControllerConfigSchema>