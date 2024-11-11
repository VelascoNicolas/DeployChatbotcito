import { Response } from "express";
import { CustomError } from "../types";

/**
 * Maneja los errores que puedan ocurrir en el controlador/middleware
 * @param error - El error que ocurrió
 * @param res - El objeto de respuesta Express
 * @returns - Una respuesta JSON con un mensaje de error y un código de estado
 */
export const handleErrors = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    return res
      .status(error.status)
      .json({ error: true, message: error.message });
  } else {
    return res.status(500).json({
      error: true,
      message: "Unknown error getting entities " + error,
    });
  }
};
