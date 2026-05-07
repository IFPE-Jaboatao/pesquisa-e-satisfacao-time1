import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SurveyScaleDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  min!: number;

  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  max!: number;
}
