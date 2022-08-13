import { handlerPath } from "@libs/handler-resolver";
import { catalogItemsQueue } from "src/sls/sqs";
import { AWSFunctionConfig } from "src/types/lambda";
import { variableNameToString } from "src/utils/variableNameToString";

const config: AWSFunctionConfig = {
  name: "catalog-batch-process",
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": [variableNameToString({ catalogItemsQueue }), "Arn"],
        },
        batchSize: 5
      },
    },
  ],
};

export default config;
