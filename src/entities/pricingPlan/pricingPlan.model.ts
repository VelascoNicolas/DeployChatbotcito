import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Base } from "../base/base.model";
import { Enterprise } from "../enterprise";
import { Flow } from "../flow/flow.model";

@Entity("pricing_plans")
export class PricingPlan extends Base {
  @Column({
    nullable: false,
    unique: true,
  })
  name!: string;

  @Column({
    nullable: false,
  })
  description!: string;

  @Column({
    nullable: false,
  })
  price!: number;

  @OneToMany(() => Enterprise, (enterprise) => enterprise.pricingPlan)
  enterprise!: Enterprise[];

  @ManyToMany(() => Flow, (flow) => flow.pricingPlans)
  @JoinTable({
    name: "pricing_plans_flows",
    joinColumn: {
      name: "pricingPlanId",
    },
    inverseJoinColumn: {
      name: "flowId",
    },
  })
  flows!: Flow[];
}
