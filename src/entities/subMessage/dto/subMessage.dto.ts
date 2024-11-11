import { Expose, Type } from "class-transformer";
import { Option } from "../../../enums/optionEnum";
import { Message } from "../../message/message.model";
import { SubMessage } from "../subMessage.model";

export class SubMessageDto {
  @Expose()
  numOrder!: number | undefined;
  @Expose()
  body!: string | undefined;

  @Expose()
  option!: Option | undefined;

  @Expose()
  isNumber!: boolean | undefined;

  @Expose()
  showName!: boolean | undefined;
  
  @Expose()
  isName!: boolean | undefined;
  
  @Expose()
  isDeleted: boolean = false;

  @Expose()
  @Type(() => Message)
  message!: Message | undefined;

  @Expose()
  @Type(() => SubMessage)
  parentSubMessage!: SubMessage | null | undefined;

  @Expose()
  @Type(() => SubMessage)
  childSubMessages!: SubMessage[] | undefined;
}
