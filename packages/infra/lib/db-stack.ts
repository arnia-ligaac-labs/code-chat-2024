import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { BaseProps } from "../interfaces";

export class DbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BaseProps) {
    super(scope, id, props);

    const { projectName, stackEnv } = props;

    const tableMessages = new Table(
      this,
      `${projectName}-Messages-${stackEnv}`,
      {
        tableName: `${projectName}-Messages-${stackEnv}`,
        partitionKey: { name: "pk", type: AttributeType.STRING },
        sortKey: { name: "sk", type: AttributeType.STRING },
        billingMode: BillingMode.PAY_PER_REQUEST,
      }
    );

    tableMessages.addLocalSecondaryIndex({
      indexName: "pk-sk2-index",
      sortKey: { name: "sk2", type: AttributeType.STRING },
    });

    tableMessages.addLocalSecondaryIndex({
      indexName: "pk-sk3-index",
      sortKey: { name: "sk3", type: AttributeType.STRING },
    });

    tableMessages.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "gsi1Pk", type: AttributeType.STRING },
      sortKey: { name: "gsi1Sk", type: AttributeType.STRING },
    });
  }
}
