import { Expose } from "class-transformer";

export class PricingPlanSummaryDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  price!: number;
}
