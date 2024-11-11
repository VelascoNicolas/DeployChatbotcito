import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export class CustomError extends Error {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;
  }
}

export interface RequestExt extends Request {
  user?: string | JwtPayload;
}
