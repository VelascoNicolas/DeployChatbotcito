import z from "zod";

export const ClientSchema = z.object({
  username: z.string({
    invalid_type_error: "The username must be a string",
    required_error: "The username is required",
  }),

  phone: z
    .number({
      invalid_type_error: "The phone must be a number",
      required_error: "The phone is required",
    })
    .transform((value) => String(value)),
});
