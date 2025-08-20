# AirAlert_IoT_web_panel
Code for the amplify deployment space to use as the web app for the project "AirAlert"

> !!!ATTENTION!!!
> For this repository, the [Amplify React+Vite template](https://github.com/aws-samples/amplify-vite-react-template) was used as a template.

## Description and Overview

This repository provides AWS Amplify configuration code for creating:
- an **API (REST)** for modifying controller properties and measurement data entries.
- a **Cognito** security implementation for restricted access
- a React-based frontend **web page** for visual data insight and configuration

## Installation and initialization

> !!!ATTENTION!!!
> Copying the repository's content and pasting it inside another is **not recommended**.
> Please **FORK** this repository if you want to deploy or develop inside its code.

### Preconfiguring the AWS cloud infrastructure

**MAKE SURE** you have yet followed the initial steps inside the [preparation repository](https://github.com/AirAlert-WR/server_repository). These are necessary for the web panel to work properly.

### Deploying to AWS

Short instruction:
Go to your admin console and navigate to the amplify section. Add a new GitHub connection for accessing the repository. Then, deploy the app (during this process, a build is also performed).

For detailed instructions on deploying this application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of Amazon's documentation.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
