import { CustomError } from "../types";
import { verifyJWT } from "../utils/jwt";
import { Request, Response } from "express";

export class AuthenticatedController {
  public async isValidToken(req: Request, res: Response) {
    try {
      const token = req.body.token;
      if (!token) {
        throw new CustomError("Token not provided", 400);
      }
      await verifyJWT(token);
      return res.status(200).json({ isValid: true });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        return res.status(200).json({ isValid: false, message: error.message });
      } else {
        return res.status(500).json({ error });
      }
    }
  }
}
