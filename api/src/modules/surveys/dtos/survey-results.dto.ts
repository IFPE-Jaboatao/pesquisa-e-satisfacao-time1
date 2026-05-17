import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OptionDistributionDto {
  @ApiProperty()
  label!: string;

  @ApiProperty()
  value!: string;

  @ApiProperty()
  count!: number;

  @ApiProperty()
  percentage!: number;
}

class ScaleStatisticsDto {
  @ApiProperty()
  count!: number;

  @ApiProperty()
  mean!: number;

  @ApiProperty()
  standard_deviation!: number;

  @ApiProperty()
  min!: number;

  @ApiProperty()
  max!: number;

  @ApiProperty({ type: [OptionDistributionDto] })
  distribution!: OptionDistributionDto[];
}

class QuestionResultDto {
  @ApiProperty()
  question_id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  total_answers!: number;

  @ApiPropertyOptional({ type: ScaleStatisticsDto })
  scale_statistics?: ScaleStatisticsDto;

  @ApiPropertyOptional({ type: [OptionDistributionDto] })
  distribution?: OptionDistributionDto[];
}

export class SurveyResultsDto {
  @ApiProperty()
  survey_id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  total_responses!: number;

  @ApiProperty({ type: [QuestionResultDto] })
  questions!: QuestionResultDto[];
}
