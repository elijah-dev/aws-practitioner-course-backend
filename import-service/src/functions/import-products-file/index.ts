import { handlerPath } from '@libs/handler-resolver';
import { AWSFunctionConfig } from 'src/types/lambda';

const config: AWSFunctionConfig = {
  name: "import-products-file",
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
              querystrings: {
                name: {
                  required: true
                }
              }
          }
        },
      },
    },
  ],
};

export default config;
