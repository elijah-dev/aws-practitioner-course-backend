import { AWSResources } from "src/types/resource";

export const CREATE_PRODUCT_TOPIC = "createProductTopic";
export const CREATE_PRODUCT_TOPIC_SUBSCRIPTION =
  "createProductTopicSubscription";

export const sns: AWSResources = {
  [CREATE_PRODUCT_TOPIC]: {
    Type: "AWS::SNS::Topic",
    Properties: {
      DisplayName: "Create product topic",
      TopicName: process.env.SNS_TOPIC_NAME,
    },
  },

  [CREATE_PRODUCT_TOPIC_SUBSCRIPTION]: {
    Type: "AWS::SNS::Subscription",
    Properties: {
      Protocol: "email",
      Endpoint: process.env.NOTIFICATION_EMAIL,
      TopicArn: {
        Ref: CREATE_PRODUCT_TOPIC,
      },
    },
  },
};
