import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums/status.enum';

export class CourseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  campusId!: string;

  @ApiProperty({ enum: Status })
  status!: Status;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}