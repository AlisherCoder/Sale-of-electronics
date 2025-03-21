import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ActivateDto,
  CreateAuthDto,
  LoginDto,
  SendOtpDto,
} from './dto/create-auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginDto, req);
  }

  @Post('activate')
  activate(@Body() activateDto: ActivateDto) {
    return this.authService.activate(activateDto);
  }

  @Post('send-otp')
  sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOTP(sendOtpDto);
  }
}
