export default {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    cost: { type: "number" },
    image: { type: "string" },
  },
  required: ["title", "description", "cost"],
} as const;
