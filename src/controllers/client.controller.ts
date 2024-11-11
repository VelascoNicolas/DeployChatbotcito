import { Client, ClientDTO } from "../entities/client";
import { GenericController } from "../types/controllerGenerics";
// import { ClientRepository } from "../repositories/client.repository";
// import { Request, Response } from "express";
// import { CustomError } from "../types";
// import { plainToInstance } from "class-transformer";
// import { toDtoFromEntity } from "../utils";

export class ClientController extends GenericController<Client, ClientDTO> {
  // private clientRepository: ClientRepository;

  constructor() {
    super(Client, Client, ClientDTO);
    // this.clientRepository = new ClientRepository();
  }

  /* async getAll(req: Request, res: Response) {
		try {
			/* Acá la lógica del middleware debería encargarse
			* de obtener y devolver el id del usuario que está 
			* realizando la petición.
			* Por ahora, lo dejo como query para poder probarlo.
			//const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise); Comentado hasta integrar JWT
			// Paginación
			const page = parseInt(req.query.page as string) || 1;
			const entities = await this.clientRepository.findAllEntities(
				req.query.data,
				page,
				{}
			);
			const entitiesDTO = entities.map((entity) => { return toDtoFromEntity(ClientDTO, entity) });
			res.status(200).json(entitiesDTO);
			return;
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async getAllDeleted(req: Request, res: Response) {
		try {
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const entities = await this.clientRepository.findAllDeletedEntitiesForAEnterprise(idEnterprise);
			const entitiesDTO = entities.map((entity) => { return toDtoFromEntity(ClientDTO, entity) });
			return res.status(200).json(entitiesDTO);
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const idClient = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const entity = await this.clientRepository.findByIdEntityForAEnterprise(
				idClient,
				idEnterprise
			);
			res.status(200).json(toDtoFromEntity(ClientDTO, entity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async create(req: Request, res: Response) {
		try {
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const createdEntity = await this.clientRepository.createEntityForAEnterprise(
				plainToInstance(ClientDTO, req.body, { groups: ["private"] }), 
				idEnterprise
			);
			res.status(201).json(toDtoFromEntity(ClientDTO, createdEntity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async update(req: Request, res: Response) {
		try {
			const idClient = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const updatedEntity = await this.clientRepository.updateEntityForAEnterprise(
				idClient,
				idEnterprise,
				plainToInstance(ClientDTO, req.body, { groups: ["private"] })
			);

			if (updatedEntity instanceof CustomError) {
				throw updatedEntity;
			}

			res.status(200).json(toDtoFromEntity(ClientDTO, updatedEntity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const idClient = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			await this.clientRepository.deleteEntityForAEnterprise(idClient, idEnterprise);

			res.status(204).json("Successfully deleted entity").end();
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async logicDelete(req: Request, res: Response) {
		try {
			const idClient = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const deletedEntity = await this.clientRepository.logicDeleteForAEnterprise(idClient, idEnterprise);

			if (deletedEntity instanceof CustomError) {
				throw deletedEntity;
			}

			res.status(204).json("The entity was correctly deleted logically").end();
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async restoreLogicDeleted(req: Request, res: Response) {
		try {
			const idClient = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const restoredEntity = await this.clientRepository.restoreLogicDeletedForAEnterprise(idClient, idEnterprise);

			if (restoredEntity instanceof CustomError) {
				throw restoredEntity;
			}

			res.status(200).json(toDtoFromEntity(ClientDTO, restoredEntity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	} */
}
