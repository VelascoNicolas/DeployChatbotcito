import { CustomError } from "../types";
import { QueryFailedError } from "typeorm";

export function handleRepositoryError(err: unknown) {
  switch (true) {
    case err instanceof CustomError:
      return err;
    case err instanceof QueryFailedError:
      const driverErr = JSON.parse(JSON.stringify(err.driverError));
      return new CustomError(driverErr.detail, 500);
    default:
      return new CustomError(`Unknown error: ${err}`, 500);
  }
}
