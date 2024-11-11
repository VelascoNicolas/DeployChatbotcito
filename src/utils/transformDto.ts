import { Base } from "../entities";
import { plainToInstance, instanceToPlain, ClassConstructor } from "class-transformer";

/**
 * Converts a DTO to an entity.
 * @param {ClassConstructor<T>} entityClass - The class of the entity (not a specific instance).
 * @param {U} dto - The DTO specific instance.
 * @returns {T} New instance of the entity.
 */
export function toEntityFromDto<T extends Base, U extends Partial<T>>(entityClass: ClassConstructor<T>, dto: U) {
    const plainDto = instanceToPlain(dto, { groups: ["private"] }); 
    return plainToInstance(entityClass, plainDto, { groups: ["private"], enableImplicitConversion: true });
}

/**
 * Converts an entity to a DTO.
 * @param {ClassConstructor<U>} dtoClass - The class of the DTO (not a specific instance).
 * @param {T} dto - The entity specific instance.
 * @returns {U} New instance of the DTO.
 */
export function toDtoFromEntity<T extends Base, U extends Partial<T>>(dtoClass: ClassConstructor<U>, entity: T) {
    const plainEntity = instanceToPlain(entity, { groups: ["private"] });
    return plainToInstance(dtoClass, plainEntity, { enableImplicitConversion: true });
}