import { StackProps } from "aws-cdk-lib";

export type BaseProps = StackProps & {
  readonly projectName: string;
  readonly stackEnv: string;
};

export enum ENV {
  DEV = "DEV",
  PROD = "PROD",
}
