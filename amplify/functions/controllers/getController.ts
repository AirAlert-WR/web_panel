import {AppError} from "../types/errors";
import {ControllerCloudSettings, ControllerCloudSettingsSchema} from "../types/controller.cloud";
import {GetThingShadowCommand, IoTDataPlaneClient} from "@aws-sdk/client-iot-data-plane";
import {getAllControllers} from "./getAllControllers";
import {parseWithSchema} from "../types/helpers";

// Global instances
const ioTDataClient = new IoTDataPlaneClient({});

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for getting all properties of a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param controllerID the controller's identification
 *
 * @return the controller properties OR the parsing success
 */
export async function getController(controllerID: string): Promise<ControllerCloudSettings> {

    try {

        // Checking for existence of ID
        const controllers = await getAllControllers();
        if (!controllers.includes(controllerID)) {
            throw new AppError("Controller not found")
        }

        // Read Device Shadow
        const response = await ioTDataClient.send(new GetThingShadowCommand({
            thingName: controllerID
        }));
        const payload = response.payload?.transformToString("utf-8")
        if (!payload) throw new AppError("No device shadow available")

        // Parsing shadow
        const json = JSON.parse(payload)
        const desired = json.state?.desired
        if (!desired) throw new AppError("Invalid device shadow format")

        // Return after validation
        return parseWithSchema(JSON.stringify(desired), ControllerCloudSettingsSchema)

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to get the controller/properties : ${msg}`)
    }

}