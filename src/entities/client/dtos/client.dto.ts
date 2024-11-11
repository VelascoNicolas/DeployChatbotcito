import { Expose, Type } from "class-transformer";
import { Enterprise, EnterpriseDto } from "../../enterprise";

export class ClientDTO {
  @Expose()
  username!: string;

  @Expose()
  phone!: string;

  @Expose()
  @Type(() => EnterpriseDto)
  enterprise?: Enterprise;
}
