import z from "zod";

export const PricingPlanSchema = z.object({
  name: z.string({
    invalid_type_error: "The name must be a string",
    required_error: "The name is required",
  }),

  description: z.string({
    invalid_type_error: "The description must be a string",
    required_error: "The description is required",
  }),

  price: z
    .number({
      invalid_type_error: "The price must be a string",
      required_error: "The price is required",
    })
    .nonnegative({ message: "The price must be a non-negative number" }),
});
