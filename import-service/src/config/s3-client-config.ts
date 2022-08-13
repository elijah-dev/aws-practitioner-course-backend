import { S3ClientConfig } from "@aws-sdk/client-s3";

export const s3ClientConfig: S3ClientConfig = {
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.S3_FULL_ACCESS_ACCESS_KEY,
    secretAccessKey: process.env.S3_FULL_ACCESS_SECRET,
  },
};
