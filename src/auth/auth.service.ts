import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActivateDto,
  CreateAuthDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SendOtpDto,
} from './dto/create-auth.dto';
import * as DeviseDetector from 'device-detector-js';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { totp } from 'otplib';
import { MailService } from 'src/mail/mail.service';
import { Request } from 'express';
import { Session } from 'src/types/types';
import { JwtService } from '@nestjs/jwt';

totp.options = { step: 600, digits: 5 };

@Injectable()
export class AuthService {
  private readonly deviceDetector = new DeviseDetector();
  private otpsecret = process.env.OTP_KEY;
  private refsecret = process.env.REFRESH_KEY;
  private accsecret = process.env.ACCESS_KEY;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    let { email, password, region_id, phone } = createAuthDto;
    try {
      let foundemail = await this.prisma.user.findUnique({ where: { email } });
      if (foundemail) {
        return new ConflictException(
          'User already exists with this email address',
        );
      }

      let foundphone = await this.prisma.user.findUnique({ where: { phone } });
      if (foundphone) {
        return new ConflictException('User already exists with this number');
      }

      let region = await this.prisma.region.findUnique({
        where: { id: region_id },
      });
      if (!region) {
        return new NotFoundException('Not found region');
      }

      let hash = bcrypt.hashSync(password, 10);
      await this.prisma.user.create({
        data: { ...createAuthDto, password: hash },
      });

      let otp = totp.generate(this.otpsecret + email);
      await this.mailService.sendMail(
        email,
        'Activate account',
        `Code for verify account - ${otp}`,
      );

      return {
        data: 'Registration was successful. The code was sent to your email, please activate your account.',
      };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto, req: Request) {
    let { email, password } = loginDto;
    try {
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return new UnauthorizedException('Unauthorized');
      }

      let match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return new BadRequestException('Email or password is wrong');
      }

      if (user.status != 'ACTIVE') {
        return new BadRequestException(
          'Your account is not active, please activate your account',
        );
      }

      let session = await this.prisma.session.findFirst({
        where: { user_id: user.id, ip: req.ip },
      });

      if (!session) {
        let useragent: any = req.headers['user-agent'];
        let device: any = this.deviceDetector.parse(useragent);

        let newSession: Session = {
          ip: req.ip!,
          user_id: user.id,
          location: req.body.location || null,
          info: device,
        };
        await this.prisma.session.create({ data: newSession });
      }

      let refreshToken = this.genRefreshToken({
        id: user.id,
        role: user.role,
        status: user.status,
      });

      let accessToken = this.genAccessToken({
        id: user.id,
        role: user.role,
        status: user.status,
      });

      return { refreshToken, accessToken };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async activate(activateDto: ActivateDto) {
    let { email, otp } = activateDto;
    try {
      let isValid = totp.check(otp, this.otpsecret + email);
      if (!isValid) {
        return new BadRequestException('Email or OTP is wrong');
      }

      let user = await this.prisma.user.update({
        where: { email },
        data: { status: 'ACTIVE' },
      });

      if (!user) {
        return new UnauthorizedException('Unauthorized');
      }

      return { data: 'Your account has been successfully activated.', user };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async superAdmin(superAdminDto: SendOtpDto) {
    let { email } = superAdminDto;
    try {
      let superAdmin = await this.prisma.user.update({
        where: { email },
        data: { role: 'SUPERADMIN' },
      });

      return { data: 'Super admin created successfully', superAdmin };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async sendOTP(sendOtpDto: SendOtpDto) {
    let { email } = sendOtpDto;
    try {
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return new UnauthorizedException('Unauthorized');
      }

      let otp = totp.generate(this.otpsecret + email);
      await this.mailService.sendMail(
        email,
        'One time password',
        `OTP code - ${otp}`,
      );

      return { data: 'OTP sent to your email', otp };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async refreshToken(req: Request) {
    let user = req['user'];
    try {
      let updateUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { was_online: new Date() },
      });

      if (!updateUser) {
        return new UnauthorizedException('Unauthorized');
      }

      let accessToken = this.genAccessToken({
        id: user.id,
        role: user.role,
        status: user.status,
      });

      return { accessToken, updateUser };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let { email, otp, new_password } = resetPasswordDto;
    try {
      let isValid = totp.check(otp, this.otpsecret + email);
      if (!isValid) {
        return new BadRequestException('OTP or email is wrong');
      }

      let hash = bcrypt.hashSync(new_password, 10);
      await this.prisma.user.update({
        where: { email },
        data: { password: hash },
      });

      return { data: 'Your password updated successfully' };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  genRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.refsecret,
      expiresIn: '7d',
    });
  }

  genAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.accsecret,
      expiresIn: '12h',
    });
  }
}
