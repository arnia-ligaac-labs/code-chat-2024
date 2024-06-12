#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DbStack } from "../lib/db-stack";
import { WebStack } from "../lib/web-stack";
import { ApiStack } from "../lib/api-stack";
import * as path from "path";

const app = new cdk.App();

const ARTIFACT_PATH_WEB = "../../client/dist";
const ARTIFACT_PATH_API = "../../api/dist";
const projectName = "CodeChat";
const stackEnv = process.env.ENV;
const artifactPathWeb = path.resolve(__dirname, ARTIFACT_PATH_WEB);
const artifactPathApi = path.resolve(__dirname, ARTIFACT_PATH_API);
const region = "us-east-1";
const account = app.node.tryGetContext("CDK_DEFAULT_ACCOUNT");
const isDevContainer = app.node.tryGetContext("DEV_CONTAINER") ?? false;
const domainName = process.env.DOMAIN_NAME;

if (stackEnv === undefined) {
  throw new Error("ENV is not defined");
}
if (domainName === undefined) {
  throw new Error("DOMAIN_NAME is not defined");
}

new DbStack(app, `${projectName}-DB-${stackEnv}`, {
  env: { region },
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  projectName,
  stackEnv,
});

new ApiStack(app, `${projectName}-Api-${stackEnv}`, {
  env: { region, account },
  artifactPath: artifactPathApi,
  domainName,
  projectName,
  stackEnv,
});

new WebStack(app, `${projectName}-Web-${stackEnv}`, {
  env: { region, account },
  artifactPath: artifactPathWeb,
  domainName,
  isDevContainer,
  projectName,
  stackEnv,
});
