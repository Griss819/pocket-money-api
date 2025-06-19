import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './interfaces/authenticated-request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto) throw new BadRequestException('Invalid login request');
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.token);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get('profile')
  @HttpCode(200)
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('confirm-email')
  @HttpCode(200)
  async confirmEmail(@Query() params: { code: string }) {
    console.log(params.code);
    if (params.code == undefined || params.code == '')
      throw new BadRequestException();
    return await this.authService.confirmRequestValidationToken(params.code);
  }
}
