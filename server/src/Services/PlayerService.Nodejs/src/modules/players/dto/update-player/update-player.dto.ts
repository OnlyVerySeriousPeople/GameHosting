import { ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { PlayerDto } from './player.dto';
import { UpdateMaskDto } from './update-mask.dto';

export class UpdatePlayerDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerDto)
  player!: PlayerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateMaskDto)
  updateMask!: UpdateMaskDto;
}
