import dotenv from "dotenv";
import { DatabaseType } from "typeorm";
import * as Entities from "./entities";  // Asegúrate de importar todas las entidades correctamente

dotenv.config();

export const dbConfig = {
  type: (process.env.DB_TYPE as DatabaseType) || "postgres",
  url: process.env.DB_URL || "sqlite:memory",
  entities: Object.values(Entities),
  synchronize: true, 
  subscribers: [],
  migrations: [],
};

export const limit = 20;  // Límite de items devueltos por página
