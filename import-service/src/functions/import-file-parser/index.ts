import { handlerPath } from "@libs/handler-resolver";
import { UPLOADS_FOLDER } from "src/config/constants";
import { importFileParserRole } from "src/sls/roles";
import { AWSFunctionConfig } from "src/types/lambda";
import { variableNameToString } from "src/utils/variableNameToString";

const config: AWSFunctionConfig = {
  name: "import-file-parser",
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: variableNameToString({ importFileParserRole }),
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
