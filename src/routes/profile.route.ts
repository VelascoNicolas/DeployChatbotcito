import { genericRoutes } from "../types/routeGenerics";
import { Profile, ProfileDTO } from "../entities";
import { ProfileController } from "../controllers/profile.controller";
import { ProfileSchema, AuthSchema, EnterpriseSchema } from "../schemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares";
import { checkRoleAuth } from "../middlewares/roleProtectionMiddleware";
import { RoleSchema } from "../schemas/role.schema";

export const profileRouter = () => {
  const profileRoutes = genericRoutes(
    Profile,
    Profile,
    ProfileDTO,
    ProfileSchema
  );

  const profileController = new ProfileController();

  profileRoutes.post(
    "/signUpWithUser",
    validateSchema(AuthSchema.merge(EnterpriseSchema)),
    (req, res) =>
      /* 	
				#swagger.path = '/profiles/signUpWithUser'
				#swagger.tags = ['Profile']
				#swagger.description = 'Esta ruta permite registrar un profile y una empresa en el mismo endpoit' 
				#swagger.parameters['body'] = {
					in: 'body',
					schema: { $ref: "#/definitions/SignUp" }
				}
			*/

      profileController.signUpWithEnterprise(req, res)
  );

  profileRoutes.post(
    "/signUp",
    authMiddleware,
    checkRoleAuth(["admin"]),
    validateSchema(AuthSchema),
    (req, res) =>
      /* 	
  #swagger.path = '/profiles/signUp'
  #swagger.tags = ['Profile']
  #swagger.description = 'Esta ruta es la que utilizará el administrador para crear perfiles en su empresa'
  
  #swagger.parameters['body'] = {
    in: 'body',
    schema: { $ref: "#/definitions/Profiles" }
  }

  #swagger.security = [{
						"bearerAuth": []
					}]
	*/

      profileController.signUp(req, res)
  );

  profileRoutes.post("/signIn", validateSchema(ProfileSchema), (req, res) =>
    /* 	
			#swagger.path = '/profiles/signIn'
			#swagger.tags = ['Profile']
			#swagger.description = 'Retorna el token del profile' 
			#swagger.parameters['body'] = {
				in: 'body',
				schema: { $ref: "#/definitions/SignIn" }
			}

      #swagger.responses[200] = {
            schema: { $ref: '#/definitions/ProfileResponse' }
      }
		*/
    profileController.signIn(req, res)
  );

  profileRoutes.get(
    "/allProfiles",
    authMiddleware,
    checkRoleAuth(["admin", "redactor", "empleado"]),
    (req, res) =>
      /* 	
			#swagger.path = '/profiles/allProfiles'
			#swagger.tags = ['Profile']
			#swagger.description = 'Retorna los perfiles asociados a la empresa obtenida desde el token' 
			}
			#swagger.security = [{
						"bearerAuth": []
					}]
    */
      profileController.getAllProfile(req, res)
  );

  profileRoutes.get(
    "/getById/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor", "empleado"]),
    (req, res) =>
      /* 	
			#swagger.path = '/profiles/getById/{id}'
			#swagger.tags = ['Profile']
			#swagger.description = 'Busca el perfil por el id y lo retorna siempre y cuando esté asociado a la empresa obtenida desde el token' 
	
			#swagger.security = [{
						"bearerAuth": []
					}]
    */
      profileController.getProfileById(req, res)
  );

  profileRoutes.delete(
    "/deleteProfile/:id",
    authMiddleware,
    checkRoleAuth(["admin"]),
    (req, res) =>
      /* 	
			#swagger.path = '/profiles/deleteProfile/{id}'
			#swagger.tags = ['Profile']
			#swagger.description = 'Eliminación física del profile' 
			}
			#swagger.security = [{
						"bearerAuth": []
					}]
    */
      profileController.deleteProfile(req, res)
  );

  profileRoutes.patch(
    "/logicDeleteProfile/:id",
    authMiddleware,
    checkRoleAuth(["admin"]),
    (req, res) =>
      /* 	
			#swagger.path = '/profiles/logicDeleteProfile/{id}'
			#swagger.tags = ['Profile']
			#swagger.description = 'Eliminación lógica del profile' 
			}
			#swagger.security = [{
						"bearerAuth": []
					}]
    */
      profileController.logicDeleteProfile(req, res)
  );

  profileRoutes.patch(
    "/updateProfile/:id",
    authMiddleware,
    checkRoleAuth(["admin", "redactor", "empleado"]),
    validateSchema(AuthSchema, true),
    (req, res) =>
      /* 	
			#swagger.path = '/profiles/updateProfile/{id}'
			#swagger.tags = ['Profile']
			#swagger.description = 'Actualización del profile' 
			}
      #swagger.parameters['body'] = {
          in: 'body',
          schema: { $ref: "#/definitions/Profiles" }
      }
			#swagger.security = [{
						"bearerAuth": []
					}]
    */
      profileController.updateProfile(req, res)
  );

  profileRoutes.patch(
    "/updateRoleProfile/:id",
    authMiddleware,
    checkRoleAuth(["admin"]),
    validateSchema(RoleSchema),
    (req, res) =>
      /* 	
			#swagger.path = '/profiles/updateRoleProfile/{id}'
			#swagger.tags = ['Profile']
			#swagger.description = 'Actualización del rol del profile' 
			}
      #swagger.parameters['body'] = {
          in: 'body',
           schema: {
                role: {
                  "@enum": ["admin", "redactor", "empleado"],
                },
            }
      }
			#swagger.security = [{
						"bearerAuth": []
					}]
    */
      profileController.updateRoleProfile(req, res)
  );

  // profileRoutes.get("/", (req, res) => profileController.getAll(req, res));
  // profileRoutes.get("/getAllDeleted/", (req, res) => profileController.getAllDeleted(req, res));
  // profileRoutes.get("/getById/:id", (req, res) => profileController.getById(req, res));
  // profileRoutes.post("/", (req, res) => profileController.create(req, res));
  // profileRoutes.patch("/:id", (req, res) => profileController.update(req, res));
  // profileRoutes.delete("/:id", (req, res) => profileController.delete(req, res));
  // profileRoutes.delete("/logicDelete/:id", (req, res) => profileController.logicDelete(req, res));
  // profileRoutes.patch("/restore/:id", (req, res) => profileController.restoreLogicDeleted(req, res));

  return profileRoutes;
};
