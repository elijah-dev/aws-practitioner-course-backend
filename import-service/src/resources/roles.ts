import { AWSResources } from "src/types/resource";
import { CREATE_PRODUCT_TOPIC } from "./sns";
import { CATALOG_ITEMS_QUEUE } from "./sqs";

const loggingPolicy = {
  PolicyName: "Logging_Policy",
  PolicyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        Resource: ["arn:aws:logs:*:*:*"],
      },
    ],
  },
};

const AssumeRolePolicyDocument = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: ["lambda.amazonaws.com"],
      },
      Action: ["sts:AssumeRole"],
    },
  ],
};

export const IMPORT_FILE_PARSER_ROLE = "importFileParserRole";
export const CATALOG_BATCH_PROCESS_ROLE = "catalogBatchProcessRole";

export const roles: AWSResources = {
  [IMPORT_FILE_PARSER_ROLE]: {
    Type: "AWS::IAM::Role",
    Properties: {
      RoleName: "import-file-parser-role",
      Description: `Import file parser role allowing full S3 access and sending messages to SQS`,
      AssumeRolePolicyDocument,
      Policies: [
        loggingPolicy,
        {
          PolicyName: "Import_File_Parser",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["s3:DeleteObject", "s3:GetObject", "s3:PutObject"],
                Resource: [`arn:aws:s3:::${process.env.S3_BUCKET_NAME}/*`],
              },
            ],
          },
        },
        {
          PolicyName: "SQS_Send_Message",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["sqs:SendMessage"],
                Resource: {
                  "Fn::GetAtt": [CATALOG_ITEMS_QUEUE, "Arn"],
                },
              },
            ],
          },
        },
      ],
    },
  },

  [CATALOG_BATCH_PROCESS_ROLE]: {
    Type: "AWS::IAM::Role",
    Properties: {
      RoleName: "catalog-batch-process",
      Description: "Catalog batch process role allowing SQS trigger and SNS publishing",
      AssumeRolePolicyDocument,
      Policies: [
        loggingPolicy,
        {
          PolicyName: "SNS_Publish",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["sns:Publish"],
                Resource: {
                  Ref: CREATE_PRODUCT_TOPIC,
                },
              },
            ],
          },
        },
        {
          PolicyName: "SQS_Receive",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
                Resource: {
                  "Fn::GetAtt": [CATALOG_ITEMS_QUEUE, "Arn"],
                },
              },
            ],
          },
        },
      ],
    },
  },
};
