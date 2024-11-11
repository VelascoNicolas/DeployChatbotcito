import { Router } from "express";
import { SessionController } from "../controllers";

export const sessionRouter = () => {
  const sessionRoutes = Router();
  const sessionController = new SessionController();

  sessionRoutes.get(
    "/getSession",
    /* 
            #swagger.path = '/session/getSession'
            #swagger.tags = ['Session']
            #swagger.description = 'Obtiene la sesión actual del usuario.'
        */
    (req, res) => sessionController.getSession(req, res)
  );

  sessionRoutes.post(
    "/refreshSession",
    /* 
    #swagger.path = '/session/refreshSession'
    #swagger.tags = ['Session']
    #swagger.description = 'Refresca la sesión del usuario utilizando el token de actualización.'
    #swagger.parameters['body'] = {
      in: 'body',
      name: 'body',
      required: true,
      schema: {
         $token: 'String',
         $refresh_token: 'String'
      },
      description: 'Cuerpo de la solicitud con el token de autenticación y el token de actualización'
    }
  */
    (req, res) => sessionController.refreshSession(req, res)
  );

  return sessionRoutes;
};
