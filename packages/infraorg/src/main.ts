import { App } from "aws-cdk-lib";
import { OrganizationStack } from "./lib/org-stack";

const projectName = "CodeChat";
const stackEnv = "PROD";

const app = new App();

new OrganizationStack(app, `${projectName}-Organization-${stackEnv}`, {
  projectName,
  stackEnv,
});

app.synth();
