import { Message } from "../entities";
import { GenericRepository } from "../types/repositoryGenerics";
import { AppDataSource } from "../data-source";
import { CustomError } from "../types";
import { EnterpriseRepository } from "./enterprise.repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { MessageDto } from "../entities/message";
import { handleRepositoryError } from "./errorHandler";
import { FlowRepository } from "./flow.repository";
import { validate as isUuid } from "uuid";

export class MessageRepository extends GenericRepository<Message> {
  private repository;
  private flowRepository = new FlowRepository();

  constructor() {
    super(Message);
    this.repository = AppDataSource.getRepository(Message);
    this.flowRepository = new FlowRepository();
  }

  public async findAllMessages(idEnterprise: string): Promise<Message[]> {
    try {
      const entities = await this.repository.find({
        where: { enterprise: { id: idEnterprise } },
        relations: ["flow"],
      });
      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllDeletedMessages(
    idEnterprise: string
  ): Promise<Message[]> {
    try {
      const entities = await this.repository.find({
        where: { enterprise: { id: idEnterprise } },
        relations: ["flow"],
        withDeleted: true,
      });
      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findMessageById(
    id: string,
    idEnterprise: string
  ): Promise<Message> {
    try {
      const entity = await this.repository.findOne({
        where: {
          id: id,
          enterprise: { id: idEnterprise },
        },
        relations: ["flow"],
      });

      if (!entity) {
        throw new CustomError("Entity not found", 404);
      }

      return entity;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllMessagesByNumOrder(
    idEnterprise: string,
    idFlow: string,
    numOrder: number
  ): Promise<Message[]> {
    try {
      const entityFlow = await this.flowRepository.findOne({
        where: { id: idFlow },
      });

      if (!entityFlow) {
        throw new CustomError("Flow not found", 404);
      }

      const entities = await this.repository.find({
        where: {
          enterprise: { id: idEnterprise },
          numOrder: numOrder,
          flow: { id: idFlow },
        },
      });

      if (entities.length <= 0) {
        throw new CustomError("Message not found", 404);
      }

      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllMessagesByNumOrderAndFlowByName(
    idEnterprise: string,
    nameFlow: string,
    numOrder: number
  ): Promise<Message[]> {
    try {
      const entityFlow = await this.flowRepository.findOne({
        where: { name: nameFlow },
      });

      if (!entityFlow) {
        throw new CustomError("Flow not found", 404);
      }

      const entities = await this.repository.find({
        where: {
          enterprise: { id: idEnterprise },
          numOrder: numOrder,
          flow: { id: entityFlow.id },
        },
      });

      if (entities.length <= 0) {
        throw new CustomError("Message not found", 404);
      }

      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async createMessage(
    data: MessageDto,
    idFlow: string,
    idEnterprise: string
  ): Promise<Message> {
    try {
      const enterpriseRepository = new EnterpriseRepository();
      // Buscar la empresa
      const entityEnterprise = await enterpriseRepository.findOne({
        where: { id: idEnterprise },
        relations: ["pricingPlan"],
      });
      if (!entityEnterprise) {
        throw new CustomError("Enterprise not found", 404);
      }
      // Asignarle la empresa a message
      data.enterprise = entityEnterprise;

      // Validar existencia del flow
      if (!idFlow) {
        throw new CustomError("Flow not provided", 400);
      }

      if (!isUuid(idFlow)) {
        throw new CustomError("Invalid flow ID format", 400);
      }
      const entityFlow = await this.flowRepository.findOne({
        where: { id: idFlow },
        relations: ["pricingPlans"],
      });
      if (!entityFlow) {
        throw new CustomError("Flow not found", 404);
      }
      // Validar que el flujo pertenece al plan de precios de la empresa
      const enterprisePlanId = entityEnterprise.pricingPlan.id;
      if (!enterprisePlanId) {
        throw new CustomError("Enterprise does not have an assigned plan", 400);
      }
      const flowPlans = entityFlow.pricingPlans;
      const isFlowInEnterprisePlan = flowPlans.some(
        (plan) => plan.id === enterprisePlanId
      );

      if (!isFlowInEnterprisePlan) {
        throw new CustomError(
          "The flow does not belong to the enterprise's contracted plan",
          400
        );
      }
      // Guarda message en la base de datos junto con la relación de flow y enterprise
      const newEntity = await this.repository.save(data);
      return newEntity;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async updateEntityByEnterprise(
    data: QueryDeepPartialEntity<MessageDto>,
    idMessage: string,
    idEnterprise: string
  ): Promise<Message | CustomError> {
    try {
      const updatedEntity = await this.update(
        {
          id: idMessage,
          enterprise: { id: idEnterprise },
        },
        data
      );
      if (updatedEntity.affected) {
        const newEntity = await this.findMessageById(idMessage, idEnterprise);
        return newEntity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteEntityByEnterprise(
    id: string,
    idEnterprise: string
  ): Promise<Message | CustomError> {
    try {
      const entity = await this.findMessageById(id, idEnterprise);
      if (!entity) {
        throw new CustomError("Entity not found", 404);
      }
      const deletedEntity = await this.delete({
        id: id,
        enterprise: { id: idEnterprise },
      });
      if (deletedEntity.affected) {
        return entity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async logicDeleteByEnterprise(
    id: string,
    idEnterprise: string
  ): Promise<Message | CustomError> {
    try {
      const entity = await this.findMessageById(id, idEnterprise);
      if (!entity) {
        throw new CustomError("Entity not found", 404);
      }
      const deletedEntity = await this.softDelete(id);
      if (deletedEntity.affected) {
        return entity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async restoreLogicDeletedByEnterprise(
    id: string,
    idEnterprise: string
  ): Promise<Message | CustomError> {
    try {
      const entity = await this.findMessageById(id, idEnterprise);
      if (!entity) {
        throw new CustomError("Entity not found", 404);
      }
      const restoredEntity = await this.restore(id);
      if (restoredEntity.affected) {
        return entity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllMainMessages(idEnterprise: string): Promise<Message[]> {
    try {
      console.log("idEnterprise = " + idEnterprise);

      const rootMessages = await this.repository
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.childMessages", "childMessages")
        .where("message.fatherMessageId IS NULL")
        .andWhere("message.enterprise = :idEnterprise", { idEnterprise })
        .orderBy("message.numOrder", "ASC")
        .getMany();

      for (const message of rootMessages) {
        for (const child of message.childMessages) {
          child.childMessages = await this.findChildMessages(child.id);
        }
      }

      return rootMessages;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findAllMainMessagesWithIdFlow(idEnterprise: string, idFlow: string): Promise<Message[]> {
    try {
      const rootMessages = await this.repository
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.childMessages", "childMessages")
        .where("message.fatherMessageId IS NULL")
        .andWhere("message.enterpriseId = :idEnterprise", { idEnterprise })
        .andWhere("message.flowId = :idFlow", { idFlow })
        .orderBy("message.numOrder", "ASC")
        .getMany();
      //console.log(JSON.stringify(rootMessages, null, 2))
      for (const message of rootMessages) {
        for (const child of message.childMessages) {
          child.childMessages = await this.findChildMessages(child.id);
        }
      }
      return rootMessages;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findChildMessages(parentMessageId: string): Promise<Message[]> {
    
    const childMessages = await this.repository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.childMessages", "childMessages")
      .where("message.fatherMessageId = :parentMessageId", { parentMessageId })
      .orderBy("message.numOrder", "ASC")
      .getMany();

    // Recursivamente revisa cada hijo y carga sus hijos, si tiene
    for (const child of childMessages) {
      if (child.childMessages.length > 0) {
        child.childMessages = await this.findChildMessages(child.id); // Carga hijos de nivel más profundo si es necesario
      }
    }

    return childMessages;
  }

  // GetAll de los mensajes con sus submensajes, filtrando por `idEnterprise`
  public async getMessagesWithSubMessages(idEnterprise: string): Promise<Message[]> {
    try {
      const entities = await this.repository.find({
        where: {
          enterprise: { id: idEnterprise },
          isDeleted: false,
        },
        relations: [
          "flow",
          "subMessages",
          "subMessages.childSubMessages",
          "subMessages.childSubMessages.childSubMessages",
        ],
        order: {
          numOrder: "ASC",
        },
      });

      if (!entities || entities.length === 0) {
        throw new CustomError("No messages found", 404);
      }

      return entities;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  // GetOne de un mensaje específico con sus submensajes por ID y `idEnterprise`
  public async getOneWithSubMessages(id: string, idEnterprise: string): Promise<Message> {
    try {
      const entity = await this.repository.findOne({
        where: {
          id: id,
          enterprise: { id: idEnterprise },
          isDeleted: false,  
        },
        relations: [
          "flow",
          "subMessages",
          "subMessages.childSubMessages",
          "subMessages.childSubMessages.childSubMessages",
        ],
      });

      if (!entity) {
        throw new CustomError("Entity not found", 404);
      }

      return entity;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async updateMessage(
      id: string,
      data: MessageDto,
      idEnterprise: string | null,
      idFlow: string | null
  ): Promise<Message> {
      try {
        const message = await this.findOne({ where: { id } });

        if (!message) {
            throw new CustomError("Message not found", 404);
        }

        if (idEnterprise) {
            const enterpriseRepository = new EnterpriseRepository();
            if (!isUuid(idEnterprise)) {
                throw new CustomError("El formato del ID de enterprise no es válido", 400);
            }
            const entityEnterprise = await enterpriseRepository.findOne({ where: { id: idEnterprise } });

            if (!entityEnterprise) {
                throw new CustomError("Enterprise not found", 404);
            }
            message.enterprise = entityEnterprise; // Solo actualizar si se pasa una empresa válida
        }

        if (idFlow) {
            const flowRepository = new FlowRepository();
            if (!isUuid(idFlow)) {
                throw new CustomError("El formato del ID de flow no es válido", 400);
            }
            const entityFlow = await flowRepository.findOne({ where: { id: idFlow } });

            if (!entityFlow) {
                throw new CustomError("Flow not found", 404);
            }
            message.flow = entityFlow; // Solo actualizar si se pasa un flujo válido
        }

        message.numOrder = data.numOrder ?? message.numOrder;
        message.body = data.body ?? message.body;
        message.option = data.option ?? message.option;
        message.isNumber = data.isNumber ?? message.isNumber;
        message.showName = data.showName ?? message.showName;
        message.isName = data.isName ?? message.isName;

        const updatedMessage = await this.save(message);
        return updatedMessage;
    } catch (error) {
        console.error("Error updating message:", error);
        throw handleRepositoryError(error);
    }
  }
 
  // Realiza el soft delete
  public async softDeleteMessage(id: string): Promise<void> {
    try {
      const message = await this.findOne({ where: { id } });

      if (!message) {
        throw new CustomError("Message not found", 404);
      }

      message.isDeleted = true;
      await this.repository.save(message);
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }
}
