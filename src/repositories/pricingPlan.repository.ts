import { GenericRepository } from "../types/repositoryGenerics";
import { PricingPlan } from "../entities/pricingPlan/pricingPlan.model";

export class PricingPlanRepository extends GenericRepository<PricingPlan> {
  constructor() {
    super(PricingPlan);
  }
}
