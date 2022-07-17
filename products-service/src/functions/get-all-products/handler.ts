import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from 'src/data/products';
import { Product } from 'src/model/product';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  return formatJSONResponse<Product[]>(products);
};

export const main = middyfy(getAllProducts);

