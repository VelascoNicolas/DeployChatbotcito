import { Entity, Column } from "typeorm";
import { Base } from "../base/base.model";

@Entity("examples")
export class Example extends Base {
	@Column({
		nullable: false,
		unique: true,
	})
	attributeString!: string;

	@Column({
		nullable: false,
	})
	attributeNumber!: number;
}
