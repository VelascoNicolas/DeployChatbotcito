import z from "zod";
import { Role } from "../enums/role.enum";

export const RoleSchema = z.object({
  role: z.nativeEnum(Role, {
    invalid_type_error: "The role must be a string",
    required_error: "The role is required",
  }),
});
