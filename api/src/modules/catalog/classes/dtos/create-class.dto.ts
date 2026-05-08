import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateClassDto {
  @ApiProperty({ example: 'Turma A - Programação Web' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'PW-2026-A' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'uuid-do-curso' })
  @IsUUID()
  @IsNotEmpty()
  courseId!: string;

  @ApiProperty({ example: 1, description: 'Semestre (1 ou 2)' })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  semester!: number;

  @ApiProperty({ example: 2026 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  year!: number;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
