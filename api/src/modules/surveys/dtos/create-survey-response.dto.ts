import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SurveyResponseDto } from './survey-response.dto';

export class CreateSurveyResponseDto {
  @ApiProperty({
    type: SurveyResponseDto,
  })
  survey!: SurveyResponseDto;

  @ApiPropertyOptional({
    example: '/surveys/public/token-aqui',
    nullable: true,
  })
  anonymous_link!: string | null;
}
