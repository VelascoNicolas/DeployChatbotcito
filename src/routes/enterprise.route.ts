import { genericRoutes } from "../types/routeGenerics";
import { Enterprise } from "../entities";
import { EnterpriseSchema } from "../schemas";
import { EnterpriseController } from "../controllers/enterprise.controller";
import { EnterpriseDto } from "../entities/enterprise";
import { validateQuery, validateSchema } from "../middlewares";
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkRoleAuth } from "../middlewares/roleProtectionMiddleware";

export const enterpriseRouter = () => {
  const enterpriseRoutes = genericRoutes(
    Enterprise,
    Enterprise,
    EnterpriseDto,
    EnterpriseSchema
  );

  const enterpriseController = new EnterpriseController();

  enterpriseRoutes.get(
    "/prueba",
    authMiddleware,
    validateQuery(EnterpriseSchema, true),
    (req, res) =>
      // #swagger.ignore = true
      enterpriseController.prueba(req, res)
  );

  enterpriseRoutes.get(
    "/getEnterpriseWithPricingPlan/:idEnterprise",
    authMiddleware,
    async (req, res) =>
      /* 
      #swagger.path = '/enterprises/getEnterpriseWithPricingPlan/{idEnterprise}'
      #swagger.tags = ['Enterprise']
      #swagger.description = 'Devuelve la empresa con la relación PricingPlan'
      #swagger.parameters['idEnterprise'] = {
        in: 'path',
        required: true,
        type: 'string',
      }
      #swagger.security = [{
        "bearerAuth": []
      }]
      */
      enterpriseController.getEnterpriseWithPricingPlan(req, res)
  );

  enterpriseRoutes.patch(
    "/update/:idEnterprise",
    authMiddleware,
    checkRoleAuth(["admin"]),
    validateSchema(EnterpriseSchema, true),
    (req, res) =>
      /* 
      #swagger.path = '/enterprises/update/{idEnterprise}'
      #swagger.tags = ['Enterprise']
      #swagger.parameters['body'] = {
					in: 'body',
					schema: { $ref: "#/definitions/EnterprisesUpdate" }
				}

      #swagger.security = [{
						"bearerAuth": []
					}]
     
     */
      enterpriseController.updateEnterprise(req, res)
  );

  //enterpriseRoutes.delete("/:id", enterpriseController.delete);
  //enterpriseRoutes.delete("/logicDelete/:id", enterpriseController.logicDelete);
  //enterpriseRoutes.patch("/restore/:id", enterpriseController.restoreLogicDeleted);
  //enterpriseRoutes.get("/", enterpriseController.getAll);
  //enterpriseRoutes.get("/getAllDeleted/", enterpriseController.getAllDeleted);
  //enterpriseRoutes.get("/getById/:id", enterpriseController.getById);
  //enterpriseRoutes.post("/", enterpriseController.create);

  return enterpriseRoutes;
};
