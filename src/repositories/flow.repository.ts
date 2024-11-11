import { GenericRepository } from "../types/repositoryGenerics";
import { Flow } from "../entities/flow/flow.model";
import { AppDataSource } from "../data-source";
import { CustomError } from "../types";
import { PricingPlan } from "../entities";
import { FlowDto } from "../entities/flow/dtos/flow.dto";
import { handleRepositoryError } from "./errorHandler";
import { EnterpriseRepository } from "./enterprise.repository";
import { MessageRepository } from "./message.repository";

export class FlowRepository extends GenericRepository<Flow> {
  private repository;
  constructor() {
    super(Flow);
    this.repository = AppDataSource.getRepository(Flow);
  }

  public async createFlowWithPricingPlans(data: FlowDto): Promise<Flow> {
    try {
      const pricingPlanRepository = AppDataSource.getRepository(PricingPlan);

      let pricingPlansEntities: PricingPlan[] = [];

      if (data.pricingPlans && data.pricingPlans.length > 0) {
        pricingPlansEntities = await Promise.all(
          data.pricingPlans.map(async (id) => {
            const pricingPlan = await pricingPlanRepository.findOneBy({
              id: id.toString(),
            });
            if (!pricingPlan) {
              throw new CustomError(
                `The PricingPlan with id ${id} was not found`,
                404
              );
            }
            return pricingPlan;
          })
        );
      }

      return this.repository.save({
        name: data.name,
        description: data.description,
        pricingPlans: pricingPlansEntities,
      });
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async updateFlowWithPricingPlans(
    data: FlowDto,
    flowId: string
  ): Promise<Flow> {
    try {
      const pricingPlanRepository = AppDataSource.getRepository(PricingPlan);

      let pricingPlansEntities: PricingPlan[] = [];

      if (data.pricingPlans && data.pricingPlans.length > 0) {
        pricingPlansEntities = await Promise.all(
          data.pricingPlans.map(async (id) => {
            const pricingPlan = await pricingPlanRepository.findOneBy({
              id: id.toString(),
            });
            if (!pricingPlan) {
              throw new CustomError(
                `The PricingPlan with id ${id} was not found`,
                404
              );
            }
            return pricingPlan;
          })
        );
      }

      const flowToUpdate = await this.findOneBy({ id: flowId });

      if (!flowToUpdate) {
        throw new CustomError(`Flow with id ${flowId} not found`, 404);
      }

      if (data.name) {
        flowToUpdate.name = data.name;
      }

      if (data.description) {
        flowToUpdate.description = data.description;
      }

      if (data.pricingPlans) {
        flowToUpdate.pricingPlans = pricingPlansEntities;
      }

      await this.repository.save(flowToUpdate);

      return flowToUpdate;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async getFlowsForPricingPlan(planId: string): Promise<Flow[]> {
    try {
      const entities = this.find({
        where: { pricingPlans: { id: planId } },
      });
      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async getFlowsForPricingPlanAndIdEnterprise(
    idEnterprise: string
  ): Promise<Flow[]> {
    try {
      const enterpriseRepository = new EnterpriseRepository();
      const enterprise =
        await enterpriseRepository.getEnterpriseWithPricingPlan(idEnterprise);
      const entities = this.find({
        where: { pricingPlans: { id: enterprise.pricingPlan.id } },
      });
      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllFlowsWithMessages(idEnterprise: string): Promise<Flow[]> {
    try {
      const messageRepository = new MessageRepository();
      const enterpriseRepository = new EnterpriseRepository();
      const queryBuilder = this.repository.createQueryBuilder('flow');
      const entityEnterprise = await enterpriseRepository.findOne({
        where: { id: idEnterprise },
        relations: ["pricingPlan"],
      });
      if (!entityEnterprise) {
        throw new CustomError("Enterprise not found", 404);
      }
      const enterprisePlanId = entityEnterprise.pricingPlan.id;
      if (!enterprisePlanId) {
        throw new CustomError("Enterprise does not have an assigned plan", 400);
      }
      // const entities = await queryBuilder
      // .leftJoinAndSelect('flow.messages', 'message') 
      // .leftJoin('pricing_plans_flows', 'ppf', 'ppf."flowId" = flow.id') 
      // .where('ppf."pricingPlanId" = :enterprisePlanId', { enterprisePlanId }) 
      // .getMany(); 
      const entities = await queryBuilder
        .leftJoin('pricing_plans_flows', 'ppf', 'ppf."flowId" = flow.id')
        .where('ppf."pricingPlanId" = :enterprisePlanId', { enterprisePlanId })
        .getMany();

      // Llenar cada flujo (flow) con sus mensajes raíz e hijos
      for (const flow of entities) {
        flow.messages = await messageRepository.findAllMainMessagesWithIdFlow(entityEnterprise.id, flow.id);
      }

      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  // Obtener un flujo específico con sus mensajes y submensajes
  public async getOneWithMessagesAndSubMessages(id: string, idEnterprise: string): Promise<Flow | undefined> {
    try {
      const entity = await this.repository.findOne({
        where: { id, isDeleted: false },
      });
  
      if (!entity) {
        throw new CustomError("Flow not found", 404);
      }
  
      const messageRepository = new MessageRepository();
      entity.messages = await messageRepository.getMessagesWithSubMessages(idEnterprise);
  
      // Filtrar mensajes para incluir solo los que pertenecen a este flujo y eliminar la referencia `flow`
      entity.messages = entity.messages
        .filter((message) => message.flow && message.flow.id === id)
        .map((message) => {
          const { flow, ...messageWithoutFlow } = message;
          return messageWithoutFlow;
        });
  
      return entity;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }
  
  // Obtener todos los flujos con sus mensajes y submensajes
  public async getAllWithMessagesAndSubMessages(idEnterprise: string): Promise<Flow[]> {
    try {
      const enterpriseRepository = new EnterpriseRepository();
      const entityEnterprise = await enterpriseRepository.findOne({
        where: { id: idEnterprise },
        relations: ["pricingPlan"],
      });
  
      if (!entityEnterprise) {
        throw new CustomError("Enterprise not found", 404);
      }
  
      const enterprisePlanId = entityEnterprise.pricingPlan?.id;
      if (!enterprisePlanId) {
        throw new CustomError("Enterprise does not have an assigned plan", 400);
      }
  
      const flows = await this.repository.find({
        where: { isDeleted: false },
      });
  
      if (flows.length === 0) {
        return [];
      }
  
      const messageRepository = new MessageRepository();
      const allMessagesWithSubMessages = await messageRepository.getMessagesWithSubMessages(idEnterprise);
  
      // Asignar mensajes a cada flujo según el flujo asociado y eliminar `flow` de cada mensaje
      for (const flow of flows) {
        flow.messages = allMessagesWithSubMessages
          .filter((message) => message.flow && message.flow.id === flow.id)
          .map((message) => {
            const { flow, ...messageWithoutFlow } = message;
            return messageWithoutFlow;
          });
      }
  
      return flows;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  // Realiza el soft delete
  public async softDeleteFlow(id: string): Promise<void> {
    try {
      const flow = await this.findOne({ where: { id } });

      if (!flow) {
        throw new CustomError("Flow not found", 404);
      }

      flow.isDeleted = true;
      await this.repository.save(flow);
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

}