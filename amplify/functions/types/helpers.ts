import { ZodSchema } from "zod"
import {ValidationError} from "./errors";
import { APIGatewayProxyResult } from 'aws-lambda';

export function parseWithSchema<T>(json: string, schema: ZodSchema<T>): T {

    try {
        // Trying to parse the data
        return schema.parse(JSON.parse(json));

    } catch (e) {

        // On Error -> Return message
        throw new ValidationError(`Could not parse against schema: ${e}`)
    }
}

export function parseS3KeyFromUrl(url: string): string | null {
    try {
        const u = new URL(url);
        return decodeURIComponent(u.pathname.slice(1)); // Remove leading "/"
    } catch {
        return null;
    }
}

export function createApiResponse(statusCode: number, body: unknown): APIGatewayProxyResult {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*", // Oder die spezifische Domain Ihres Frontends
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", // Erlaubte Methoden
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amplify-User-Agent", // Wichtige Header für Amplify
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    };
}