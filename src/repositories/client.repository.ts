import { Client } from "../entities";
import { ClientDTO } from "../entities/client";
import { CustomError } from "../types";
import { GenericRepository } from "../types/repositoryGenerics";
import { EnterpriseRepository } from "./enterprise.repository";
import { toEntityFromDto } from "../utils";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { handleRepositoryError } from "./errorHandler";

export class ClientRepository extends GenericRepository<Client> {
  constructor() {
    super(Client);
  }

  public async findAllEntitiesForAEnterprise(
    idEnterprise: string
  ): Promise<Client[]> {
    try {
      const entities = await this.find({
        where: { enterprise: { id: idEnterprise } },
        relations: ["enterprise"],
      });
      return entities;
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllDeletedEntitiesForAEnterprise(
    idEnterprise: string
  ): Promise<Client[]> {
    try {
      return await this.find({
        where: { enterprise: { id: idEnterprise } },
        withDeleted: true,
        relations: ["enterprise"],
      });
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async findByIdEntityForAEnterprise(
    idClient: string,
    idEnterprise: string
  ): Promise<Client> {
    try {
      const entity = await this.findOneBy({
        id: idClient,
        enterprise: { id: idEnterprise },
      });
      if (entity) {
        return entity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async createEntityForAEnterprise(
    data: ClientDTO,
    idEnterprise: string
  ): Promise<Client> {
    try {
      const enterpriseRepository = new EnterpriseRepository();
      const enterprise = await enterpriseRepository.findByIdEntity(
        idEnterprise
      );
      if (!enterprise) {
        throw new CustomError("Enterprise not found", 404);
      }
      data.enterprise = enterprise;
      const newEntity = toEntityFromDto(Client, data);
      return await this.save(newEntity);
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async updateEntityForAEnterprise(
    idClient: string,
    idEnterprise: string,
    data: QueryDeepPartialEntity<ClientDTO>
  ): Promise<Client | CustomError> {
    try {
      const entityUpdated = await this.update(
        {
          // chequear si es mejor con find y save, update no chequea si existe
          id: idClient,
          enterprise: { id: idEnterprise },
        },
        data
      );
      if (entityUpdated.affected) {
        const restoredEntity = await this.findByIdEntity(idClient);
        return restoredEntity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteEntityForAEnterprise(
    idClient: string,
    idEnterprise: string
  ): Promise<Client | CustomError> {
    try {
      const result = await this.findOneOrFail({
        where: { id: idClient },
        relations: ["enterprise"],
      })
        .then(async (client) => {
          if (client.enterprise.id === idEnterprise) {
            return await this.delete(idClient);
          } else {
            throw new CustomError("Permission denied", 403);
          }
        })
        .catch((error) => {
          throw error;
        });
      if (result.affected) {
        return result.raw;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async logicDeleteForAEnterprise(
    idClient: string,
    idEnterprise: string
  ): Promise<Client> {
    try {
      const result = await this.findOneOrFail({
        where: { id: idClient },
        relations: ["enterprise"],
      })
        .then(async (client) => {
          if (client.enterprise.id === idEnterprise) {
            return await this.softDelete(idClient);
          } else {
            throw new CustomError("Permission denied", 403);
          }
        })
        .catch((error) => {
          throw error;
        });
      if (result.affected) {
        return result.raw;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async restoreLogicDeletedForAEnterprise(
    idClient: string,
    idEnterprise: string
  ): Promise<Client> {
    try {
      const result = await this.restore({
        id: idClient,
        enterprise: { id: idEnterprise },
      });
      if (result.affected) {
        return await this.findByIdEntity(idClient);
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }
}
