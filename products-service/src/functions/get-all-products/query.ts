const query = {
  select: "SELECT p.*, s.count",
  from: "FROM products AS p",
  join: "JOIN stocks AS s",
  on: "ON s.product_id = p.id",
};

export const queryString = [
  query.select,
  query.from,
  query.join,
  query.on,
].join(" ");
