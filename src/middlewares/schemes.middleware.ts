import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { CustomError } from "../types";
import { handleErrors, processSorting } from "../utils";

/**
 * Middleware para validar un objeto de solicitud (req.body) con un esquema proporcionado.
 *
 * @param schema El esquema de validación a aplicar.
 * @param partial Indica si se debe realizar una validación parcial (true) o completa (false). Por defecto, es false.
 * @returns Un middleware que maneja la validación del esquema.
 */
export const validateSchema =
  (schema: z.AnyZodObject, partial: boolean = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (partial) {
        const result = schema.partial().parse(req.body);
        if (Object.values(result).length === 0) {
          throw new CustomError(
            "You did not provide valid attributes for the entity",
            422
          );
        }
      } else {
        schema.parse(req.body);
      }
      return next();
    } catch (error: any) {
      return handleErrors(error, res);
    }
  };

export const validateQuery =
  (schema: z.AnyZodObject, partial: boolean = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      checkKeys(req.query, schema, true);
      // Check for extra query parameters that are not in the schema

      if (partial) {
        schema.partial().parse(req.query, req.params);
        if (req.query.orderBy) {
          const paramsData = processSorting(req.query.orderBy.toString());
          schema.partial().parse(paramsData);
          checkKeys(paramsData, schema, false);
        }
      } else {
        schema.parse(req.query, req.params);
      }

      return next();
    } catch (error: any) {
      return handleErrors(error, res);
    }
  };

const checkKeys = (
  queryData: object,
  schema: z.AnyZodObject,
  addFiltering: boolean
) => {
  var schemaKeys = Object.keys(schema.shape);
  if (addFiltering) {
    schemaKeys = Object.keys(schema.shape).concat(["orderBy", "page"]);
  }
  const queryKeys = Object.keys(queryData);
  const extraKeys = queryKeys.filter((key) => !schemaKeys.includes(key));

  if (extraKeys.length > 0) {
    throw new CustomError(
      `The query parameters [${extraKeys.join(", ")}] are not valid`,
      422
    );
  }
};
