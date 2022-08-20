import { AWSResources } from "src/types/resource";

export const CATALOG_ITEMS_QUEUE = "catalogItemsQueue";
export const CATALOG_ITEMS_QUEUE_POLICY = "catalogItemsQueuePolicy";

export const sqs: AWSResources = {
  [CATALOG_ITEMS_QUEUE]: {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: process.env.SQS_NAME,
    },
  },

  [CATALOG_ITEMS_QUEUE_POLICY]: {
    Type: "AWS::SQS::QueuePolicy",
    Properties: {
      Queues: [{ Ref: CATALOG_ITEMS_QUEUE }],
      PolicyDocument: {
        Statement: {
          Action: ["sqs:SendMessage", "sqs:ReceiveMessage"],
          Effect: "Allow",
          Resource: {
            "Fn::GetAtt": [CATALOG_ITEMS_QUEUE, "Arn"],
          },
          Principal: {
            AWS: "*",
          },
        },
      },
    },
  },
};
