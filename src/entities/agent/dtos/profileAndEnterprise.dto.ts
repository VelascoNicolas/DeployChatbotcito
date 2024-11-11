import { Expose, Type } from "class-transformer";
import { Role } from "../../../enums/role.enum";
import { EnterpriseDto, Enterprise } from "../../enterprise";

export class ProfileAndEnterpriseDTO {
  // Atributos de usuario
  @Expose()
  name!: string;

  @Expose()
  phone!: string;

  // Atributos de profile
  @Expose()
  username!: string;

  @Expose({ groups: ["private"] }) // campo a ocultar en la respuesta
  password!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: Role;

  @Expose()
  @Type(() => EnterpriseDto)
  enterprise?: Enterprise;
}
