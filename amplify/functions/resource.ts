import { defineFunction } from "@aws-amplify/backend";

export const ENV_CONSTANTS = {
    IOT_ENDPOINT: "awjg171sjqf2q-ats.iot.eu-central-1.amazonaws.com", //TODO critical
    BUCKET_NAME: "airalertcconfigbucket", //TODO critical
    IOT_POLICY_NAME: "airalertcontrollerpolicy"
} as const

export const controllerHandler = defineFunction({
    name: "controllerHandler",
    entry: "./controllers/handler.ts",

    environment: ENV_CONSTANTS
})