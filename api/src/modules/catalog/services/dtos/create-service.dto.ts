import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateServiceDto {
  @ApiProperty({ example: 'Biblioteca' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Acervo bibliográfico e espaço de estudo' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-do-campus' })
  @IsUUID()
  @IsNotEmpty()
  campusId!: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
