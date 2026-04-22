import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Nome do usuário',
    description: 'Nome do usuário',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'email@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
  })
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: ['uuid-do-profile'],
    description: 'Lista de IDs de perfis',
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  profiles!: string[];
}
