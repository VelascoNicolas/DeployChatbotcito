import { Expose, Type } from "class-transformer";
import { Role } from "../../../enums/role.enum";
import { Enterprise, EnterpriseDto } from "../../enterprise";

export class ProfileDTO {
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
