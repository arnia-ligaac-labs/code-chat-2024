import {
  Account,
  FeatureSet,
  Organization,
  OrganizationalUnit,
  PolicyType,
  Policy,
} from "@pepperize/cdk-organizations";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseProps } from "../interfaces";
import { Effect, PolicyDocument, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { readFileSync } from "fs";
import { join } from "path";

export class OrganizationStack extends Stack {
  constructor(scope: Construct, id: string, props: BaseProps) {
    super(scope, id, props);

    const { projectName, stackEnv } = props;

    const organization = new Organization(
      this,
      `${projectName}-Organization-${stackEnv}`,
      {
        featureSet: FeatureSet.ALL,
      }
    );

    const organizationUnit = new OrganizationalUnit(
      this,
      `${projectName}-OrganizationUnit-${stackEnv}`,
      {
        organizationalUnitName: `${projectName}-OrganizationUnit-${stackEnv}`,
        parent: organization.root,
      }
    );

    organization.enablePolicyType(PolicyType.SERVICE_CONTROL_POLICY);

    const policies = JSON.stringify(
      new PolicyDocument({
        statements: [
          new PolicyStatement({
            sid: "DDB",
            effect: Effect.ALLOW,
            actions: ["dynamodb:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "Lambda",
            effect: Effect.ALLOW,
            actions: ["lambda:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "API",
            effect: Effect.ALLOW,
            actions: ["apigateway:*"],
            resources: ["*"],
          }),
          // new PolicyStatement({
          //   sid: "Bedrock",
          //   effect: Effect.ALLOW,
          //   actions: ["bedrock:*"],
          //   resources: ["*"],
          // }),
          new PolicyStatement({
            sid: "CDN",
            effect: Effect.ALLOW,
            actions: ["cloudfront:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "IAM",
            effect: Effect.ALLOW,
            actions: ["iam:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "CF",
            effect: Effect.ALLOW,
            actions: ["cloudformation:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "R53",
            effect: Effect.ALLOW,
            actions: ["route53:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "CW",
            effect: Effect.ALLOW,
            actions: ["cloudwatch:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "SSM",
            effect: Effect.ALLOW,
            actions: ["ssm:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "ECR",
            effect: Effect.ALLOW,
            actions: ["ecr:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "S3",
            effect: Effect.ALLOW,
            actions: ["s3:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "KMS",
            effect: Effect.ALLOW,
            actions: ["kms:*"],
            resources: ["*"],
          }),
          new PolicyStatement({
            sid: "ACMRead",
            effect: Effect.ALLOW,
            actions: ["acm:ListCertificates"],
            resources: ["*"],
          }),
          //   new PolicyStatement({
          //     sid: "ACM",
          //     effect: Effect.ALLOW,
          //     actions: ["acm:*"],
          //     resources: ["*"],
          //   }),
          //   new PolicyStatement({
          //     sid: "ACMPCA",
          //     effect: Effect.ALLOW,
          //     actions: ["acm-pca:*"],
          //     resources: ["*"],
          //   }),
          new PolicyStatement({
            sid: "DenyOutsideVirginia",
            effect: Effect.DENY,
            actions: ["*"],
            resources: ["*"],
            conditions: {
              StringNotEquals: {
                "aws:RequestedRegion": "us-east-1",
              },
            },
          }),
        ],
      }).toJSON()
    );

    const policy = new Policy(this, `${projectName}-SCP-Policy-${stackEnv}`, {
      content: policies,
      description: "Policy to restrict access to specific services",
      policyName: `${projectName}-SCP-Policy-${stackEnv}`,
      policyType: PolicyType.SERVICE_CONTROL_POLICY,
    });

    organizationUnit.attachPolicy(policy);
    organization.enableAwsServiceAccess("account.amazonaws.com");

    const teacherAccount = new Account(
      this,
      `${projectName}-Account-Teacher-${stackEnv}`,
      {
        accountName: `${projectName}-Account-Teacher-${stackEnv}`,
        email: "contact+codechatteach@crisboarna.com",
        removalPolicy: RemovalPolicy.DESTROY,
        parent: organizationUnit,
      }
    );

    teacherAccount.attachPolicy(policy);

    const filePath = join(__dirname, "../../students.txt");
    const studentsFile = readFileSync(filePath, "utf-8");

    const students = studentsFile.split("\n");

    students.forEach((student) => {
      const [name] = student.split(",");
      const accountName = name.toLowerCase().replace(" ", ".");
      console.log("Student: ", accountName);
      new Account(this, `${projectName}-Student-${accountName}`, {
        accountName: `${projectName.toLowerCase()}-${accountName}`,
        email: `contact+codechat2024.${accountName}@crisboarna.com`,
        removalPolicy: RemovalPolicy.DESTROY,
        parent: organizationUnit,
      });
    });
  }
}
