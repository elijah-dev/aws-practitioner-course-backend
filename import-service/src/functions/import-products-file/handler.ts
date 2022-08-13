import {
  formatJSONErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3ClientConfig } from "src/config/s3-client-config";
import { UPLOADS_FOLDER } from "src/config/constants";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<null> = async ({
  queryStringParameters: { name },
}) => {
  try {
    const client = new S3Client(s3ClientConfig);
    const command = new PutObjectCommand({
      Key: `${UPLOADS_FOLDER}/${name}`,
      Bucket: process.env.S3_BUCKET_NAME,
    });
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 5000,
    });

    return formatJSONResponse(signedUrl);
  } catch (error) {
    console.log(error);
    return formatJSONErrorResponse(error);
  }
};

export const main = middyfy(importProductsFile);
