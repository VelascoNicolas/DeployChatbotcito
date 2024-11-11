import { Request, Response } from "express";
import { Message } from "../entities";
import { MessageDto } from "../entities/message";
import { MessageRepository } from "../repositories/message.repository";
import { GenericController } from "../types/controllerGenerics";
import { handleErrors, toDtoFromEntity } from "../utils";
// import { CustomError } from "../types";
// import { toDtoFromEntity } from "../utils/transformDto";
// import { MessageDto } from "../entities/message";
import { plainToInstance } from "class-transformer";
//import { AppDataSource } from "../data-source";

export class MessageController extends GenericController<Message, MessageDto> {
  private messageRepository: MessageRepository;

  constructor() {
    super(Message, Message, MessageDto);
    this.messageRepository = new MessageRepository();
  }

  async createMessage(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const idFlow = req.body.flow.toString();
      const entity = await this.messageRepository.createMessage(
        plainToInstance(MessageDto, req.body, { groups: ["private"] }),
        idFlow,
        idEnterprise
      );
      return res.status(201).json(entity);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async findAllMessages(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entities = await this.messageRepository.findAllMessages(
        idEnterprise
      );
      const entitiesDto = entities.map((entity) =>
        toDtoFromEntity(MessageDto, entity)
      );
      return res.status(200).json(entitiesDto);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }
  async findAllMainMessages(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      //console.log("controller idEnterprise = " + idEnterprise)
      const entities = await this.messageRepository.findAllMainMessages(
        idEnterprise
      );
      const entitiesDto = entities.map((entity) =>
        toDtoFromEntity(MessageDto, entity)
      );
      return res.status(200).json(entitiesDto);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async getMessagesAllDeleted(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entities = await this.messageRepository.findAllDeletedMessages(
        idEnterprise
      );
      const entitiesDto = entities.map((entity) =>
        toDtoFromEntity(MessageDto, entity)
      );
      return res.status(200).json(entitiesDto);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async getMessageById(req: Request, res: Response) {
    try {
      const idMessage = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entity = await this.messageRepository.findMessageById(
        idMessage,
        idEnterprise
      );
      return res.json(entity);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async findAllMessagesByNumOrder(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const idFlow = req.query.idFlow as string;

      const numOrder = parseInt(req.query.numOrder as string, 10);

      const entities = await this.messageRepository.findAllMessagesByNumOrder(
        idEnterprise,
        idFlow,
        numOrder
      );
      const entitiesDto = entities.map((entity) =>
        toDtoFromEntity(MessageDto, entity)
      );
      return res.status(200).json(entitiesDto);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async findAllMessagesByNumOrderAndFlowByName(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const nameFlow = req.query.nameFlow as string;
      const numOrder = parseInt(req.query.numOrder as string, 10);

      const entities =
        await this.messageRepository.findAllMessagesByNumOrderAndFlowByName(
          idEnterprise,
          nameFlow,
          numOrder
        );
      const entitiesDto = entities.map((entity) =>
        toDtoFromEntity(MessageDto, entity)
      );
      return res.status(200).json(entitiesDto);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  // Obtener todos los mensajes con sus submensajes
  async getMessagesWithSubMessages(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entities = await this.messageRepository.getMessagesWithSubMessages(idEnterprise);
      const messagesDto = entities.map((message) => toDtoFromEntity(MessageDto, message));
      
      return res.status(200).json(messagesDto);
    } catch (error) {
      return handleErrors(error, res)
    }
  }

  // Obtener un mensaje por ID con sus submensajes
  async getOneWithSubMessages(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entity = await this.messageRepository.getOneWithSubMessages(id, idEnterprise);

      if (!entity) {
        return res.status(404).json({ message: "Message not found" });
      }

      return res.status(200).json(entity);
    } catch (error) {
      return handleErrors(error, res)
    }
  }

  // Controlador para actualizar un mensaje
  async updateMessage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data: MessageDto = req.body;
      const idEnterprise = req.body.enterprise || null;
      const idFlow = req.body.flow || null;

      const updatedMessage = await this.messageRepository.updateMessage(
          id,
          data,
          idEnterprise,
          idFlow
      );

      return res.status(200).json(updatedMessage);
    } catch (error) {
      return handleErrors(error, res)
    }
  }
  
  // Soft delete de un mensaje específico
  public async softDeleteMessage(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;

      await this.messageRepository.softDeleteMessage(id);

      return res.status(200).json({ message: `Message with id ${id} successfully deleted.` });
    } catch (error) {
      return handleErrors(error, res);
    }
  }

  /* 
  async update(req: Request, res: Response) {
    try {
      const idMessage = req.params.id;
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      const entity = await this.messageRepository.updateEntityByEnterprise(
        plainToInstance(MessageDto, req.body, { groups: ["private"] }),
        idMessage,
        idEnterprise
      );
      await this.handleErrors(entity, res);
      return res.json(entity);
    } catch (error: unknown) {
      return await this.handleErrors(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const idMessage = req.params.id;
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      await this.messageRepository.deleteEntityByEnterprise(idMessage, idEnterprise);
      return res.status(204).json("Entity was correctly deleted").end();
    } catch (error: unknown) {
      return await this.handleErrors(error, res);
    }
  }

  async logicDelete(req: Request, res: Response) {
    try {
      const idMessage = req.params.id;
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      const entity = await this.messageRepository.deleteEntityByEnterprise(idMessage, idEnterprise);
      await this.handleErrors(entity, res);
      return res.status(204).json("Entity was correctly deleted").end();
    } catch (error: unknown) {
      return await this.handleErrors(error, res);
    }
  }

  async restoreLogicDeleted(req: Request, res: Response) {
    try {
      const idMessage = req.params.id;
      const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
      const restoredEntity = await this.messageRepository.restoreLogicDeletedByEnterprise(
        idMessage,
        idEnterprise
      );

      if (restoredEntity instanceof CustomError) {
        throw restoredEntity;
      }

      return res.status(200).json(toDtoFromEntity(MessageDto, restoredEntity));
    } catch (error: unknown) {
      return await this.handleErrors(error, res);
    }
  } */
}
