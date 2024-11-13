import dotenv from "dotenv";
//import { DatabaseType } from "typeorm";
//import * as Entities from "./entities";  // Asegúrate de importar todas las entidades correctamente
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// import {Base} from "./entities/base/base.model";
// import {Client} from "./entities/client/client.model";
// import {Enterprise} from "./entities/enterprise/enterprise.model";
// import {Message} from "./entities/message/message.model";
// import {Flow} from "./entities/flow/flow.model";
// import {PricingPlan} from "./entities/pricingPlan/pricingPlan.model";
// import {Example} from "./entities/example/example.model";
// import {SubMessage} from "./entities/subMessage/subMessage.model";
import { Profile } from "./entities/profile/profile.model";


dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: 'ep-sweet-thunder-a43jcrun-pooler.us-east-1.aws.neon.tech',
  port: 5432,
  username: 'default',
  password: '9NXUEgliP1QM',
  database: 'verceldb',
  ssl: true,
  //entities: Object.values(Entities),
  entities: [Profile],
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
};

export const limit = 20;  // Límite de items devueltos por página
