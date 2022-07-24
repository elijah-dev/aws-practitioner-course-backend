const query = {
  select: "SELECT DISTINCT *",
  from: "FROM products as p",
  join: "CROSS JOIN",
};

const subquery = {
  select: "SELECT count",
  from: "FROM stocks",
  join: "JOIN products",
  on: "ON stocks.product_id = products.id",
};

const subqueryString = [
  subquery.select,
  subquery.from,
  subquery.join,
  subquery.on,
].join(" ");

export const queryString = [
  query.select,
  query.from,
  query.join,
  `(${subqueryString}) as s`,
].join(" ");
