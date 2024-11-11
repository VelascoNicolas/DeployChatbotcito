import z from "zod";

export const FlowSchema = z.object({
  name: z
    .string({
      invalid_type_error: "The name must be a string",
      required_error: "The name is required",
    })
    .min(3, "The name must be at least 3 characters long"),

  description: z.string({
    invalid_type_error: "The description must be a string",
    required_error: "The description is required",
  }),

  pricingPlans: z
    .array(
      z.string().uuid({
        message: "Each pricingPlanId must be a valid UUID",
      })
    )
    .nonempty({
      message: "At least one pricingPlanId is required",
    }),
});
