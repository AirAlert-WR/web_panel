import { defineFunction } from "@aws-amplify/backend";

import { namings } from "../defines"

// Export handlers
export const controllerHandler = defineFunction({
    name: "controllerHandler",
    entry: "./controllers/handler.ts",

    environment: {
        S3_BUCKET_NAME: namings.s3_bucket_name,
        IOT_POLICY_NAME: namings.iot_policy_name,
    }
})
export const dataHandler = defineFunction({
    name: "dataHandler",
    entry: "./data/handler.ts",

    environment: {
        DDB_TABLE_NAME: namings.ddb_table_name,
    }
})