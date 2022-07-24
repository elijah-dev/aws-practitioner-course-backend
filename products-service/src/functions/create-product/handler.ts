import {
  formatJSONErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Client } from "pg";
import { pgCredentials } from "src/config/pg-credentials";
import { getQueryConfig } from "./query";
import schema from "./schema";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const body = event.body;
  const queryConfig = getQueryConfig(body);
  try {
    const client = new Client(pgCredentials);
    await client.connect();

    const result = await client.query(queryConfig);

    if (result.rowCount === 0) {
      return formatJSONErrorResponse("Could not create product");
    }

    return formatJSONResponse(result.rows[0]);
  } catch (error) {
    console.log(error);
    return formatJSONErrorResponse({ error, requestBody: body, queryConfig });
  }
};

export const main = middyfy(createProduct);
