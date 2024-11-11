import { Example } from "../entities";
import { GenericRepository } from "../types/repositoryGenerics";

export class ExampleRepository extends GenericRepository<Example> {
	constructor() {
		super(Example);
	}
}
