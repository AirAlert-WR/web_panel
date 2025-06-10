import {APIGatewayProxyHandler} from "aws-lambda";
import {AppError, NotFoundError, ValidationError} from "../types/errors";
import {getDataGuiding} from "./getDataGuiding";
import {getDataForTime} from "./getDataForTime";
import {createApiResponse } from "../types/helpers";

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
        // Getting the target method
        const method = event.httpMethod;
        // Getting the path
        const pathParts = event.path.split('/');
        const subPath = pathParts[pathParts.length - 1];

        // Doing for subpath
        switch (subPath) {

            // guiding/GET: method "GetDataGuiding"
            case "guiding": {
                if (method === "GET") {
                    // Running the function
                    const result = await getDataGuiding()
                    // Returning success + result
                    return createApiResponse(200, result)
                }
                break;
            }
            // forTime/GET: method "GetDataForTime"
            case "forTime": {
                if (method === "GET") {

                    const untilTimeStamp = event.queryStringParameters?.untilTimeStamp
                    const segments = event.queryStringParameters?.segments

                    if (!untilTimeStamp || !segments) {
                        throw new ValidationError("Query parameters not set correctly")
                    }

                    // Converting segments to a number
                    const segmentsNumber = Number.parseInt(segments)

                    // Running the function
                    const result = await getDataForTime(untilTimeStamp, segmentsNumber)
                    // Returning success + result
                    return createApiResponse(200, result)


                }
                break;
            }

        }

        // If no function was called: throw request error
        throw new NotFoundError("Invalid request")

    } catch (e) {
        // On exception: Output error
        const error = e instanceof AppError
            ? e
            : new AppError("Unexpected error occurred");

        console.error("Handler error: ",error)

        return createApiResponse(error.statusCode, { message: error.message })
    }
}