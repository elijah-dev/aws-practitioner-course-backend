import schema from "./schema";
import type { FromSchema } from "json-schema-to-ts";
import { QueryConfig } from "pg";

const query = {
  insert: "INSERT INTO products",
  columns: "(title, description, cost, image)",
  values: "VALUES ($1, $2, $3, $4)",
  returning: "RETURNING *"
};

export const getQueryConfig = ({
  title,
  description,
  cost,
  image,
}: FromSchema<typeof schema>): QueryConfig => ({
  text: [query.insert, query.columns, query.values, query.returning].join(" "),
  values: [title, description, cost, image],
});
