import { Expose, Type } from "class-transformer";
import { PricingPlan } from "../../pricingPlan/pricingPlan.model";
import { PricingPlanSummaryDto } from "../../pricingPlan/dtos/PricingPlanSummaryDto";

export class FlowDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  isDeleted: boolean = false;

  @Expose()
  @Type(() => PricingPlanSummaryDto)
  pricingPlans?: PricingPlan[];
}
