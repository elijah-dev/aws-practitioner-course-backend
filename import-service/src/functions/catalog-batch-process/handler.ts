import { formatJSONErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { SQSEvent } from "aws-lambda";
import { getQueryConfig } from "./query";
import { Client } from "pg";
import { pgCredentials } from "src/config/pg-credentials";

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        console.log("Connecting to database");
        const client = new Client(pgCredentials);
        await client.connect();

        const product = JSON.parse(record.body);
        console.log("Creating product: ", product);

        const queryConfig = getQueryConfig(product);
        console.log("Sending query: ", queryConfig);
        const result = await client.query(queryConfig);

        console.log("Query result: ", result);

        if (result.rowCount === 0) {
          throw "Could not create product";
        } else {
          console.log("Product created: ", result.rows[0]);
          return formatJSONResponse(result.rows[0]);
        }
      })
    );
  } catch (error) {
    console.error(error);
    return formatJSONErrorResponse(error);
  }
};

export const main = middyfy(catalogBatchProcess);
