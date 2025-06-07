import {
    AttachPolicyCommand,
    AttachThingPrincipalCommand,
    CreateKeysAndCertificateCommand,
    CreateThingCommand,
    IoTClient
} from "@aws-sdk/client-iot"
import {IoTDataPlaneClient, UpdateThingShadowCommand} from "@aws-sdk/client-iot-data-plane"
import type {APIGatewayProxyHandler} from "aws-lambda";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import JSZip from 'jszip';
import path from "path";
import {readFile} from "fs/promises";

import {parseWithSchema} from "../common/helpers.parse";

import {
    ControllerCloudSettings,
    MutableControllerCloudSettings,
    MutableControllerCloudSettingsSchema,
    TYPE_CONTROLLER
} from "../types/controller.cloud";
import {AppError, ValidationError} from "../common/errors";
import {ControllerConfig} from "../types/controller.config";
import ini from "ini";

// Global instances
const ioTClient = new IoTClient({});
const ioTDataClient = new IoTDataPlaneClient({ endpoint: process.env.IOT_ENDPOINT! });
const s3Client = new S3Client({});

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Input content for the "createConfig" function
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member id controller's unique identification
 * @member pathCertificate path to the certificate file
 * @member pathPrivateKey path to the private key
 * @member pathRootCA path to the root certificate
 */
type CreateConfigContent = {
    id: string
    pathCertificate: string
    pathPrivateKey: string
    pathRootCA: string
}

/**
 * Function for creating a local controller configuration
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member content customized configuration entries
 * @see createConfigContent
 *
 * @return string in INI format
 */
function createConfig(content: CreateConfigContent): string {

    try {

        // Setting config file
        const host = ""
        const config: ControllerConfig = {
            mqtt: {
                username: "",
                password: "",
                path_Certificate: content.pathCertificate,
                path_PrivateKey: content.pathPrivateKey,
                path_RootCA: content.pathRootCA,
                use_tls: true,
                host: host, //TODO
                port: 0, //TODO
                id: content.id
            }
        } as const

        // Parsing and returning the config
        return ini.encode(config)

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new ValidationError(`Failed to create config: ${msg}`)
    }
}

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Input content for the "createZip" function
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member contentCertificate content of the certificate file
 * @member contentPrivateKey content of the private key file
 */
type CreateZipContent = {
    contentCertificate: string
    contentPrivateKey: string
}

/**
 * Result content for the "createZip" function
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member zipURL the URL to the generated ZIP archive (hosted on S3)
 */
type CreateZipResult = {
    zipURL: string
}

/**
 * Function for creating and uploading a zip file containing configuration and certificates
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member controllerID controller's identification
 * @member content content data inside the future ZIP archive
 * @see CreateZipContent
 *
 * @return a result object
 * @see CreateZipResult
 */
async function createZip(controllerID: string, content: CreateZipContent): Promise<CreateZipResult> {

    try {
        // Saving constants
        const folderCerts = "certs/"
        const configContent: CreateConfigContent = {
            id: controllerID,
            pathCertificate: `${folderCerts}certificate.pem.crt`,
            pathPrivateKey: `${folderCerts}private.pem.key`,
            pathRootCA: `${folderCerts}rootCA.pem`,
        }

        // Creating the configuration
        const configResult = createConfig(configContent)

        // Opening CA file (asset in structure) and read its content
        const rootCAPath = path.join(__dirname, 'assets/AmazonRootCA1.pem');
        const contentRootCA = await readFile(rootCAPath, 'utf-8');

        // Packing the ZIP file
        const zip = new JSZip();
        zip.file("config.ini", configResult);
        zip.file(configContent.pathCertificate, content.contentCertificate)
        zip.file(configContent.pathPrivateKey, content.contentPrivateKey)
        zip.file(configContent.pathRootCA, contentRootCA)
        const zipBuffer = await zip.generateAsync({type: "nodebuffer"})

        // Uploading to S3
        const futureLink = `devices/${controllerID}.zip`;
        const bucketName = process.env.S3_BUCKET_NAME!;
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: futureLink,
                Body: zipBuffer,
                ContentType: 'application/zip',
                ACL: 'public-read'
            })
        );

        // Returning URL
        return {
            zipURL: `https://${bucketName}.s3.amazonaws.com/${futureLink}`
        }

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to create/upload ZIP: ${msg}`)
    }
}

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * Function for creating a new controller (including always-accessible configuration)
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member settings cloud-based configuration settings
 * @see MutableControllerCloudSettings
 *
 * @return nothing
 */
async function addController(settings: MutableControllerCloudSettings): Promise<void> {

    try {
        // Setting up a raw controller config
        const properties: ControllerCloudSettings = {
            id: `controller-${settings.name}-${Date.now()}`,
            configURL: "",
            settings: settings,
        }

        // Creating the thing
        await ioTClient.send(new CreateThingCommand({
            thingName: properties.id,
            thingTypeName: TYPE_CONTROLLER
        }))
        // Creating the certificates
        const certOutput = await ioTClient.send(new CreateKeysAndCertificateCommand({
            setAsActive: true
        }))
        // Attach certificate to thing
        await ioTClient.send(new AttachThingPrincipalCommand({
            thingName: properties.id,
            principal: certOutput.certificateArn!,
        }))
        // Attach policy to thing
        const ioTPolicyName = process.env.IOT_POLICY_NAME!
        await ioTClient.send(new AttachPolicyCommand({
            policyName: ioTPolicyName,
            target: certOutput.certificateArn!,
        }))

        // Creating and uploading the ZIP archive
        const zipResult = await createZip(
            properties.id,
            {
                contentCertificate: certOutput.certificatePem!,
                contentPrivateKey: certOutput.keyPair!.PrivateKey!,
            }
        )
        // Adding URL to configuration
        properties.configURL = zipResult.zipURL

        // UPLOADING THE DEVICE SHADOW
        await ioTDataClient.send(new UpdateThingShadowCommand({
            thingName: properties.id,
            payload: Buffer.from(JSON.stringify({
                state: {
                    desired: properties
                }
            }))
        }));

    } catch (e) {
        // On failure -> error
        const msg = e instanceof Error
            ? e.message
            : "Other error"
        throw new AppError(`Failed to add the new controller: ${msg}`)
    }
}

// ####################################################################################################################
// ####################################################################################################################
// ####################################################################################################################

/**
 * The AWS lambda handler to export
 *
 * @author Danilo Bleul
 * @since 1.0
 */
export const handler: APIGatewayProxyHandler = async (event) => {

    try {
        // Parsing the json body
        const settings: MutableControllerCloudSettings = parseWithSchema(event.body ?? "{}", MutableControllerCloudSettingsSchema);

        // Calling the function
        await addController(settings);

        // Returning success
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Successfully added controller",
            })
        }

    } catch (e) {
        // On exception: Output error
        const error = e instanceof AppError
            ? e
            : new AppError("Unexpected error occurred");

        console.log(error)

        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ message: error.message })
        };
    }
}