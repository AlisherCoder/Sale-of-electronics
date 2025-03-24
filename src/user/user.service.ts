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
      let session = await this.checkSession(user.id, req.ip!);
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
        },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMyLikes(req: Request, query: any) {
    let { page = 1, limit = 10 } = query;
    let user = req['user'];
    try {
      let session = await this.checkSession(user.id, req.ip!);
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

      let data = await this.prisma.like.findMany({
        where: { user_id: user.id },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: { Product: { include: { Category: true } } },
      });

      if (!data.length) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMyView(req: Request, query: any) {
    let { page = 1, limit = 10 } = query;
    let user = req['user'];
    try {
      let session = await this.checkSession(user.id, req.ip!);
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

      let data = await this.prisma.view.findMany({
        where: { user_id: user.id },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          date: 'desc',
        },
        include: { Product: { include: { Category: true } } },
      });

      if (!data.length) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMyProducts(req: Request, query: any) {
    let { page = 1, limit = 10, sortBy = 'created_at', order = 'desc' } = query;
    let user = req['user'];
    try {
      let session = await this.checkSession(user.id, req.ip!);
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

      let data = await this.prisma.product.findMany({
        where: { user_id: user.id },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        include: { Category: true },
      });

      if (!data.length) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMyChats(req: Request, query: any) {
    let { page = 1, limit = 10 } = query;

    let user = req['user'];
    try {
      let data = await this.prisma.chat.findMany({
        where: { from_id: user.id },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          date: 'desc',
        },
        include: { product: true, to: true, from: true },
      });

      if (!data.length) {
        return new NotFoundException('Not found chats');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMyOrders(req: Request, query: any) {
    let { page = 1, limit = 10, sortBy = 'date', order = 'desc' } = query;
    let user = req['user'];
    try {
      let session = await this.checkSession(user.id, req.ip!);
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

      let data = await this.prisma.order.findMany({
        where: { buyyer_id: user.id },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        include: { Product: { include: { Category: true, User: true } } },
      });

      if (!data.length) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getSession(req: Request) {
    let user = req['user'];
    try {
      let session = await this.checkSession(user.id, req.ip!);
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

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

  async findAll(query: any) {
    let {
      last_name,
      first_name,
      email,
      phone,
      region_id,
      role,
      status,
      page = 1,
      limit = 10,
      orderBy = 'created_at',
      order = 'desc',
    } = query;
    try {
      let data = await this.prisma.user.findMany({
        where: {
          first_name: first_name
            ? { contains: first_name, mode: 'insensitive' }
            : undefined,
          last_name: last_name
            ? { contains: last_name, mode: 'insensitive' }
            : undefined,
          email: email ? { contains: email, mode: 'insensitive' } : undefined,
          phone: phone ? { contains: phone, mode: 'insensitive' } : undefined,
          region_id: Number(region_id) || undefined,
          role: role || undefined,
          status: status || undefined,
        },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          [orderBy]: order,
        },
      });

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

  async checkSession(user_id: string, ip: string) {
    try {
      let session = await this.prisma.session.findFirst({
        where: { user_id, ip },
      });
      return session;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
