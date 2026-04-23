import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // ✅ força 200
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() data: LoginDto) {
    const result = await this.authService.login(data.email, data.password);

    return new ApiResponseDto(true, 'Login realizado com sucesso', result);
  }
}
