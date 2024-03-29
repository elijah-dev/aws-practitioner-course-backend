import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { formatJSONErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Handler, S3Event } from "aws-lambda";
import { PARSED_FILES_FOLDER, UPLOADS_FOLDER } from "src/config/constants";

const csv = require("csv-parser");

const importFileParser: Handler<S3Event> = async ({ Records }) => {
  try {
    const record = Records[0];

    if (!record) {
      return formatJSONErrorResponse("Uploaded file not found");
    }

    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    const commandConfig = {
      Bucket: bucket,
      Key: key,
    };

    const s3Client = new S3Client({ region: process.env.REGION });
    const getCommand = new GetObjectCommand(commandConfig);

    const sqsClient = new SQSClient({ region: process.env.REGION });

    const { Body } = await s3Client.send(getCommand);

    const parse = async () =>
      new Promise((resolve, reject) => {
        Body.pipe(csv())
          .on("data", async (data) => {
            console.log("Sending message to SQS:", data);
            const sendMessageCommand = new SendMessageCommand({
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(data),
            });
            const messageResult = await sqsClient.send(sendMessageCommand);
            console.log("Message sent with result: ", messageResult);
          })
          .once("error", (error) => {
            reject(error);
          })
          .once("end", async () => {
            const copyCommand = new CopyObjectCommand({
              ...commandConfig,
              Key: key.replace(UPLOADS_FOLDER, PARSED_FILES_FOLDER),
              CopySource: `${bucket}/${key}`,
            });

            console.log("Sending copy command to S3: ", copyCommand);
            const copyResult = await s3Client.send(copyCommand);
            console.log("Copied with result: ", copyResult);

            console.log("Sending delete command to S3: ", copyCommand);
            const deleteCommand = new DeleteObjectCommand(commandConfig);
            const deleteResult = await s3Client.send(deleteCommand);
            console.log("Deleted with result: ", deleteResult);

            resolve("Parsed successfully");
          });
      });

    const message = await parse();
    return formatJSONResponse(message);
  } catch (error) {
    console.log(error);
    return formatJSONErrorResponse(error);
  }
};

export const main = middyfy(importFileParser);
