import z from "zod";

export const EnterpriseSchema = z.object({
  name: z
    .string({
      invalid_type_error: "The name must be a string",
      required_error: "The name is required",
    })
    .min(3, "The name must be at least 3 characters long"),

  phone: z
    .number({
      invalid_type_error: "The phone must be a number",
      required_error: "The phone is required",
    })
    .min(9, "The phone is too short")
    .transform((value) => String(value)),

  pricingPlan: z
    .string({
      invalid_type_error: "The pricingPlan must be a string",
    })
    .optional(),

  connected: z
    .boolean({
      invalid_type_error: "Connected must be a boolean",
    })
    .optional(),
});
