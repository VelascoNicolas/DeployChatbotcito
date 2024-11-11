// import { Request, Response } from "express";
import { PricingPlanDto } from "../entities/pricingPlan/dtos/pricingPlan.dto";
import { PricingPlan } from "../entities/pricingPlan/pricingPlan.model";
import { GenericController } from "../types/controllerGenerics";

export class PricingPlanController extends GenericController<
  PricingPlan,
  PricingPlanDto
> {
  // private pricingPlanRepository: PricingPlanRepository;

  constructor() {
    super(PricingPlan, PricingPlan, PricingPlanDto);
  }
}
