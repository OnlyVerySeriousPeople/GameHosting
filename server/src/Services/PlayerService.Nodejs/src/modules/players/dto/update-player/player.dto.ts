import {
  IsInt,
  IsString,
  IsEmail,
  Min,
  IsOptional,
  MinLength,
} from 'class-validator';

export class PlayerDto {
  @IsInt()
  @Min(1)
  id!: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
