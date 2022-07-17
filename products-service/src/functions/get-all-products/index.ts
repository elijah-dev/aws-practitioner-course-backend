import { handlerPath } from "@libs/handler-resolver";

export default {
  name: "get-all-products",
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors: true,
      },
    },
  ],
};
