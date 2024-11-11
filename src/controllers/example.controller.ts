/* import { Request, Response } from "express";
import { Example } from "../entities";
import { ExampleRepository } from "../repositories/example.repository";
import { GenericController } from "../types/controllerGenerics";

export class ExampleController extends GenericController<Example, ExapleDto> {
  private exampleRepository: ExampleRepository;

  constructor() {
    super(Example, Example);
    this.exampleRepository = new ExampleRepository();
  }

  public async customMethod(_req: Request, _res: Response) {
    this.exampleRepository;
  }
}
 */
