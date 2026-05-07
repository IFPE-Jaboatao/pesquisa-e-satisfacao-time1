import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SurveyOptionDto } from './survey-option.dto';
import { SurveyScaleDto } from './survey-scale.dto';

export enum SurveyQuestionType {
  TEXT = 'TEXT',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SCALE = 'SCALE',
}

export class SurveyQuestionDto {
  @ApiProperty({
    example: 'Como você avalia o curso?',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    enum: SurveyQuestionType,
    example: SurveyQuestionType.SCALE,
  })
  @IsEnum(SurveyQuestionType)
  type!: SurveyQuestionType;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  required!: boolean;

  @ApiPropertyOptional({
    type: [SurveyOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyOptionDto)
  options?: SurveyOptionDto[];

  @ApiPropertyOptional({
    type: SurveyScaleDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyScaleDto)
  scale?: SurveyScaleDto;
}
