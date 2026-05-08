import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums/status.enum';

export class ClassResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  courseName!: string;

  @ApiProperty()
  semester!: number;

  @ApiProperty()
  year!: number;

  @ApiProperty({ enum: Status })
  status!: Status;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}
