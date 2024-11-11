import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Base } from "../base/base.model";
import { Message } from "../message/message.model"; // Clase Message principal
import { Option } from "../../enums/optionEnum";

@Entity("subMessages")
export class SubMessage extends Base {
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
  })
  showName: boolean | null = null;

  @Column({
    type: "boolean",
    nullable: true,
  })
  isName: boolean | null = null;

  @Column({
    type: "boolean",
    nullable: true,
    default: false,
  })
  isDeleted: boolean | null = false;

  @ManyToOne(() => Message, (message) => message.subMessages, {
    onDelete: "CASCADE",
    nullable: true,
  })
  message!: Message;

  // Relación de padre-hijo entre submensajes
  @ManyToOne(() => SubMessage, (subMessage) => subMessage.childSubMessages, {
    nullable: true,
    onDelete: "SET NULL",
  })
  parentSubMessage!: SubMessage | null;

  @OneToMany(() => SubMessage, (subMessage) => subMessage.parentSubMessage)
  childSubMessages!: SubMessage[];
}
