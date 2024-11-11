import { Request, Response, NextFunction } from "express";
import { getUserByJWT } from "../utils/jwt";
import { CustomError } from "../types";
import { handleErrors } from "../utils";

export const checkRoleAuth =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getUserByJWT(req);
      if (user instanceof CustomError) {
        return handleErrors(user, res);
      }
      const userRole = user.role;

      if (roles.includes(userRole)) {
        next();
        return;
      } else {
        throw new CustomError("You do not have permission", 409);
      }
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        return res
          .status(error.status)
          .json({ error: true, message: error.message });
      } else {
        return res.status(500).json({
          error: true,
          message: "Unknown error: " + error,
        });
      }
    }
  };
