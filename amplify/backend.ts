import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import {controllerHandler, ENV_CONSTANTS } from "./functions/resource"
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import {Stack} from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

// Merge backend processes
const backend = defineBackend({
  auth,
  controllerHandler,
});

// create a new API stack
const apiStack = backend.createStack("AirAlertApiStack");
// create a new REST API
const myRestApi = new RestApi(apiStack, "AirAlertRestApi", {
  restApiName: "AirAlertRestApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});
// create a new Cognito User Pools authorizer
/*const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});*/

/**
 * Lambda integration: CONTROLLER
 */

// Saving definition
const controllerLambda = backend.controllerHandler.resources.lambda
// Adding policies: IOT
const iotPolicy = new iam.PolicyStatement({
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
  ],
  resources: ["*"], // TODO Optional: später auf Thing-Arn einschränken
});
controllerLambda.addToRolePolicy(iotPolicy);
// Adding policies: S3
const bucketName = ENV_CONSTANTS.BUCKET_NAME
const s3Policy = new iam.PolicyStatement({
  actions: [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:PutObjectAcl",
  ],
  resources: [`arn:aws:s3:::${bucketName}/*`],
});
controllerLambda.addToRolePolicy(s3Policy);

// Lambda integration
const controllerIntegration = new LambdaIntegration(
    controllerLambda
);
// Resource path with authorization: controller general
const controllersPath = myRestApi.root.addResource("controllers", {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.NONE,
    //authorizer: cognitoAuth,
  },
});
// Adding paths
controllersPath.addMethod("GET", controllerIntegration);
controllersPath.addMethod("POST", controllerIntegration);
// Resource path with authorization: controller general
const itemsPath = controllersPath.addResource("{id}", {
    defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE,
        //authorizer: cognitoAuth,
    },
});
// Adding paths
itemsPath.addMethod("GET", controllerIntegration);
itemsPath.addMethod("DELETE", controllerIntegration);
itemsPath.addMethod("PUT", controllerIntegration);

/*
// Redirecting on default
controllersPath.addProxy({
    anyMethod: true,
    defaultIntegration: controllerIntegration,
});*/



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