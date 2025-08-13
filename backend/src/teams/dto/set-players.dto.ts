import { IsOptional, IsString, Length } from "class-validator";

export class SetPlayersDto {
  @IsOptional()
  @IsString()
  @Length(1, 80)
  player_one?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  player_two?: string | null;
}
