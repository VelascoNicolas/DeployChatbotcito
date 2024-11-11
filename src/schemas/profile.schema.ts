import z from "zod";
// import { Role } from "../enums/role.enum";

export const ProfileSchema = z.object({
  email: z
    .string({
      invalid_type_error: "The email must be a string",
      required_error: "The email is required",
    })
    .email("This is not a valid email."),

  password: z
    .string({
      invalid_type_error: "The password must be a string",
      required_error: "The password is required",
    })
    .min(6, "The password must be at least 6 characters long"),
});
