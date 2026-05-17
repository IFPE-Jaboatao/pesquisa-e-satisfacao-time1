import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @ApiProperty({ example: 'uuid-da-turma' })
  @IsUUID()
  class_id!: string;
}
