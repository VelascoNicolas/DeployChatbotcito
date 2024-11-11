import { SubMessageController } from "../controllers/subMessage.controller";
import { genericRoutes } from "../types/routeGenerics";
import { SubMessage } from "../entities";
import { SubMessageSchema } from "../schemas/subMessage";
import { SubMessageDto } from "../entities/subMessage";
//import { validateSchema } from "../middlewares";
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkRoleAuth } from "../middlewares/roleProtectionMiddleware";

export const subMessageRouter = () => {
  const subMessageRoutes = genericRoutes(
    SubMessage,
    SubMessage,
    SubMessageDto,
    SubMessageSchema
  );

  const subMessageController = new SubMessageController();

  subMessageRoutes.get(
    "/getAll",
    authMiddleware,
    checkRoleAuth(["admin", "redactor"]),
    (req, res) =>
      /* 
      #swagger.path = '/subMessages/getAll'
      #swagger.tags = ['SubMessage']
      #swagger.description = 'Esta ruta trae todos los submensajes registrados en el sistema.'
      #swagger.security = [{ "bearerAuth": [] }]
      */
      subMessageController.getAllSubMessages(req, res)
  );
  
  subMessageRoutes.get(
    "/getOne/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor"]),
    (req, res) =>
      /* 
      #swagger.path = '/subMessages/getOne/{id}'
      #swagger.tags = ['SubMessage']
      #swagger.description = 'Esta ruta obtiene un submensaje específico por su ID, incluyendo su mensaje padre y sus submensajes hijos si los tiene.'
      #swagger.security = [{ "bearerAuth": [] }]
      */
      subMessageController.getOneSubMessage(req, res)
  );
  
  subMessageRoutes.post(
    "/create/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor"]),
    (req, res) =>
      /* 
      #swagger.path = '/subMessages/create/{id}'
      #swagger.tags = ['SubMessage']
      #swagger.description = 'Esta ruta crea un nuevo submensaje y lo asocia con el mensaje especificado por ID.'
      #swagger.security = [{ "bearerAuth": [] }]
      */
      subMessageController.createSubMessage(req, res)
  );
  
  subMessageRoutes.put(
    "/update/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor"]),
    (req, res) =>
      /* 
      #swagger.path = '/subMessages/update/{id}'
      #swagger.tags = ['SubMessage']
      #swagger.description = 'Esta ruta actualiza un submensaje específico, permitiendo modificar sus datos y la relación con su mensaje padre.'
      #swagger.security = [{ "bearerAuth": [] }]
      */
      subMessageController.updateSubMessage(req, res)
  );

  subMessageRoutes.delete(
    "/softDelete/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor"]),
    (req, res) =>
      /* 
        #swagger.path = '/subMessages/softDelete/{id}'
        #swagger.tags = ['SubMessage']
        #swagger.description = 'Realiza un borrado lógico de un SubMensaje específico'
        #swagger.parameters['id'] = { description: 'ID de un sub mensaje a eliminar' }
        #swagger.security = [{
          "bearerAuth": []
        }]
      */
      subMessageController.softDeleteSubMessage(req, res)
  );

  subMessageRoutes.put(
    "/recover/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor"]), 
    (req, res) =>
      /*
        #swagger.path = '/subMessages/recover/{id}'
        #swagger.tags = ['SubMessage']
        #swagger.description = 'Recupera un SubMensaje previamente eliminado lógicamente, cambiando su estado a no eliminado.'
        #swagger.parameters['id'] = { description: 'ID del sub mensaje a recuperar' }
        #swagger.security = [{ "bearerAuth": [] }]
      */
      subMessageController.recoverSubMessage(req, res)
  );

  return subMessageRoutes;
};