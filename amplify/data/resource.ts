import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * IoT-Core Datenmodell für Geräte und Nachrichten
 */
const schema = a.schema({
  // Gerätedaten
  Device: a
    .model({
      deviceId: a.string().required(),
      name: a.string().required(),
      type: a.string().required(),
      status: a.string(),
      lastConnected: a.datetime(),
      metadata: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(["deviceId"]),

  // IoT-Nachrichten
  Message: a
    .model({
      topic: a.string().required(),
      payload: a.json().required(),
      timestamp: a.datetime().required(),
      deviceId: a.string().required(),
      direction: a.enum(["INBOUND", "OUTBOUND"]).required(),
      processed: a.boolean().default(false),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Kommandos für Geräte
  Command: a
    .model({
      deviceId: a.string().required(),
      commandType: a.string().required(),
      payload: a.json().required(),
      status: a.enum(["PENDING", "SENT", "DELIVERED", "FAILED"]).default("PENDING"),
      createdAt: a.datetime().required(),
      sentAt: a.datetime(),
      responseId: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
