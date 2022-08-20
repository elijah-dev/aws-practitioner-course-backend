import { handlerPath } from '@libs/handler-resolver';

export default {
  name: "basic-authorizer",
  handler: `${handlerPath(__dirname)}/handler.main`,
};
