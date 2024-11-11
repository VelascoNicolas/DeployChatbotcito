import { Expose } from "class-transformer";

export class FlowSummaryDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;
}
