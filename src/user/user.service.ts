import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMydata(req: Request) {
    let user = req['user'];
    try {
      let session = await this.prisma.session.findFirst({
        where: { user_id: user.id, ip: req.ip },
      });

      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

      let data = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: {
          Sessions: true,
          Products: true,
          Comments: true,
          Likes: true,
          Views: true,
          Orders: true,
        },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getSession(req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.session.findMany({
        where: { user_id: user.id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async delSession(id: string, req: Request) {
    let user = req['user'];
    try {
      let session = await this.prisma.session.delete({
        where: { user_id: user.id, id },
      });
      return { data: session };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      let data = await this.prisma.user.findMany();

      if (!data.length) {
        return new NotFoundException('No users found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let data = await this.prisma.user.findUnique({
        where: { id },
        include: {
          Sessions: true,
          Products: true,
          Comments: true,
          Likes: true,
          Views: true,
          Orders: true,
        },
      });

      if (!data) {
        return new NotFoundException('Not found user');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let { image, region_id } = updateUserDto;

    try {
      if (region_id) {
        let region = await this.prisma.region.findUnique({
          where: { id: region_id },
        });

        if (!region) {
          return new NotFoundException('Not found region');
        }
      }

      let user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        return new NotFoundException('Not found user');
      }

      let data = await this.prisma.user.update({
        data: updateUserDto,
        where: { id },
      });

      if (image && user.image.length) {
        user.image.forEach((image) => {
          let pathfile = path.join('uploads', image);
          try {
            fs.unlinkSync(pathfile);
          } catch (error) {
            console.log(error.message);
          }
        });
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let data = await this.prisma.user.delete({ where: { id } });

      if (data.image.length) {
        data.image.forEach((image) => {
          let pathfile = path.join('uploads', image);
          try {
            fs.unlinkSync(pathfile);
          } catch (error) {
            console.log(error.message);
          }
        });
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
