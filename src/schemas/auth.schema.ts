import z from "zod";
import { Role } from "../enums/role.enum";

export const AuthSchema = z.object({
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

  username: z
    .string({
      invalid_type_error: "The username must be a string",
      required_error: "The username is required",
    })
    .min(4, "The username must be at least 4 characters long"),

  role: z
    .nativeEnum(Role, {
      invalid_type_error: "The role must be a string",
      required_error: "The role is required",
    })
    .optional(),
});
