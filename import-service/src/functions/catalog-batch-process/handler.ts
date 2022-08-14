import { formatJSONErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { SQSEvent } from "aws-lambda";
import { getQueryConfig } from "./query";
import { Client } from "pg";
import { pgCredentials } from "src/config/pg-credentials";
import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
} from "@aws-sdk/client-sns";

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    console.log("Connecting to database");
    const dbClient = new Client(pgCredentials);
    await dbClient.connect();
    console.log("Successfuly connected to database");

    console.log("Creating SNS instance");
    const snsClient = new SNSClient({ region: process.env.REGION });

    console.log("Creating products");
    await Promise.all(
      event.Records.map(async (record) => {
        const product = JSON.parse(record.body);
        console.log("Creating product: ", product);

        const queryConfig = getQueryConfig(product);
        console.log("Sending query: ", queryConfig);
        const queryResult = await dbClient.query(queryConfig);

        console.log("Query result: ", queryResult);

        if (queryResult.rowCount === 0) {
          throw "Could not create product";
        } else {
          const createdProduct = queryResult.rows[0];
          console.log("Product created: ", createdProduct);

          const publishComandConfig: PublishCommandInput = {
            Message: JSON.stringify(createdProduct),
            TopicArn: process.env.SNS_ARN,
          };
          console.log("Sending notification: ", publishComandConfig);
          const publishCommand = new PublishCommand(publishComandConfig);
          const publishResult = await snsClient.send(publishCommand);
          console.log("Notification sent with result: ", publishResult);

          return formatJSONResponse(createdProduct);
        }
      })
    );
  } catch (error) {
    console.error(error);
    return formatJSONErrorResponse(error);
  }
};

export const main = middyfy(catalogBatchProcess);
