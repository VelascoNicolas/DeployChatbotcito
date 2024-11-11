import {
  Profile,
  ProfileAndEnterpriseDTO,
  ProfileDTO,
} from "../entities/agent";
import { GenericController } from "../types/controllerGenerics";
import { ProfileRepository } from "../repositories/profile.repository";
import { handleErrors } from "../utils";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
// import { CustomError } from "../types";
// import { plainToInstance } from "class-transformer";
// import { toDtoFromEntity } from "../utils";

export class ProfileController extends GenericController<Profile, ProfileDTO> {
  private profileRepository: ProfileRepository;

  constructor() {
    super(Profile, Profile, ProfileDTO);
    this.profileRepository = new ProfileRepository();
  }

  async signUpWithEnterprise(req: Request, res: Response) {
    try {
      const profile = await this.profileRepository.signUpWithEnterprise(
        plainToInstance(ProfileAndEnterpriseDTO, req.body, {
          groups: ["private"],
        })
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async signUp(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const profile = await this.profileRepository.signUp(
        plainToInstance(ProfileDTO, req.body, {
          groups: ["private"],
        }),
        idEnterprise
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const profile = await this.profileRepository.signIn(
        plainToInstance(ProfileDTO, req.body, {
          groups: ["private"],
        })
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async getAllProfile(req: Request, res: Response) {
    try {
      const idEnterprise = await this.getEnterpriseId(req, res);
      const profiles = await this.profileRepository.findAllProfiles(
        idEnterprise
      );
      return res.status(200).json(profiles);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async getProfileById(req: Request, res: Response) {
    try {
      const idProfile = req.params.id;
      const idEnterprise = await this.getEnterpriseId(req, res);
      const profile = await this.profileRepository.findByIdProfileForEnterprise(
        idProfile,
        idEnterprise
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async deleteProfile(req: Request, res: Response) {
    try {
      const idProfile = req.params.id;
      const profile = await this.profileRepository.deleteProfile(idProfile);
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async logicDeleteProfile(req: Request, res: Response) {
    try {
      const idProfile = req.params.id;
      const profile = await this.profileRepository.logicDeleteProfile(
        idProfile
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const idProfile = req.params.id;
      const dataProfile = req.body;
      const profile = await this.profileRepository.updateProfile(
        idProfile,
        dataProfile
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  async updateRoleProfile(req: Request, res: Response) {
    try {
      const idProfile = req.params.id;
      const role = req.body.role;
      const profile = await this.profileRepository.updateRoleProfile(
        idProfile,
        role
      );
      return res.status(200).json(profile);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  /* async getAll(req: Request, res: Response) {
		try {
			/* Acá la lógica del middleware debería encargarse
			* de obtener y devolver el id del usuario que está 
			* realizando la petición.
			* Por ahora, lo dejo como query para poder probarlo.
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const entities = await this.profileRepository.findAllEntitiesForAEnterprise(
				idEnterprise
			);
			const entitiesDTO = entities.map((entity) => { 
				return toDtoFromEntity(ProfileDTO, entity) 
			});
			res.status(200).json(entitiesDTO);
			return;
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async getAllDeleted(req: Request, res: Response) {
		try {
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const entities =
				await this.profileRepository.findAllDeletedEntitiesForAEnterprise(idEnterprise);
			const entitiesDTO = entities.map((entity) => { return toDtoFromEntity(ProfileDTO, entity) });
			return res.status(200).json(entitiesDTO);
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}


	async create(req: Request, res: Response) {
		try {
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const createdEntity = await this.profileRepository.createEntityForAEnterprise(
				plainToInstance(ProfileDTO, req.body, { groups: ["private"] }), 
				idEnterprise
			);
			res.status(201).json(toDtoFromEntity(ProfileDTO, createdEntity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async update(req: Request, res: Response) {
		try {
			const idProfile = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const updatedEntity = await this.profileRepository.updateEntityForAEnterprise(
				idProfile,
				idEnterprise,
				plainToInstance(ProfileDTO, req.body, { groups: ["private"] })
			);

			if (updatedEntity instanceof CustomError) {
				throw updatedEntity;
			}
			res.status(200).json(toDtoFromEntity(ProfileDTO, updatedEntity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const idProfile = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			await this.profileRepository.deleteEntityForAEnterprise(idProfile, idEnterprise);

			res.status(204).json("Successfully deleted entity").end();
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async logicDelete(req: Request, res: Response) {
		try {
			const idProfile = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			await this.profileRepository.logicDeleteForAEnterprise(idProfile, idEnterprise);

			res.status(204).json("The entity was correctly deleted logically").end();
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	}

	async restoreLogicDeleted(req: Request, res: Response) {
		try {
			const idProfile = req.params.id;
			const idEnterprise = await this.validateEnterpriseId(req.query.idEnterprise);
			const restoredEntity = await this.profileRepository.restoreLogicDeletedForAEnterprise(idProfile, idEnterprise);

			if (restoredEntity instanceof CustomError) {
				throw restoredEntity;
			}

			res.status(200).json(toDtoFromEntity(ProfileDTO, restoredEntity));
		} catch (error: unknown) {
			return await this.handleErrors(error, res);
		}
	} */
}
