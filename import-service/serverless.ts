import * as dotenv from "dotenv";
dotenv.config();

import type { AWS } from "@serverless/typescript";
import {
  importProductsFile,
  importFileParser,
  catalogBatchProcess,
} from "@functions/index";
import { resources } from "src/resources";
import { CATALOG_ITEMS_QUEUE } from "src/resources/sqs";
import { CREATE_PRODUCT_TOPIC } from "src/resources/sns";

const region = process.env.REGION as AWS["provider"]["region"];

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    profile: "elijah",
    region,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      REGION: region,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      S3_FULL_ACCESS_ACCESS_KEY: process.env.S3_FULL_ACCESS_ACCESS_KEY,
      S3_FULL_ACCESS_SECRET: process.env.S3_FULL_ACCESS_SECRET,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      SQS_NAME: process.env.SQS_NAME,
      SQS_URL: {
        Ref: CATALOG_ITEMS_QUEUE,
      },
      SNS_ARN: {
        Ref: CREATE_PRODUCT_TOPIC,
      },
    },
  },
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
  package: { individually: true },
  custom: {
    sqsName: process.env.SQS_NAME,
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk", "pg-native"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: resources,
  },
};

module.exports = serverlessConfiguration;
