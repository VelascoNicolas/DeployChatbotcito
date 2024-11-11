import { Enterprise, PricingPlan } from "../entities";
import { GenericRepository } from "../types/repositoryGenerics";
import { AppDataSource } from "../data-source";
import { CustomError } from "../types";
import { EnterpriseDto } from "../entities/enterprise/dtos/enterprise.dto";
import { toEntityFromDto } from "../utils/transformDto";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { handleRepositoryError } from "./errorHandler";

export class EnterpriseRepository extends GenericRepository<Enterprise> {
  private repository;

  constructor() {
    super(Enterprise);
    this.repository = AppDataSource.getRepository(Enterprise);
  }

  public async getEnterpriseWithPricingPlan(
    enterpriseId: string
  ): Promise<Enterprise> {
    try {
      const enterprise = await this.findOne({
        where: { id: enterpriseId },
        relations: ["pricingPlan"],
      });

      if (enterprise) {
        return enterprise;
      } else {
        throw new CustomError("Enterprise not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async updateEnterpriseWithPlan(
    data: QueryDeepPartialEntity<EnterpriseDto>,
    idEnterprise: string,
    idPricingPlan: string
  ) {
    try {
      const pricingPlan = await this.repository.manager
        .getRepository(PricingPlan)
        .findOneBy({ id: idPricingPlan });

      if (!pricingPlan) {
        throw new CustomError("PricingPlan not found", 404);
      }
      const updatedEntity = await this.findOneBy({ id: idEnterprise });
      if (!updatedEntity) {
        throw new CustomError("Enterprise not found", 404);
      }

      if (data.name) {
        updatedEntity.name = data.name.toString();
      }

      if (data.phone) {
        updatedEntity.phone = data.phone.toString();
      }

      if ("connected" in data) {
        if (typeof data.connected === "boolean") {
          updatedEntity.connected = data.connected;
        }
      }

      updatedEntity.pricingPlan = pricingPlan;

      await this.repository.save(updatedEntity);

      return updatedEntity;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  // Metodos de busqueda heredados del generico
  public async createEnterpriseEntity(
    data: EnterpriseDto
  ): Promise<Enterprise> {
    try {
      const entity = toEntityFromDto(Enterprise, data);
      await this.repository.save(data);
      return entity;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error: " + error, 500);
      }
    }
  }

  public async deleteEnterpriseEntity(
    idEntity: string
  ): Promise<Enterprise | CustomError> {
    try {
      const result = await this.repository.delete(idEntity);

      if (result.affected) {
        return result.raw;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error" + error, 500);
      }
    }
  }

  public async logicDeleteEnterprise(id: string): Promise<Enterprise> {
    try {
      const result = await this.repository.softDelete(id);

      if (result.affected) {
        return result.raw;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error" + error, 500);
      }
    }
  }
}
