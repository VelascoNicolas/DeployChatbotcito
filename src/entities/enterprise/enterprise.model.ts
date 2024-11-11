import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { Base } from "../base/base.model";
import { Profile } from "../agent/profile.model";
import { Client } from "../client/client.model";
import { Message } from "../message/message.model";
import { PricingPlan } from "../pricingPlan/pricingPlan.model";

@Entity("enterprises")
export class Enterprise extends Base {
  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  phone!: string;

  @Column({
    nullable: false,
    default: false,
  })
  connected!: boolean;

  /*
  * Hay que agregar esto cuando se hace la solicitud al repositorio
  * para que te traiga los profiles, clientes y mensajes del enterprise
  * relations: {
      profiles: true,
      clients: true,
      messages: true,
    }
  */

  @OneToMany(() => Profile, (profile) => profile.enterprise)
  profiles!: Profile[];

  @OneToMany(() => Client, (client) => client.enterprise)
  clients!: Client[];

  @OneToMany(() => Message, (message) => message.enterprise)
  messages!: Message[];

  @ManyToOne(() => PricingPlan, (pricingPlan) => pricingPlan.enterprise, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
  })
  pricingPlan!: PricingPlan;
}
