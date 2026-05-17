import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SurveyResponseDto {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  campus_id!: string;

  @ApiPropertyOptional()
  course_id?: string;

  @ApiProperty()
  service_id!: string;

  @ApiProperty()
  is_anonymous!: boolean;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  deleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
