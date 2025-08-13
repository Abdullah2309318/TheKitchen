import { IsString, Length } from "class-validator";

export class AddPlayerDto {
  @IsString()
  @Length(1, 80)
  name!: string;
}
