import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default {
  name: "create-product",
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "product/create",
        cors: true,
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
