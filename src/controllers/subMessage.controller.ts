import { Request, Response } from "express";
import { SubMessage } from "../entities";
import { SubMessageDto } from "../entities/subMessage";
import { SubMessageRepository } from "../repositories/subMessage.repository";
import { GenericController } from "../types/controllerGenerics";
import { handleErrors, toDtoFromEntity } from "../utils";
// import { CustomError } from "../types";
// import { toDtoFromEntity } from "../utils/transformDto";
// import { MessageDto } from "../entities/message";
//import { plainToInstance } from "class-transformer";
//import { AppDataSource } from "../data-source";

export class SubMessageController extends GenericController<SubMessage, SubMessageDto> {
  private subMessageRepository: SubMessageRepository;

  constructor() {
    super(SubMessage, SubMessage, SubMessageDto);
    this.subMessageRepository = new SubMessageRepository();
  }

  // Obtener todos los mensajes con sus submensajes
  async getAllSubMessages(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entities = await this.subMessageRepository.getAllSubMessages(idEnterprise);
      const messagesDto = entities.map((subMessage) => toDtoFromEntity(SubMessageDto, subMessage));
      
      return res.status(200).json(messagesDto);
    } catch (error) {
        return handleErrors(error, res)
    }
  }
  
  // Obtener un mensaje por ID con sus submensajes
  async getOneSubMessage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entity = await this.subMessageRepository.getOneSubMessage(id, idEnterprise);
  
      if (!entity) {
        return res.status(404).json({ message: "Message not found" });
      }
  
      return res.status(200).json(entity);
    } catch (error) {
        return handleErrors(error, res)
    }
  }

  // Crear un nuevo submensaje
  async createSubMessage(req: Request, res: Response) {
    try {
      const data: SubMessageDto = req.body;
      const idMessage = req.params.id;
      const idParentSubMessage = req.body.parentSubMessage || null;

      const newSubMessage = await this.subMessageRepository.createSubMessage(
        data,
        idMessage,
        idParentSubMessage
      );

      return res.status(201).json(newSubMessage);
    } catch (error) {
      console.error("Error creating submessage:", error);
      return res.status(500).json({ message: "Error creating submessage" });
    }
  }

  // Controlador para actualizar un submensaje
  async updateSubMessage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data: SubMessageDto = req.body; 
      const idParentSubMessage = req.body.parentSubMessage || null;

      const updatedSubMessage = await this.subMessageRepository.updateSubMessage(
          id,
          data,
          idParentSubMessage
      );

      return res.status(200).json(updatedSubMessage);
    } catch (error) {
      return handleErrors(error, res);
    }
  }

  // Soft delete de un mensaje específico
  public async softDeleteSubMessage(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;

      await this.subMessageRepository.softDeleteSubMessage(id);

      return res.status(200).json({ message: `SubMessage with id ${id} successfully deleted.` });
    } catch (error) {
      return handleErrors(error, res);
    }
  }

  // Recuperar un submensaje específico
  public async recoverSubMessage(req: Request, res: Response): Promise<Response> {
    try {
        const id = req.params.id;

        const recoveredSubMessage = await this.subMessageRepository.recoverSubMessage(id);

        return res.status(200).json({ message: `SubMessage with ID ${id} successfully recovered.`, data: recoveredSubMessage });
    } catch (error) {
        return handleErrors(error, res);
  }
}
}