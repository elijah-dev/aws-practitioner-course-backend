import { variableNameToString } from "src/utils/variableNameToString";

export const catalogItemsQueue = {
  Type: "AWS::SQS::Queue",
  Properties: {
    QueueName: process.env.SQS_NAME,
  },
};

const catalogItemsQueueName = variableNameToString({ catalogItemsQueue });

export const catalogItemsQueuePolicy = {
  Type: "AWS::SQS::QueuePolicy",
  Properties: {
    Queues: [{ Ref: catalogItemsQueueName }],
    PolicyDocument: {
      Statement: {
        Action: ["sqs:SendMessage", "sqs:ReceiveMessage"],
        Effect: "Allow",
        Resource: {
          "Fn::GetAtt": [catalogItemsQueueName, "Arn"],
        },
        Principal: {
          AWS: "*",
        },
      },
    },
  },
};
