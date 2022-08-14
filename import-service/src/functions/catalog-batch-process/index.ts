import { handlerPath } from "@libs/handler-resolver";
import { CATALOG_BATCH_PROCESS_ROLE } from "src/resources/roles";
import { CATALOG_ITEMS_QUEUE } from "src/resources/sqs";
import { AWSFunctionConfig } from "src/types/lambda";

const config: AWSFunctionConfig = {
  name: "catalog-batch-process",
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: CATALOG_BATCH_PROCESS_ROLE,
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": [CATALOG_ITEMS_QUEUE, "Arn"],
        },
        batchSize: 5,
        enabled: true
      },
    },
  ],
};

export default config;
