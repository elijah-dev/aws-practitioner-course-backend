import {
  formatJSONErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Client } from "pg";
import { pgCredentials } from "src/config/pg-credentials";
import { queryString } from "./query";

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  try {
    const client = new Client(pgCredentials);
    await client.connect();

    const result = await client.query(queryString);

    return formatJSONResponse(result.rows);
  } catch (error) {
    console.log(error);
    return formatJSONErrorResponse(JSON.stringify(error));
  }
};

export const main = middyfy(getAllProducts);
