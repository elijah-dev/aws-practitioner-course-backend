import { handlerPath } from "@libs/handler-resolver";

export default {
  name: "get-product-by-id",
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "product",
        request: {
          parameters: {
            querystrings: {
              productId: true,
            },
          },
        },
      },
    },
  ],
};
