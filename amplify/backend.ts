import {defineBackend} from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import {controllerHandler, dataHandler} from "./functions/resource"
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import {namings} from "./defines";

// Merge backend processes
const backend = defineBackend({
    auth,
    controllerHandler,
    dataHandler,
});

// create a new API stack
const apiStack = backend.createStack("AirAlertApiStack");
// create a new REST API
const myRestApi = new RestApi(apiStack, "AirAlertRestApi2", {
    restApiName: "AirAlertRestApi2",
    deploy: true,
    deployOptions: {
        stageName: "dev",
    },
    defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
        allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
        allowHeaders: [
            "Content-Type",
            "X-Amz-Date",
            "Authorization",
            "X-Api-Key",
            "X-Amz-Security-Token",
            "X-Amplify-User-Agent"
        ],
    },
    defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE,
        apiKeyRequired: false,
    },
});

/**
 * Lambda integration: CONTROLLER
 */

// Saving definition
const controllerLambda = backend.controllerHandler.resources.lambda
// Adding policies: IOT
const iotPolicyController = new iam.PolicyStatement({
  actions: [
      "iot:ListThings",
      "iot:DescribeThing",
      "iot:DeleteThing",
      "iot:UpdateThingShadow",
      "iot:GetThingShadow",
      "iot:CreateThing",
      "iot:CreateThingType",
      "iot:DeleteThingShadow",
      "iot:CreateKeysAndCertificate",
      "iot:AttachThingPrincipal",
      "iot:AttachPolicy",
      "iot:CreatePolicy",
      "iot:ListThingPrincipals",
      "iot:DetachThingPrincipal",
  ],
  resources: ["*"], // TODO Optional: später auf Thing-Arn einschränken
});
controllerLambda.addToRolePolicy(iotPolicyController);
// Adding policies: S3
const bucketName = namings.s3_bucket_name
const s3PolicyController = new iam.PolicyStatement({
  actions: [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:PutObjectAcl",
  ],
  resources: [`arn:aws:s3:::${bucketName}/*`],
});
controllerLambda.addToRolePolicy(s3PolicyController);

// Lambda integration
const controllerIntegration = new LambdaIntegration(controllerLambda);
// Resource path with authorization: controller general
const controllersPath = myRestApi.root.addResource("controllers");
// Adding paths
controllersPath.addMethod("GET", controllerIntegration);
controllersPath.addMethod("POST", controllerIntegration);
// Resource path with authorization: controller general
const itemsPath = controllersPath.addResource("{id}");
// Adding paths
itemsPath.addMethod("GET", controllerIntegration);
itemsPath.addMethod("DELETE", controllerIntegration);
itemsPath.addMethod("PUT", controllerIntegration);

/**
 * Lambda integration: DATA
 */

// Saving definition
const dataLambda = backend.dataHandler.resources.lambda
// Adding policies: DynamoDB
const ddbName = namings.ddb_table_name
const ddbPolicyData = new iam.PolicyStatement({
    actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
    ],
    //resources: [`arn:aws:dynamodb:::table/${ddbName}`],
    resources: [`*`]
});
dataLambda.addToRolePolicy(ddbPolicyData)
// Adding policies: IOT
const iotPolicyData = new iam.PolicyStatement({
    actions: [
        "iot:ListThings",
    ],
    resources: ["*"], // TODO Optional: später auf Thing-Arn einschränken
});
dataLambda.addToRolePolicy(iotPolicyData);

// Lambda integration
const dataIntegration = new LambdaIntegration(dataLambda);
// Resource paths with authorization
const dataPath = myRestApi.root.addResource("data");
const dataPathGuiding = dataPath.addResource("guiding");
dataPathGuiding.addMethod("GET",dataIntegration)
const dataPathForTime = dataPath.addResource("forTime");
dataPathForTime.addMethod("GET",dataIntegration)

// Create a new Access Policy for the events
const apiRestPolicy = new Policy(apiStack, "AirAlertRestApiPolicy", {
    statements: [
        new PolicyStatement({
            actions: ["execute-api:Invoke"],
            resources: [
                `${myRestApi.arnForExecuteApi("*", "/*", "dev")}`,
            ],
        }),
    ],
});
// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    apiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
    apiRestPolicy
);


// add outputs to the configuration file: REST API and AUTHORIZER
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },

  },
});