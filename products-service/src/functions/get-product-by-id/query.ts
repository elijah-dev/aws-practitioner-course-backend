import { QueryConfig } from "pg";

const query = {
  select: "SELECT p.*, s.count",
  from: "FROM products AS p",
  join: "JOIN stocks AS s",
  on: "ON s.product_id = p.id",
  where: "WHERE p.id = $1",
};

export const getQueryConfig = (productId: string): QueryConfig => ({
  text: [query.select, query.from, query.join, query.on, query.where].join(" "),
  values: [productId],
});
