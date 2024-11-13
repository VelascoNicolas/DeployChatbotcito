import { Entity, ManyToOne } from "typeorm";
import { Base } from "../base/base.model";
import { Enterprise } from "../enterprise";

@Entity("profiles")
export class Profile extends Base {
  @ManyToOne(() => Enterprise, (enterprise) => enterprise.profiles, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
    nullable: false,
  })
  enterprise!: Enterprise;
}
