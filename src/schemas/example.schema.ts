import z from "zod";

export const ExampleSchema = z.object({
	attributeString: z
		.string({
			invalid_type_error: "The attributeString must be a string",
			required_error: "The attributeString is required",
		})
		.min(4),

	attributeNumber: z.coerce
		.number({
			invalid_type_error: "The attributeNumber must be a number",
			required_error: "The attributeNumber is required",
		}),
});
