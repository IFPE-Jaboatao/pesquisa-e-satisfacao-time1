import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateSectorDto {
  @ApiProperty({ example: 'Secretaria Acadêmica' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Setor responsável pela gestão acadêmica' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-campus' })
  @IsUUID()
  @IsNotEmpty()
  campusId!: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
