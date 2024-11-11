import { Entity, Column, ManyToOne, Index } from "typeorm";
import { Base } from "../base/base.model";
import { Enterprise } from "../enterprise/enterprise.model";

@Entity("clients")
@Index(["phone", "username"], { unique: true })
export class Client extends Base {
  @Column({
    nullable: false,
    unique: true,
  })
  username!: string;

  @Column({
    nullable: false,
  })
  phone!: string;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.clients, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
    nullable: false,
  })
  enterprise!: Enterprise;
}
