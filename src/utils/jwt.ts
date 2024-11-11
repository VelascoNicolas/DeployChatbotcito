import { verify } from "jsonwebtoken";
import { Request } from "express";
import { CustomError } from "../types";
const secret = process.env.JWT_SECRET || "";

export const verifyJWT = (token: string) => {
  try {
    const decodedToken = verify(token, secret);
    return decodedToken;
  } catch (error) {
    throw new CustomError("Failed to authenticate token" + error, 401);
  }
};

export const getUserByJWT = async (req: Request) => {
  try {
    const token = req.headers.authorization || "";
    const jwt = token.split(" ")[1];

    if (jwt === "") {
      return new CustomError("No token provided", 401);
    }

    const user = (await verifyJWT(jwt)) as {
      email: string;
      sub: string;
      role: string;
    };

    return user;
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError("Unknown error: " + error, 500);
    }
  }
};
