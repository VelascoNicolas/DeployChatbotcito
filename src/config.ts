import dotenv from "dotenv";
import { DatabaseType } from "typeorm";
//import * as Entities from "./entities";  // Asegúrate de importar todas las entidades correctamente
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {Profile} from "./entities/agent/profile.model";
import {Base} from "./entities/base/base.model";
import {Client} from "./entities/client/client.model";
import {Enterprise} from "./entities/enterprise/enterprise.model";
import {Message} from "./entities/message/message.model";
import {Flow} from "./entities/flow/flow.model";
import {PricingPlan} from "./entities/pricingPlan/pricingPlan.model";
import {Example} from "./entities/example/example.model";
import {SubMessage} from "./entities/subMessage/subMessage.model";

dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
  type: (process.env.DB_TYPE as DatabaseType) || "postgres",
  url: process.env.DB_URL || "sqlite:memory",
  //entities: Object.values(Entities),
  entities: [Profile, Base, Client, Enterprise, Message, Flow, PricingPlan, Example, SubMessage],
  synchronize: false, 
  logging: false,
  autoLoadEntities: true
};

export const limit = 20;  // Límite de items devueltos por página
