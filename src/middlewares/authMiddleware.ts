import { NextFunction, Response } from "express";
import { getUserByJWT } from "../utils/jwt";
import { CustomError, RequestExt } from "../types";

export const authMiddleware = async (
  req: RequestExt,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByJWT(req);

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: true, message: error.message });
    } else {
      res.status(500).json({
        error: true,
        message: "Unknown error: " + error,
      });
    }
  }
};
