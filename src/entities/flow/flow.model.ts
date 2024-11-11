import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import { Base } from "../base/base.model";
import { Message } from "../message";
import { PricingPlan } from "../pricingPlan/pricingPlan.model";

@Entity("flows")
export class Flow extends Base {
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
    type: "boolean",
    nullable: true,
    default: false,
  })
  isDeleted: boolean | null = false;

  @OneToMany(() => Message, (message) => message.flow)
  messages!: Message[];

  @ManyToMany(() => PricingPlan, (pricingPlan) => pricingPlan.flows)
  pricingPlans!: PricingPlan[];
}
