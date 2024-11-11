import { EntityTarget } from "typeorm";
import { GenericRepository } from "./repositoryGenerics";
import { Request, Response } from "express";
import { Base } from "../entities/base/base.model";
import { CustomError } from "../types";
import {
  getPagingData,
  toDtoFromEntity,
  toEntityFromDto,
} from "../utils/index";
import { limit } from "../config";
import { processSorting } from "../utils/processSorting";
import { getUserByJWT } from "../utils/jwt";
import { handleErrors } from "../utils/errorsHandler";
import { ProfileRepository } from "../repositories";
import { ClassConstructor } from "class-transformer";

/**
 * Clase Controlador para trabajar con cualquier entidad que herede de Base
 */

export class GenericController<T extends Base, U extends Partial<T>> {
  private repository: GenericRepository<T>;
  private entityConstructor: ClassConstructor<T>;
  private dtoConstructor: ClassConstructor<U>;

  /**
   * Crea una instancia de GenericController.
   * @param {GenericRepository<T>} repository - Instancia de GenericRepository
   */

  constructor(
    entity: EntityTarget<T>,
    entityConstructor: ClassConstructor<T>,
    dtoConstructor: ClassConstructor<U>
  ) {
    this.repository = new GenericRepository(entity);
    this.entityConstructor = entityConstructor;
    this.dtoConstructor = dtoConstructor;
  }

  /**
   * Obtiene el ID del Enterprise que realizó la solicitud, si fuere necesario para la entidad.
   * @param {Request} req - El objeto de solicitud Express.
   * @returns - El ID del Enterprise que realizó la solicitud (si se requiere) o undefined.
   */
  protected async getEnterpriseId(req: Request, res: Response): Promise<any> {
    const profileRepository = new ProfileRepository();
    var profile;
   // const propertiesOfEntity = this.repository.metadata.columns.map(
   //   (column) => column.propertyName
   //);
    //if (propertiesOfEntity.includes("enterprise")) {
      profile = await getUserByJWT(req);
      if (profile instanceof CustomError) {
        return handleErrors(profile, res);
      }
    //  console.log(JSON.stringify(profile,null,2));
   // }
    const profileId = profile ? profile.sub : undefined;
    var enterpriseId;
    if (profileId && profileRepository) {
      const profileEntity =
        await profileRepository.findOneProfileWithEnterprise(profileId);
      enterpriseId = profileEntity?.enterprise.id;
      return enterpriseId;
    }
    return undefined;
  }

  /**
   * Maneja la solicitud para obtener todos los registros de entidades.
   * @param {Request} req - El objeto de solicitud Express.
   * @param {Response} res - El objeto de respuesta Express.
   */
  async getAll(req: Request, res: Response) {
    try {
      let orderParams = {};
      const idEnterprise = await this.getEnterpriseId(req, res);
      // Make a copy of the query data to avoid modifying the original object
      const queryData = { ...req.query };
      const orderBy = req.query.orderBy;

      if (orderBy) {
        orderParams = processSorting(orderBy as string);
      }

      // Remove orderBy & page from queryData if they exist, this avoid to filter by these fields
      delete queryData.orderBy;
      delete queryData.page;

      // Paginación
      const page = parseInt(req.query.page as string) || 1;

      const entities = await this.repository.findAllEntities(
        queryData,
        page,
        orderParams,
        idEnterprise
      );

      const entitiesDTO = entities.map((entity) => {
        return toDtoFromEntity(this.dtoConstructor, entity);
      });

      res.json({
        ...getPagingData(entitiesDTO, page, limit),
        entitiesDTO,
      });
      return;
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta función recupera todas las entidades activas y eliminadas logicamnete y maneja cualquier
   * error que ocurra en el proceso.
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns una lista de entidades eliminadas.
   */
  async getAllDeleted(req: Request, res: Response) {
    try {
      let orderParams = {};
      const orderBy = req.query.orderBy;
      if (orderBy) {
        orderParams = processSorting(orderBy as string);
      }

      const idEnterprise = await this.getEnterpriseId(req, res);
      const queryData = { ...req.query };
      const page = parseInt(req.query.page as string) || 1;

      const entities = await this.repository.findAllDeletedEntities(
        queryData,
        page,
        orderParams,
        idEnterprise
      );

      const entitiesDTO = entities.map((entity) => {
        return toDtoFromEntity(this.dtoConstructor, entity);
      });

      res.json({
        ...getPagingData(entitiesDTO, page, limit),
        entitiesDTO,
      });
      return;
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta función maneja una solicitud para recuperar una entidad por su ID, devolviendo la entidad
   * si se encuentra o un mensaje de error si no.
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns la entidad encontrada por la identificación por el id dado o un mensaje de error.
   */
  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entity = await this.repository.findByIdEntity(id, idEnterprise);

      res.json(toDtoFromEntity(this.dtoConstructor, entity));
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta función valida el body de la request en funcion del esquema de Zod, llama al servicio para que
   * guarde la entidad en función de los datos del body ya validados y devuelve la entidad guardada.
   * En caso de errores en cada paso, detiene la ejecucion de la funcion y devuelve una respuesta JSON
   * con el mensaje de error
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns los datos de la entidad creada o, si ocurre, un mensaje de error diferente en base a donde
   * se produjo el error
   */
  async create(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const entity = toEntityFromDto(this.entityConstructor, req.body);
      const createdEntity = await this.repository.createEntity(
        entity,
        idEnterprise
      );
      const createdDto = toDtoFromEntity(this.dtoConstructor, createdEntity);
      res.status(201).json(createdDto);
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta función valida el body de la request en funcion del esquema de Zod, llama al servicio para que
   * actualice la entidad en función del parametro del id y los datos del body ya validados y devuelve la
   * entidad actualizada. En caso de errores en cada paso, detiene la ejecucion de la funcion y devuelve
   * una respuesta JSON con el mensaje de error
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns una respuesta JSON. Si hay un error de validación, devuelve un objeto JSON con un error
   * mensaje y un código de estado de 422. Si la entidad se actualiza correctamente, devuelve la
   * información actualizada de la entidad como objeto JSON. Si hay un error durante el proceso de
   * actualización, devuelve un objeto JSON con un mensaje de error y un código de estado basado en el
   * error.
   */
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const updatedEntity = await this.repository.updateEntity(
        id,
        req.body,
        idEnterprise
      );

      if (updatedEntity instanceof CustomError) {
        throw updatedEntity;
      }

      res.json(updatedEntity);
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta función maneja la eliminación fisica de una entidad en función de su ID y devuelve una respuesta
   * con status 201 o un mensaje de error diferente segun donde se produjo
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns Si la variable `entidad` es una instancia de `CustomError`, entonces una respuesta JSON con
   * el mensaje de error y el código de estado especificado en la instancia `CustomError`. De lo
   * contrario, una respuesta con status 204 si la eliminación se hace correctamente
   */
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.repository.deleteEntity(id);

      res.status(204).json("Successfully deleted entity").end();
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta función realiza la obtención del id por parametro y llama al servicio para realizar la baja
   * logica de la entidad
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns Si la variable `entidad` es una instancia de `CustomError`, entonces una respuesta JSON con
   * el mensaje de error y el código de estado especificado en la instancia `CustomError`. De lo
   * contrario, una respuesta con status 204 si la eliminación se hace correctamente
   */
  async logicDelete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const deletedEntity = await this.repository.logicDelete(id, idEnterprise);

      if (deletedEntity instanceof CustomError) {
        throw deletedEntity;
      }

      res.status(204).json("The entity was correctly deleted logically").end();
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }

  /**
   * Esta funcion realiza la logica para restaurar una entidad eliminada lógicamente
   * @param {Request} req: el parámetro `req` es un objeto que representa la solicitud HTTP realizada al
   * servidor. Es una instancia de la clase `Request` de Express, que proporciona información como el
   * método de solicitud, encabezados, parámetros de consulta y cuerpo.
   * @param {Response} res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar el
   * HTTP de respuesta al cliente. Es una instancia de la clase `Response` de Express, que proporciona
   * métodos para configurar el código de estado de respuesta, los encabezados y el cuerpo. En este
   * fragmento de código, se utiliza para enviar respuestas en formato JSON
   * @returns la entidad restaurada o un mensaje de error diferente dependiendo de donde ocurrió el error
   */
  async restoreLogicDeleted(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const restoredEntity = await this.repository.restoreLogicDeleted(
        id,
        idEnterprise
      );

      if (restoredEntity instanceof CustomError) {
        throw restoredEntity;
      }

      res.status(200).json(restoredEntity);
    } catch (error: unknown) {
      handleErrors(error, res);
    }
  }
}
