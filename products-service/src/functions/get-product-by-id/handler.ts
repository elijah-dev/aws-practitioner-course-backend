import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, formatJSONErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Client } from "pg";
import { pgCredentials } from "src/config/pg-credentials";
import { queryString } from "./query";

const getProductById: ValidatedEventAPIGatewayProxyEvent<null> = async (
  event
) => {
  try {
    const productId = event.pathParameters.productId;
    const client = new Client(pgCredentials);
    await client.connect();

    const result = await client.query({
      text: queryString,
      values: [productId],
    });

    if (result.rowCount > 1) {
      return formatJSONErrorResponse(
        "Multiple products with the same id found"
      );
    }

    if (result.rowCount === 0) {
      return formatJSONErrorResponse(
        `Unable to found product with id ${productId}`
      );
    }

    return formatJSONResponse(result.rows[0]);
  } catch (error) {
    console.log(error);
    return formatJSONErrorResponse(JSON.stringify(error));
  }
};

export const main = middyfy(getProductById);
