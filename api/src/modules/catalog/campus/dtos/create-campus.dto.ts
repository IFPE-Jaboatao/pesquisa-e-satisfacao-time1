import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateCampusDto {
  @ApiProperty({ example: 'Campus Recife' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'REC' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Av. Professor Luiz Freire, Recife' })
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsOptional()
  @IsEnum(Status)
  status!: Status;
}
