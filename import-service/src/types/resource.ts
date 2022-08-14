import { AWS } from "@serverless/typescript";

export type AWSResources = AWS["resources"]["Resources"];
export type AWSResource = AWSResources[string];
