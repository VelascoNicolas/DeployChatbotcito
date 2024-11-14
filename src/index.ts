import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import * as Routes from "./routes/index";
import swaggerFile from "./docs/swagger-output.json";
import { SwaggerUiOptions } from "./docs/swaggerUiOptions";
import swaggerUi from "swagger-ui-express";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.use(cors());

const apiV1Router = express.Router();

app.use("/api/v1", apiV1Router);

apiV1Router.use("/enterprises", Routes.enterpriseRouter());
apiV1Router.use("/profiles", Routes.profileRouter());
apiV1Router.use("/clients", Routes.clientRouter());
apiV1Router.use("/messages", Routes.messageRouter());
apiV1Router.use("/submessages", Routes.subMessageRouter());
apiV1Router.use("/flows", Routes.flowRouter());
apiV1Router.use("/plans", Routes.pricingPlanRouter());
apiV1Router.use("/authenticated", Routes.authenticatedRoute());
apiV1Router.use("/session", Routes.sessionRouter());

app.use("/docs", swaggerUi.serve);

//Utilizar este en desarrollo
//app.get("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//Utilizar este en produccion

const modo = process.env.NODE_ENV;

if(modo === "production") {
  const swaggerConfig: SwaggerUiOptions = {
    customSiteTitle: 'Backend Generator',
    customfavIcon: 'https://avatars.githubusercontent.com/u/185267919?s=400&u=7d74f9c123b27391d3f11da2815de1e9a1031ca9&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCss: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  };
  
  app.get("/docs", swaggerUi.setup(swaggerFile, swaggerConfig));
} else {
  app.get("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}




// Middleware para manejar rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: true, message: "Route not found" });
});

const APP_PORT = process.env.PORT ?? 1234;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.listen(APP_PORT, () => {
  console.log(`Server running on http://localhost:${APP_PORT}`);
});