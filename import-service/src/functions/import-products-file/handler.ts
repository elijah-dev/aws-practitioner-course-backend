import {
  formatJSONErrorResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<null> = async ({
  queryStringParameters: { name },
}) => {
  try {
    const client = new S3Client({
      region: "eu-central-1",
      credentials: {
        accessKeyId: process.env.S3_FULL_ACCESS_ACCESS_KEY,
        secretAccessKey: process.env.S3_FULL_ACCESS_SECRET,
      },
    });
    const command = new PutObjectCommand({
      Key: `uploaded/${name}`,
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
