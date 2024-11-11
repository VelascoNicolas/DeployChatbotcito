import { Enterprise } from "../entities";
import { GenericController } from "../types/controllerGenerics";
import { EnterpriseRepository } from "../repositories/enterprise.repository";
import { Request, Response } from "express";
import { handleErrors } from "../utils/errorsHandler";
import { EnterpriseDto } from "../entities/enterprise";
import { CustomError } from "../types";
import { toDtoFromEntity } from "../utils/transformDto";
import { plainToInstance } from "class-transformer";

export class EnterpriseController extends GenericController<
  Enterprise,
  EnterpriseDto
> {
  private enterpriseRepository: EnterpriseRepository;

  constructor() {
    super(Enterprise, Enterprise, EnterpriseDto);
    this.enterpriseRepository = new EnterpriseRepository();
  }

  updateEnterprise = async (req: Request, res: Response) => {
    try {
      const idEnterprise = req.params.idEnterprise;
      const idPricingPlan = req.body.pricingPlan;
      const updatedEntity =
        await this.enterpriseRepository.updateEnterpriseWithPlan(
          plainToInstance(EnterpriseDto, req.body, { groups: ["private"] }),
          idEnterprise,
          idPricingPlan
        );

      if (updatedEntity instanceof CustomError) {
        throw updatedEntity;
      }
      return res
        .status(200)
        .json(toDtoFromEntity(EnterpriseDto, updatedEntity));
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  };

  async prueba(_req: Request, res: Response) {
    try {
      return res.status(200).json("Probando get");
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async getEnterpriseWithPricingPlan(req: Request, res: Response) {
    try {
      const idEnterprise = req.params.idEnterprise;
      const enterprise =
        await this.enterpriseRepository.getEnterpriseWithPricingPlan(
          idEnterprise
        );

      return res.status(200).json(toDtoFromEntity(EnterpriseDto, enterprise));
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  /*async getAll(req: Request, res: Response) {
    try {
      // Paginación
      const page = parseInt(req.query.page as string) || 1;
      const entities = await this.enterpriseRepository.findAllEntities(
        req.query.data,
        page,
        {}
      );

      const entitiesDTO = entities.map((entity) => {
        return toDtoFromEntity(EnterpriseDto, entity);
      });
      res.status(200).json(entitiesDTO);
      return;
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }*/

  /*
  async getAllDeleted(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const entities = await this.enterpriseRepository.findAllDeletedEntities(
        {},
        page,
        {}
      );
      const entitiesDTO = entities.map((entity) => {
        return toDtoFromEntity(EnterpriseDto, entity);
      });
      return res.status(200).json(entitiesDTO);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      const entity = await this.enterpriseRepository.findOneBy({
        id: idEnterprise,
      });
      if (!entity) {
        throw new CustomError("Entity not found", 404);
      }
      res.status(200).json(toDtoFromEntity(EnterpriseDto, entity));
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async create(req: Request, res: Response) {
    try {
      // Validacion de body hecho con el middleware
      const createdEntity = await this.enterpriseRepository.createEnterpriseEntity(
        plainToInstance(EnterpriseDto, req.body, { groups: ["private"] })
      );
      res.status(201).json(toDtoFromEntity(EnterpriseDto, createdEntity));
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }


  async delete(req: Request, res: Response) {
    try {
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      await this.enterpriseRepository.deleteEnterpriseEntity(idEnterprise);

      res.status(204).json("Successfully deleted entity").end();
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async logicDelete(req: Request, res: Response) {
    try {
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      const deletedEntity = await this.enterpriseRepository.logicDeleteEnterprise(idEnterprise);

      if (deletedEntity instanceof CustomError) {
        throw deletedEntity;
      }

      res.status(204).json("The entity was correctly deleted logically").end();
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async restoreLogicDeleted(req: Request, res: Response) {
    try {
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      const restoredEntity = await this.enterpriseRepository.restoreLogicDeleted(
        idEnterprise
      );

      if (restoredEntity instanceof CustomError) {
        throw restoredEntity;
      }

      res.status(200).json(toDtoFromEntity(EnterpriseDto, restoredEntity));
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  } */
}
