export const ticketSchema = {
  type: "object",
  required: ["id", "title", "description", "userId", "status", "createdAt"],
  properties: {
    id: { type: "number" },
    title: { type: "string" },
    description: { type: "string" },
    userId: { type: "number" },
    status: { type: "string" },
    createdAt: { type: "string", format: "date-time" }
  }
};