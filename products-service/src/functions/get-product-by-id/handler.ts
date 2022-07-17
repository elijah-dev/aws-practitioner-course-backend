import schema from "@functions/get-product-by-id/schema";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { products } from "src/data/products";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const product = products.find((item) => item.id === event.queryStringParameters.productId);

  return formatJSONResponse({ result: product ?? null });
};

export const main = middyfy(hello);
