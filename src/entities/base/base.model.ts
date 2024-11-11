import {
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	CreateDateColumn,
} from "typeorm";

//@Entity()
export abstract class Base {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@DeleteDateColumn({ nullable: false })
	deletedAt!: Date;

	@CreateDateColumn({ nullable: false })
	createdAt!: Date;

	/*  @UpdateDateColumn()
      updatedAt!: Date */
}
