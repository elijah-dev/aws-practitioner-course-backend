import { roles } from "./roles";
import { sns } from "./sns";
import { sqs } from "./sqs";

export const resources = {
  ...roles,
  ...sns,
  ...sqs,
};
