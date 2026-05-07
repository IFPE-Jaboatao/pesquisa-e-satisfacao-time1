import { ApiProperty } from '@nestjs/swagger';

export class SurveyResponseDto {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  campus_id!: string;

  @ApiProperty()
  course_id!: string;

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
