import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseProps, ENV } from "../interfaces";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { DockerImage, Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  AllowedMethods,
  Distribution,
  HttpVersion,
  LambdaEdgeEventType,
  OriginAccessIdentity,
  OriginRequestPolicy,
  ResponseHeadersPolicy,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  BucketDeployment,
  Source,
  StorageClass,
} from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { PARAM_SSM_ACM_CERT_ARN } from "../config";
import { AaaaRecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

export type WebStackProps = BaseProps & {
  readonly artifactPath: string;
  readonly isDevContainer: boolean;
  readonly domainName: string;
};

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);
    const { artifactPath, isDevContainer, domainName, projectName, stackEnv } =
      props;

    const certArn = StringParameter.fromStringParameterName(
      this,
      `${projectName}-SSM-ACM-Cert-${stackEnv}`,
      `/${projectName.toLowerCase()}${PARAM_SSM_ACM_CERT_ARN}${stackEnv.toLowerCase()}`
    ).stringValue;

    const certificate = Certificate.fromCertificateArn(
      this,
      `${projectName}-ACM-Cert-${stackEnv}`,
      certArn
    );

    const bucket = new Bucket(this, `${projectName}-S3-Bucket-${stackEnv}`, {
      bucketName: `${projectName.toLowerCase()}-web-${stackEnv.toLowerCase()}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy:
        stackEnv !== ENV.PROD ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      autoDeleteObjects: stackEnv !== ENV.PROD,
      encryption: BucketEncryption.S3_MANAGED,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      `${projectName}-CDN-CV-OAI-${stackEnv}`,
      {
        comment: "OAI used by CDN for CV S3 bucket",
      }
    );

    bucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:ListBucket"],
        resources: [bucket.bucketArn],
        principals: [originAccessIdentity.grantPrincipal],
      })
    );
    bucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${bucket.bucketArn}/*`],
        principals: [originAccessIdentity.grantPrincipal],
      })
    );

    const responseHeadersPolicy = new ResponseHeadersPolicy(
      this,
      `${projectName}-CDN-CV-ResponseHeadersPolicy-${stackEnv}`,
      {
        responseHeadersPolicyName: `${projectName}-CDN-CV-ResponseHeadersPolicy-${stackEnv}`,
        comment: "Response headers policy for CDN",
        corsBehavior: {
          accessControlAllowCredentials: false,
          accessControlAllowHeaders: ["*"],
          accessControlAllowMethods: ["ALL"],
          accessControlAllowOrigins: [`*`],
          originOverride: true,
        },
      }
    );

    const edgeViewerRequestLambda = new cloudfront.experimental.EdgeFunction(
      this,
      `${projectName}-CDN-EdgeViewerRequestLambda-${stackEnv}`,
      {
        functionName: `${projectName}-CDN-EdgeViewerRequestLambda-${stackEnv}`,
        description: `Lambda function for CDN Viewer Request ${new Date().toISOString()}`,
        runtime: Runtime.NODEJS_20_X,
        handler: "index.handler",
        code: Code.fromAsset(
          path.join(__dirname, "../lambda/cdn/viewer-request")
        ),
      }
    );

    const cdnDistribution = new Distribution(
      this,
      `${projectName}-CDN-${stackEnv}`,
      {
        comment: `${projectName}${stackEnv}`,
        enabled: true,
        httpVersion: HttpVersion.HTTP2,
        certificate,
        domainNames: [domainName],
        defaultRootObject: "index.html",
        minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
        defaultBehavior: {
          origin: new S3Origin(bucket, { originAccessIdentity }),
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          compress: true,
          responseHeadersPolicy,
          originRequestPolicy: OriginRequestPolicy.fromOriginRequestPolicyId(
            this,
            `${projectName}-CDN-ORP-${stackEnv}`,
            "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"
          ),
          edgeLambdas: [
            {
              eventType: LambdaEdgeEventType.VIEWER_REQUEST,
              functionVersion: edgeViewerRequestLambda.currentVersion,
            },
          ],
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: Duration.minutes(30),
          },
        ],
      }
    );

    let apiUrl = "";
    if (isDevContainer) {
      apiUrl = StringParameter.valueFromLookup(
        this,
        `/${projectName.toLowerCase()}/api/url/${stackEnv.toLowerCase()}`
      );
    }

    const zone = HostedZone.fromLookup(
      this,
      `${projectName}-R53-Zone-${stackEnv}`,
      {
        domainName,
      }
    );

    new AaaaRecord(this, `${projectName}-R53-A-${stackEnv}`, {
      zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cdnDistribution)),
    });

    const deployment = new BucketDeployment(
      this,
      `${projectName}-S3-Deployment-${stackEnv}`,
      {
        sources: [
          Source.asset(
            artifactPath,
            !isDevContainer
              ? {
                  bundling: {
                    command: [
                      "bash",
                      "-c",
                      [
                        "cd /asset-input",
                        "yarn install",
                        "yarn workspace @code-chat-2024/client build",
                        "cp -r /asset-input/dist/* /asset-output/",
                      ].join(" && "),
                    ],
                    image: DockerImage.fromRegistry("node:lts"),
                    environment: {
                      NODE_ENV: "production",
                      NEXT_PUBLIC_API_URL: apiUrl,
                    },
                  },
                }
              : {}
          ),
        ],
        destinationBucket: bucket,
        distribution: cdnDistribution,
        memoryLimit: 256,
        storageClass: StorageClass.INTELLIGENT_TIERING,
      }
    );

    new cdk.CfnOutput(this, `${projectName}-Output-CDN-${stackEnv}`, {
      value: cdnDistribution.distributionDomainName,
      description: "CloudFront Distribution Domain Name",
    });

    new cdk.CfnOutput(this, `${projectName}-Output-CDN-Custom-${stackEnv}`, {
      value: domainName,
      description: "CloudFront Distribution Domain Name Custom",
    });
  }
}
