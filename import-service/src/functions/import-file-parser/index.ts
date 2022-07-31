import { handlerPath } from "@libs/handler-resolver";
import { UPLOADS_FOLDER } from "src/config/constants";
import { AWSFunctionConfig } from "src/types/lambda";

const config: AWSFunctionConfig = {
  name: "import-file-parser",
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: process.env.S3_BUCKET_NAME,
        existing: true,
        event: "s3:ObjectCreated:Put",
        rules: [
          {
            prefix: `${UPLOADS_FOLDER}/`,
          },
        ],
      },
    },
  ],
};

export default config;
