import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateLoanRequestDto {
  @IsNotEmpty()
  @IsString()
  purpose!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  days!: number;

  @IsNotEmpty()
  @IsString()
  toolId!: string;
}

