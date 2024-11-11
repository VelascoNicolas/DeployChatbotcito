import { Expose, Type } from "class-transformer";
import { PricingPlanDto } from "../../pricingPlan/dtos/pricingPlan.dto";
import { PricingPlan } from "../../pricingPlan/pricingPlan.model";

export class EnterpriseDto {
  @Expose()
  name!: string;

  @Expose()
  phone!: string;

  @Expose()
  connected!: boolean;

  @Expose()
  @Type(() => PricingPlanDto)
  pricingPlan?: PricingPlan;
}
