import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateCourseDto {
  @ApiProperty({ example: 'Engenharia de Software' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ESW' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'uuid-campus' })
  @IsUUID()
  @IsNotEmpty()
  campusId!: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}