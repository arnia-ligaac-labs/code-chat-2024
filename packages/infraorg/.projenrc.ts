import { awscdk, javascript } from "projen";
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  name: "infraorg",
  projenrcTs: true,

  deps: ["@pepperize/cdk-organizations", "aws-cdk"],
  packageManager: javascript.NodePackageManager.YARN_BERRY,
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
