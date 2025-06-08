import {IoTDataPlaneClient, UpdateThingShadowCommand} from "@aws-sdk/client-iot-data-plane";
import {
    ControllerCloudSettings,
    MutableControllerCloudSettings,
} from "../types/controller.cloud";
import {AppError} from "../types/errors";
import {getController} from "./getController";

const ioTDataClient = new IoTDataPlaneClient({ endpoint: process.env.IOT_ENDPOINT! });

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for modifying a controller's cloud-based settings
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param controllerID the controller's identification
 * @param settings the mutable (publicly writable) settings of the controller
 *
 * @return nothing
 */
export async function modController(controllerID: string, settings: MutableControllerCloudSettings): Promise<void> {

    try {

        // Testing if controller existent
        const storedSettings: ControllerCloudSettings = await getController(controllerID)

        // Adding mutable settings to fetched settings
        storedSettings.settings = settings;

        // Update Device Shadow
        await ioTDataClient.send(new UpdateThingShadowCommand({
            thingName: controllerID,
            payload: Buffer.from(JSON.stringify({
                state: { desired: storedSettings }
            }))
        }));

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to modify the controller's settings : ${msg}`)
    }

}