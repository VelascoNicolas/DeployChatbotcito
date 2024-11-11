import { Profile, Enterprise } from "../entities";
import { ProfileDTO, ProfileAndEnterpriseDTO } from "../entities/agent";
import { CustomError } from "../types";
import { GenericRepository } from "../types/repositoryGenerics";
import { EnterpriseRepository } from "./enterprise.repository";
import { toEntityFromDto } from "../utils";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { handleRepositoryError } from "./errorHandler";
import { supabase, supabaseAdmin } from "../configSupabaseClient";
import { AuthApiError } from "@supabase/supabase-js";
import { Role } from "../enums/role.enum";
import { SessionRepository } from "./session.repository";

export class ProfileRepository extends GenericRepository<Profile> {
  private enterpriseRepository: EnterpriseRepository;

  constructor() {
    super(Profile);
    this.enterpriseRepository = new EnterpriseRepository();
  }

  public async signUpWithEnterprise(
    ProfileEnterprise: ProfileAndEnterpriseDTO
  ) {
    try {
      // Verifica que el phone no exista
      const enterprisePhone: Enterprise[] =
        await this.enterpriseRepository.find({
          where: {
            phone: ProfileEnterprise.phone,
          },
        });

      if (enterprisePhone.length > 0) {
        throw new CustomError("Enterprise phone already registered", 409);
      }

      // Crea el profile en auth.enterprises
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: ProfileEnterprise.email,
        password: ProfileEnterprise.password,
        role: "admin",
        user_metadata: { username: ProfileEnterprise.username },
        email_confirm: true,
      });

      // Manejo de AuthApiError
      if (error instanceof AuthApiError) {
        const status =
          error.message == "Profile already registered" ? 409 : 500;
        throw new CustomError(error.message, status);
      }

      // Crea la empresa
      const entity = toEntityFromDto(Enterprise, {
        phone: ProfileEnterprise.phone,
        name: ProfileEnterprise.name,
      });
      await this.enterpriseRepository.save(entity);

      // Asigno el id de enterprise al campo enterprise de Profile
      const newProfile = toEntityFromDto(Profile, { enterprise: entity });
      // Asigno el id de auth.user al nuevo profilee
      newProfile.id = data.user?.id ?? "";
      // Guardo en la bd
      await this.save(newProfile);

      const userData = {
        idProfile: data.user?.id,
        createdAt: data.user?.created_at,
        username: data.user?.user_metadata.username,
        email: data.user?.email,
        role: data.user?.role,
        enterprise: {
          id: entity.id,
          name: entity.name,
          phone: entity.phone,
        },
      };

      return userData;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error: " + error, 500);
      }
    }
  }

  public async signUp(dataProfile: ProfileDTO, idEnterprise?: string) {
    try {
      // Crea el profile en auth.enterprises
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: dataProfile.email,
        password: dataProfile.password,
        role: dataProfile.role,
        user_metadata: { username: dataProfile.username },
        email_confirm: true,
      });

      const newProfile = toEntityFromDto(Profile, {});
      // Asigno el id de auth.enterprise al nuevo profilee
      newProfile.id = data.user?.id ?? "";

      // Manejo de AuthApiError
      if (error instanceof AuthApiError) {
        const status =
          error.message == "Profile already registered" ? 409 : 500;
        throw new CustomError(error.message, status);
      }

      console.log(idEnterprise);
      if (idEnterprise) {
        const enterprise = await this.enterpriseRepository.findByIdEntity(
          idEnterprise
        );
        newProfile.enterprise = enterprise;
      }

      this.save(newProfile);

      const userData = {
        idProfile: data.user?.id,
        createdAt: data.user?.created_at,
        username: data.user?.user_metadata.username,
        email: data.user?.email,
        role: data.user?.role,
        enterprise: newProfile.enterprise,
      };

      return userData;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error: " + error, 500);
      }
    }
  }

  public async signIn(profile: ProfileDTO) {
    try {
      const sessionReposotory = new SessionRepository();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: profile.password,
      });

      if (error) {
        // TODO: Add this to handleRepositoryError
        if (error instanceof AuthApiError) {
          const status =
            error.message == "Invalid login credentials" ? 401 : 500;
          throw new CustomError(error.message, status);
        } else {
          throw new CustomError("Unknown error: " + error, 500);
        }
      }

      const refresToken = sessionReposotory.getSession();
      const userData = {
        id: data.user?.id,
        email: data.user?.email,
        token: data.session.access_token,
        refresh_token: (await refresToken).refresh_token,
      };

      return userData;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error: " + error, 500);
      }
    }
  }

  public async findAllProfiles(idEnterprise: string) {
    try {
      const profiles = await this.find({
        where: { enterprise: { id: idEnterprise } },
        relations: ["enterprise"],
      });

      const profileData = await Promise.all(
        profiles.map(async (profile) => {
          const { data, error } = await supabaseAdmin.auth.admin.getUserById(
            profile.id
          );

          if (error instanceof AuthApiError) {
            throw new CustomError(
              "Error fetching profile: " + error.message,
              error.status
            );
          }
          return {
            id: profile.id,
            username: data.user?.user_metadata.username,
            email: data.user?.email,
            role: data.user?.role,
            createdAt: data.user?.created_at,
            enterprise: profile.enterprise,
          };
        })
      );

      return {
        profiles: profileData,
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError("Unknown error: " + error, 500);
      }
    }
  }

  public async findByIdProfileForEnterprise(
    idProfile: string,
    idEnterprise?: string
  ) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(
        idProfile
      );

      if (error instanceof AuthApiError) {
        throw new CustomError(
          "Error fetching profile: " + error.message,
          error.status
        );
      }

      const profile = await this.findOneBy({
        id: idProfile,
        enterprise: { id: idEnterprise },
      });

      const enterprise = await this.enterpriseRepository.findOneBy({
        id: idEnterprise,
      });

      if (data && profile) {
        return {
          id: data.user?.id,
          username: data.user?.user_metadata.username,
          email: data.user?.email,
          role: data.user?.role,
          createdAt: data.user?.created_at,
          enterprise,
        };
      } else {
        throw new CustomError("Profile not found", 404);
      }
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteProfile(idProfile: string) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        idProfile
      );

      if (error instanceof AuthApiError) {
        throw new CustomError(
          "Profile not found: " + error.message,
          error.status
        );
      }

      if (!data) {
        throw new CustomError("Failed to delete profile in Supabase", 500);
      }

      await this.deleteEntity(idProfile);
      return data;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async findOneProfileWithEnterprise(
    idProfile: string,
    idEnterprise?: string
  ): Promise<Profile | undefined> {
    try {
      const options: any = {
        where: { id: idProfile },
        relations: ["enterprise"],
      };

      if (idEnterprise) {
        options.where.enterprise = { id: idEnterprise };
      }

      const entity = await this.findOne(options);
      return entity ? entity : undefined;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async logicDeleteProfile(idProfile: string) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        idProfile,
        true
      );

      if (error instanceof AuthApiError) {
        throw new CustomError(
          "Profile not found: " + error.message,
          error.status
        );
      }

      if (!data)
        throw new CustomError("Failed to delete profile in Supabase", 500);

      await this.logicDelete(idProfile);
      return data;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async updateProfile(idProfile: string, dataProfile: ProfileDTO) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        idProfile,
        {
          email: dataProfile.email,
          password: dataProfile.password,
          user_metadata: { username: dataProfile.username },
        }
      );

      if (error instanceof AuthApiError) {
        throw new CustomError(
          "Profile not found: " + error.message,
          error.status
        );
      }

      return data;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  public async updateRoleProfile(idProfile: string, role: Role) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        idProfile,
        {
          role: role,
        }
      );

      if (error instanceof AuthApiError) {
        throw new CustomError(
          "Profile not found: " + error.message,
          error.status
        );
      }

      return data;
    } catch (error) {
      throw handleRepositoryError(error);
    }
  }

  //-----------------------

  public async findAllEntitiesForAEnterprise(
    idEnterprise: string
  ): Promise<Profile[]> {
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
  ): Promise<Profile[]> {
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
    idProfile: string,
    idEnterprise: string
  ): Promise<Profile> {
    try {
      const entity = await this.findOneBy({
        id: idProfile,
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
    data: ProfileDTO,
    idEnterprise: string
  ): Promise<Profile> {
    try {
      const enterpriseRepository = new EnterpriseRepository();
      const enterprise = await enterpriseRepository.findByIdEntity(
        idEnterprise
      );
      if (!enterprise) {
        throw new CustomError("Enterprise not found", 404);
      }
      data.enterprise = enterprise;
      const newEntity = toEntityFromDto(Profile, data);
      await this.save(newEntity);
      return newEntity;
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async updateEntityForAEnterprise(
    idProfile: string,
    idEnterprise: string,
    data: QueryDeepPartialEntity<ProfileDTO>
  ): Promise<Profile | CustomError> {
    try {
      const entityUpdated = await this.update(
        {
          // chequear si es mejor con find y save, update no chequea si existe
          id: idProfile,
          enterprise: { id: idEnterprise },
        },
        data
      );
      if (entityUpdated.affected) {
        const restoredEntity = await this.findByIdEntity(idProfile);
        return restoredEntity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteEntityForAEnterprise(
    idProfile: string,
    idEnterprise: string
  ): Promise<Profile> {
    try {
      const result = await this.findOneOrFail({
        where: { id: idProfile },
        relations: ["enterprise"],
      })
        .then(async (profile) => {
          if (profile.enterprise.id === idEnterprise) {
            return await this.delete(idProfile);
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
    idProfile: string,
    idEnterprise: string
  ): Promise<Profile> {
    try {
      const result = await this.findOneOrFail({
        where: { id: idProfile },
        relations: ["enterprise"],
      })
        .then(async (profile) => {
          if (profile.enterprise.id === idEnterprise) {
            return await this.softDelete(idProfile);
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
    idProfile: string,
    idEnterprise: string
  ): Promise<Profile> {
    try {
      const result = await this.restore({
        id: idProfile,
        enterprise: { id: idEnterprise },
      });
      if (result.affected) {
        const restoredEntity = await this.findByIdEntity(idProfile);
        return restoredEntity;
      } else {
        throw new CustomError("Entity not found", 404);
      }
    } catch (error: unknown) {
      throw handleRepositoryError(error);
    }
  }
}
