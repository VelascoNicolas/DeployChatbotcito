import z from "zod";

export const MessageSchema = z.object({
  numOrder: z
    .number({
      invalid_type_error: "The numOrder must be a number",
      required_error: "The numOrder is required",
    })
    .positive(),
  body: z.string({
    invalid_type_error: "The body must be a string",
    required_error: "The body is required",
  }),
  flow: z.string({
    invalid_type_error: "The flow must be a string",
    required_error: "The flow is required",
  }),
});
