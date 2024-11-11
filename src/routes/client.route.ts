import { genericRoutes } from "../types/routeGenerics";
import { Client, ClientDTO } from "../entities";
import { ClientSchema } from "../schemas";
//import { ClientController } from "../controllers/client.controller";
// import { Router } from "express";

export const clientRouter = () => {
  const clientRoutes = genericRoutes(Client, Client, ClientDTO, ClientSchema); // lo comenté porque funciona raro cuando se sobreescriben los endpoints
  // const clientRoutes = Router();

  // const clientController = new ClientController();

  // clientRoutes.get("/", (req, res) => clientController.getAll(req, res));
  // clientRoutes.get("/getAllDeleted/", (req, res) => clientController.getAllDeleted(req, res));
  // clientRoutes.get("/getById/:id", (req, res) => clientController.getById(req, res));
  // clientRoutes.post("/", (req, res) => clientController.create(req, res));
  // clientRoutes.patch("/:id", (req, res) => clientController.update(req, res));
  // clientRoutes.delete("/:id", (req, res) => clientController.delete(req, res));
  // clientRoutes.delete("/logicDelete/:id", (req, res) => clientController.logicDelete(req, res));
  // clientRoutes.patch("/restore/:id", (req, res) => clientController.restoreLogicDeleted(req, res));

  return clientRoutes;
};
