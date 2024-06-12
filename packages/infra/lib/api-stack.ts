import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseProps } from "../interfaces";
import {
  CorsHttpMethod,
  DomainName,
  HttpApi,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { CfnOutput } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { PARAM_SSM_ACM_CERT_ARN } from "../config";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGatewayv2DomainProperties } from "aws-cdk-lib/aws-route53-targets";

export type ApiProps = BaseProps & {
  readonly artifactPath: string;
  readonly domainName: string;
};

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const { artifactPath, domainName, projectName, stackEnv } = props;

    const certArn = StringParameter.fromStringParameterName(
      this,
      `${projectName}-SSM-ACM-Cert-${stackEnv}`,
      `/${projectName.toLowerCase()}${PARAM_SSM_ACM_CERT_ARN}${stackEnv.toLowerCase()}`
    ).stringValue;

    const apiLambda = new Function(
      this,
      `${projectName}-CDN-EdgeViewerRequestLambda-${stackEnv}`,
      {
        functionName: `${projectName}-API-Lambda-${stackEnv}`,
        description: "Lambda function for API",
        runtime: Runtime.NODEJS_20_X,
        handler: "serverless.handler",
        code: Code.fromAsset(artifactPath),
        environment: {
          NODE_ENV: stackEnv,
          APP_MEMORY_CLASS: "dynamodb",
          DYNAMODB_TABLE_MESSAGES: `${projectName}-Messages-${stackEnv}`,
        },
      }
    );

    apiLambda.role?.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ["dynamodb:*"],
        resources: [
          this.formatArn({
            service: "dynamodb",
            resource: "table",
            resourceName: `${projectName}-Messages-${stackEnv}`,
          }),
        ],
      })
    );

    // apiLambda.role?.addToPrincipalPolicy(
    //   new PolicyStatement({
    //     actions: ["bedrock:*"],
    //     resources: ["*"],
    //   })
    // );

    const lambdaIntegration = new HttpLambdaIntegration(
      `${projectName}-API-Lambda-Integration-${stackEnv}`,
      apiLambda
    );

    const domainNameApi = new DomainName(
      this,
      `${projectName}-API-DN-${stackEnv}`,
      {
        domainName: `api.${domainName}`,
        certificate: Certificate.fromCertificateArn(
          this,
          `${projectName}-ACM-Cert-${stackEnv}`,
          certArn
        ),
      }
    );

    const httpApi = new HttpApi(this, `${projectName}-API-${stackEnv}`, {
      defaultIntegration: lambdaIntegration,
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ["*"],
      },
      defaultDomainMapping: {
        domainName: domainNameApi,
      },
    });

    const zone = HostedZone.fromLookup(
      this,
      `${projectName}-R53-Zone-${stackEnv}`,
      {
        domainName,
      }
    );

    new ARecord(this, `${projectName}-R53-A-${stackEnv}`, {
      zone,
      recordName: "api",
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          domainNameApi.regionalDomainName,
          domainNameApi.regionalHostedZoneId
        )
      ),
    });

    new StringParameter(this, `${projectName}-SSM-API-URL-${stackEnv}`, {
      parameterName: `/${projectName.toLowerCase()}/api/url/${stackEnv.toLowerCase()}`,
      stringValue: httpApi.url ?? "Error in API Deployment",
    });

    new CfnOutput(this, `${projectName}-Output-API-${stackEnv}`, {
      value: httpApi.url ?? "Error in API Deployment",
      description: "CloudFront Distribution Domain Name",
    });

    new CfnOutput(this, `${projectName}-Output-API-Domain-Name-${stackEnv}`, {
      value: domainNameApi.regionalDomainName ?? "Error in API Deployment",
      description: "API Domain Name",
    });

    new CfnOutput(
      this,
      `${projectName}-Output-API-Domain-Name-Custom-${stackEnv}`,
      {
        value: `api.${domainName}`,
        description: "API Domain Name Custom",
      }
    );
  }
}
