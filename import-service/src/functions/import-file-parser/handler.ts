import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { formatJSONErrorResponse, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Handler, S3Event } from "aws-lambda";
import { s3ClientConfig } from "src/config/s3-client-config";
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

    const client = new S3Client(s3ClientConfig);
    const getCommand = new GetObjectCommand(commandConfig);

    const { Body } = await client.send(getCommand);

    const parse = async () =>
      new Promise((resolve, reject) => {
        Body.pipe(csv())
          .on("data", (data) => {
            console.log(data);
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
            await client.send(copyCommand);
            const deleteCommand = new DeleteObjectCommand(commandConfig);
            await client.send(deleteCommand);
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
