import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Base } from "../base/base.model";
import { Enterprise } from "../enterprise";
import { Flow } from "../flow/flow.model";
import { SubMessage } from "../subMessage/subMessage.model";
import { Option } from "../../enums/optionEnum";

@Entity("messages")
export class Message extends Base {
  @Column({
    nullable: true,
  })
  numOrder!: number;

  @Column({
    nullable: true,
  })
  body!: string;

  @Column({
    type: "enum",
    enum: Option,
    nullable: true,
  })
  option: Option | null = null;

  @Column({
    type: "boolean",
    nullable: true,
  })
  isNumber: boolean | null = null;

  @Column({
    type: "boolean",
    nullable: true,
    default: false,
  })
  isDeleted: boolean | null = false;

  @Column({
    type: "boolean",
    nullable: true,
  })
  showName: boolean | null = null;

  @Column({
    type: "boolean",
    nullable: true,
  })
  isName: boolean | null = null;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.messages, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: "enterpriseId" })
  enterprise!: Enterprise;

  @ManyToOne(() => Flow, (flow) => flow.messages, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
    nullable: true,
  })
  flow!: Flow;

  @OneToMany(() => SubMessage, (subMessage) => subMessage.message)
  subMessages!: SubMessage[];
}
