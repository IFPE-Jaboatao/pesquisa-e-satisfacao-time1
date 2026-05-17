import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Nome do aluno' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'aluno@email.com' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '2024001' })
  @IsString()
  @IsNotEmpty()
  registration!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;
}
