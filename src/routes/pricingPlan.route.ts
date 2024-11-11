import { genericRoutes } from "../types/routeGenerics";
import { PricingPlan } from "../entities";
//import { PricingPlanController } from "../controllers/pricingPlan.controller";
import { PricingPlanSchema } from "../schemas";
import { PricingPlanDto } from "../entities/pricingPlan/dtos/pricingPlan.dto";

export const pricingPlanRouter = () => {
  const pricingPlanRoutes = genericRoutes(
    PricingPlan,
    PricingPlan,
    PricingPlanDto,
    PricingPlanSchema
  );

  //const pricingPlanController = new PricingPlanController();

  // pricinplanRoutes.get("/", (req, res) => pricinplanController.getAll(req, res));
  // pricinplanRoutes.get("/getAllDeleted/", (req, res) => pricinplanController.getAllDeleted(req, res));
  // pricinplanRoutes.get("/getById/:id", (req, res) => pricinplanController.getById(req, res));
  // pricinplanRoutes.post("/", (req, res) => pricinplanController.create(req, res));
  // pricinplanRoutes.patch("/:id", (req, res) => pricinplanController.update(req, res));
  // pricinplanRoutes.delete("/:id", (req, res) => pricinplanController.delete(req, res));
  // pricinplanRoutes.delete("/logicDelete/:id", (req, res) => pricinplanController.logicDelete(req, res));
  // pricinplanRoutes.patch("/restore/:id", (req, res) => pricinplanController.restoreLogicDeleted(req, res));

  return pricingPlanRoutes;
};
