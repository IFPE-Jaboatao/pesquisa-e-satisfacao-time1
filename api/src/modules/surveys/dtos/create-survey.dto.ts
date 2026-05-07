import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { SurveyQuestionDto } from './survey-question.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSurveyDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  campus_id!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  course_id!: string;

  @ApiProperty()
  @IsBoolean()
  is_anonymous!: boolean;

  @ApiProperty({
    example: '07-05-2026 08:30',
  })
  @Matches(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/, {
    message: 'start_date deve estar no formato dd-MM-yyyy HH:mm',
  })
  start_date!: string;

  @ApiProperty({
    example: '15-08-2026 23:59',
  })
  @Matches(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/, {
    message: 'end_date deve estar no formato dd-MM-yyyy HH:mm',
  })
  end_date!: string;

  @ApiProperty({
    type: [SurveyQuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyQuestionDto)
  questions!: SurveyQuestionDto[];
}
