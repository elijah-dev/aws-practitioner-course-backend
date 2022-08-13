import { AWS } from "@serverless/typescript";

type AWSResource = AWS["resources"]["Resources"][string];

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

export const importFileParserRole: AWSResource = {
  Type: "AWS::IAM::Role",
  Properties: {
    RoleName: "import-file-parser-role",
    Description: `S3 full access and SQS send message`,
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
                "Fn::Join": [
                  ":",
                  [
                    "arn:aws:sqs",
                    { Ref: "AWS::Region" },
                    { Ref: "AWS::AccountId" },
                    process.env.SQS_NAME,
                  ],
                ],
              },
            },
          ],
        },
      },
    ],
  },
};
