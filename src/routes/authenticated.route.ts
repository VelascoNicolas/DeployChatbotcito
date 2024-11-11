import { Router } from "express";
import { AuthenticatedController } from "../controllers/authenticated.controller";

export const authenticatedRoute = () => {
  const authenticatedRoutes = Router();
  const authenticatedController = new AuthenticatedController();

  authenticatedRoutes.post("/", (req, res) =>
    /* 	
				#swagger.path = '/authenticated'
        #swagger.tags = ['Authenticated']
				#swagger.description = 'A partir del token, retorna si es válido o no' 
				
				#swagger.parameters['body'] = {
					in: 'body',
					schema: { $ref: "#/definitions/Authenticated" }
				}
			*/
    authenticatedController.isValidToken(req, res)
  );

  return authenticatedRoutes;
};
