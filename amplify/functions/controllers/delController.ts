import {
    DeleteThingCommand,
    DetachThingPrincipalCommand,
    IoTClient,
    ListThingPrincipalsCommand
} from "@aws-sdk/client-iot";
import {DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {parseS3KeyFromUrl} from "../types/helpers.parse";
import {ControllerCloudSettings} from "../types/controller.cloud";
import {AppError} from "../types/errors";
import {getController} from "./getController";

const ioTClient = new IoTClient({});
const s3Client = new S3Client({});

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for deleting a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param controllerID the controller's identification
 *
 * @return nothing
 */
export async function delController(controllerID: string): Promise<void> {

    try {

        // Testing if controller exists
        const properties: ControllerCloudSettings = await getController(controllerID)

        // 1. Deleting the archive on S3
        const configUrl = properties.configURL;
        const s3Key = parseS3KeyFromUrl(configUrl);
        if (s3Key) {
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: s3Key
            }));
        }

        // 2. Detach principals (certificates) first
        const principalResult = await ioTClient.send(new ListThingPrincipalsCommand({ thingName: controllerID }));
        const principals = principalResult.principals || [];
        for (const principal of principals) {
            await ioTClient.send(new DetachThingPrincipalCommand({
                thingName: controllerID,
                principal
            }));
        }

        // 3. Delete thing
        await ioTClient.send(new DeleteThingCommand({ thingName: controllerID }));


    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to delete the controller : ${msg}`)
    }

}