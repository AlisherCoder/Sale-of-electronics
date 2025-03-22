import {
  ActivateDto,
  CreateAuthDto,
  LoginDto,
  ResetPasswordDto,
  SendOtpDto,
} from './dto/create-auth.dto';
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role, Roles } from 'src/guards/roles.decorator';
import { RefreshGuard } from 'src/guards/refresh.guard';
import { RolesGuard } from 'src/guards/roles.guard';

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

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('super-admin')
  superAdmin(@Body() superAdminDto: SendOtpDto) {
    return this.authService.superAdmin(superAdminDto);
  }

  @Post('send-otp')
  sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOTP(sendOtpDto);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh-token')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
