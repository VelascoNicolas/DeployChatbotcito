/* import { ExampleController } from "../controllers";
import { genericRoutes } from "../types/routeGenerics";
import { Example } from "../entities";
import { ExampleSchema } from "../schemas";

export const exampleRouter = () => {
	const exampleRoutes = genericRoutes(Example, ExampleSchema);

	const exampleController = new ExampleController();

	exampleRoutes.get("/", exampleController.getAll);
	exampleRoutes.get("/getAllDeleted/", exampleController.getAllDeleted);
	exampleRoutes.get("/getById/:id", exampleController.getById);
	exampleRoutes.post("/", exampleController.create);
	exampleRoutes.patch("/:id", exampleController.update);
	exampleRoutes.delete("/:id", exampleController.delete);
	exampleRoutes.delete("/logicDelete/:id", exampleController.logicDelete);
	exampleRoutes.patch("/restore/:id", exampleController.restoreLogicDeleted);

	return exampleRoutes;
};
 */
