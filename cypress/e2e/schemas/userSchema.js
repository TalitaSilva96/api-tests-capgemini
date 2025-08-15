export const userSchema = {
  type: "object",
  required: ["id", "name", "email", "isAdmin"],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
    isAdmin: { type: "boolean" }
  }
};