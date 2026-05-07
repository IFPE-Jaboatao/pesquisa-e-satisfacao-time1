import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SurveyAnswerItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question_id!: string;

  @ApiProperty({
    example: 5,
  })
  @IsDefined()
  answer!: unknown;
}

export class AnswerSurveyDto {
  @ApiProperty({
    type: [SurveyAnswerItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyAnswerItemDto)
  responses!: SurveyAnswerItemDto[];
}
