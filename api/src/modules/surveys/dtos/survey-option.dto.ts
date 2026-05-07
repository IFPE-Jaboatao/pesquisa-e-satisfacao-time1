import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SurveyOptionDto {
  @ApiProperty({
    example: 'Excelente',
  })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({
    example: 'excellent',
  })
  @IsString()
  @IsNotEmpty()
  value!: string;
}
