import { ZodSchema } from "zod"
import {ValidationError} from "./errors";

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