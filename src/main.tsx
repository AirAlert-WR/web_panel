import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { parseAmplifyConfig } from "aws-amplify/utils";

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
    {
        ...amplifyConfig,
        API: {
            ...amplifyConfig.API,
            REST: outputs.custom.API,
        },
    },
    {
        API: {
            REST: {
                retryStrategy: {
                    strategy: "no-retry",
                },
            },
        },
    },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
