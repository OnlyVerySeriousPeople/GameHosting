import { IsArray, IsString } from 'class-validator';

export class UpdateMaskDto {
  @IsArray()
  @IsString({ each: true })
  paths!: string[];
}
