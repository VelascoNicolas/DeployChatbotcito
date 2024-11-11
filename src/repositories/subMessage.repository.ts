import { SubMessage } from "../entities";
import { GenericRepository } from "../types/repositoryGenerics";
import { AppDataSource } from "../data-source";
import { CustomError } from "../types";
import { handleRepositoryError } from "./errorHandler";
import { SubMessageDto } from "../entities/subMessage";
import { MessageRepository } from "./message.repository";
//import { FlowRepository } from "./flow.repository";
import { validate as uuidValidate } from 'uuid';

export class SubMessageRepository extends GenericRepository<SubMessage> {
    private repository;
    //private flowRepository = new FlowRepository();

    constructor() {
    super(SubMessage);
    this.repository = AppDataSource.getRepository(SubMessage);
    // this.flowRepository = new FlowRepository();
    }

    // Obtener todos los submensajes con sus relaciones, filtrando por `idEnterprise` y `isDeleted`
    public async getAllSubMessages(idEnterprise: string): Promise<SubMessage[]> {
        try {
            const entities = await this.repository.find({
            where: {
                isDeleted: false,
                message: { enterprise: { id: idEnterprise } },
            },
            relations: [
                "childSubMessages",
                "parentSubMessage",
                "message",
            ],
            order: {
                numOrder: "ASC",
            },
            });

            if (!entities || entities.length === 0) {
            throw new CustomError("No subMessages found", 404);
            }

            return entities;
        } catch (error) {
            throw handleRepositoryError(error);
        }
    }

    // Obtener un submensaje específico por ID con sus relaciones
    public async getOneSubMessage(id: string, idEnterprise: string): Promise<SubMessage> {
        try {
            const subMessage = await this.repository.findOne({
            where: {
                id: id,
                isDeleted: false,
                message: { enterprise: { id: idEnterprise } },
            },
            relations: [
                "childSubMessages",
                "parentSubMessage",
                "message",
            ],
            });

            if (!subMessage) {
            throw new CustomError("SubMessage not found", 404);
            }

            return subMessage;
        } catch (error) {
            throw handleRepositoryError(error);
        }
    }

    // Crear un nuevo submensaje
    public async createSubMessage(
        data: SubMessageDto,
        idMessage: string,
        idParentSubMessage: string | null
    ): Promise<SubMessage> {
        try {
            // Buscar el mensaje al que se asociará el submensaje
            const messageRepository = new MessageRepository();
            const entityMessage = await messageRepository.findOne({ where: { id: idMessage } });
        
            if (!entityMessage) {
                throw new CustomError("Message not found", 404);
            }
        
            // Buscar el submensaje padre si se proporciona
            let parentSubMessage: SubMessage | null = null;
            if (idParentSubMessage) {
                parentSubMessage = await this.findOne({ where: { id: idParentSubMessage } });
            if (!parentSubMessage) {
                throw new CustomError("Parent submessage not found", 404);
            }
            }
        
            const newSubMessage = this.create({
                numOrder: data.numOrder,
                body: data.body,
                option: data.option,
                isNumber: data.isNumber,
                message: entityMessage,
                parentSubMessage: parentSubMessage,
                childSubMessages: [],
            });
        
            const savedSubMessage = await this.save(newSubMessage);
            return savedSubMessage;
        } catch (error) {
            throw handleRepositoryError(error);
        }
    }

    // Actualizar un submensaje específico
    public async updateSubMessage(
        id: string,
        data: SubMessageDto,
        idParentSubMessage: string | null
    ): Promise<SubMessage> {
        try {
            console.log("Attempting to update submessage with ID:", id);
            const subMessage = await this.findOne({ where: { id } });

            if (!subMessage) {
                throw new CustomError("SubMessage not found", 404);
            }

            if (data.message && data.message.id) {
                const messageRepository = new MessageRepository();
                if (!uuidValidate(data.message.id)) {
                    throw new CustomError("El formato del ID de mensaje no es válido", 400);
                }
                const entityMessage = await messageRepository.findOne({ where: { id: data.message.id } });

                if (!entityMessage) {
                    throw new CustomError("Message not found", 404);
                }
                subMessage.message = entityMessage; // Solo actualizar si se pasa un mensaje válido
            }

            if (idParentSubMessage) {
                const parentSubMessage = await this.findOne({ where: { id: idParentSubMessage } });
                if (!parentSubMessage) {
                    throw new CustomError("Parent submessage not found", 404);
                }
                subMessage.parentSubMessage = parentSubMessage; // Solo asignar si se proporciona un submensaje padre
            }

            subMessage.numOrder = data.numOrder ?? subMessage.numOrder;
            subMessage.body = data.body ?? subMessage.body;
            subMessage.option = data.option ?? subMessage.option;
            subMessage.isNumber = data.isNumber ?? subMessage.isNumber;
            subMessage.showName = data.showName ?? subMessage.showName;
            subMessage.isName = data.isName ?? subMessage.isName;

            const updatedSubMessage = await this.save(subMessage);
            return updatedSubMessage;
        } catch (error) {
            throw handleRepositoryError(error);
        }
    }

    // Realiza el soft delete
    public async softDeleteSubMessage(id: string): Promise<void> {
            try {
            const subMessage = await this.findOne({ where: { id } });

            if (!subMessage) {
                throw new CustomError("SubMessage not found", 404);
            }

            subMessage.isDeleted = true;
            await this.repository.save(subMessage);
        } catch (error) {
            throw handleRepositoryError(error);
        }
    }

    // Recuperar un submensaje específico de la eliminación lógica
    public async recoverSubMessage(id: string): Promise<SubMessage> {
        try {
            const subMessage = await this.findOne({ where: { id, isDeleted: true } });

            if (!subMessage) {
                throw new CustomError("SubMessage not found or already not deleted", 404);
            }

            subMessage.isDeleted = false;

            const recoveredSubMessage = await this.save(subMessage);
            return recoveredSubMessage;
        } catch (error) {
            throw handleRepositoryError(error);
        }
    }

}