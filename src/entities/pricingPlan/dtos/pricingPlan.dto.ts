import { Expose, Type } from "class-transformer";
import { FlowSummaryDto } from "../../flow/dtos/FlowSummaryDto";
import { Flow } from "../../flow/flow.model";

export class PricingPlanDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  price!: number;

  @Expose()
  @Type(() => FlowSummaryDto)
  flows?: Flow[];
}
