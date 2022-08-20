import { formatJSONErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  PolicyDocument,
} from "aws-lambda";

enum Effect {
  Allow = "Allow",
  Deny = "Deny",
}

const generatePolicyDocument = (
  effect: Effect,
  resource: string
): PolicyDocument => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };
};

const generateResponse = (
  principalId: string,
  effect: Effect,
  resource: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, resource),
  };
};

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => {
  try {
    console.log("Event: ", event)
    const { authorizationToken, methodArn } = event;

    console.log("Decoding token");
    const principalId = Buffer.from(authorizationToken, "base64")
      .toString("ascii")
      .split(":")[0];

    console.log("Token decoded");
    console.log("Principal: ", principalId);

    const response =
      authorizationToken === process.env.AUTHORIZATION_TOKEN
        ? generateResponse(principalId, Effect.Allow, methodArn)
        : generateResponse(principalId, Effect.Deny, methodArn);

    console.log("Response: ", JSON.stringify(response));

    return response;
  } catch (error) {
    console.error(error);
    return formatJSONErrorResponse(error);
  }
};

export const main = middyfy(basicAuthorizer);
