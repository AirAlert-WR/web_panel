import { defineFunction } from "@aws-amplify/backend"

// Environment variables
const ENV_IOT = ""
const ENV_S3 = ""

export const addControllerFunction = defineFunction({
    name: "addController",
    entry: "addController.ts"
})