import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums/status.enum';

export class EnrollmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  userName!: string;

  @ApiProperty()
  userEmail!: string;

  @ApiProperty()
  classId!: string;

  @ApiProperty()
  className!: string;

  @ApiProperty({ enum: Status })
  status!: Status;

  @ApiProperty()
  enrolled_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}
