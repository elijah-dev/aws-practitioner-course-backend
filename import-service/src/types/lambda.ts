import { AWS } from "@serverless/typescript";

type AWSFunctionsConfig = AWS["functions"];
type AWSFunctionsConfigKey = keyof AWSFunctionsConfig;

export type AWSFunctionConfig = AWSFunctionsConfig[AWSFunctionsConfigKey];
