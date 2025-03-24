import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, req: Request) {
    let user = req['user'];
    try {
      let product = await this.prisma.product.findUnique({
        where: { id: createLikeDto.product_id },
      });
      
      if (!product) {
        return new NotFoundException('No product found');
      }

      let data = await this.prisma.like.create({
        data: { ...createLikeDto, user_id: user.id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string, req: Request) {
    let user = req['user'];
    try {
      let like = await this.prisma.like.findUnique({ where: { id } });
      if (!like) {
        return new NotFoundException('Not found data');
      }

      if (user.id != like.user_id) {
        return new ForbiddenException('Not allowed');
      }
      let data = await this.prisma.like.delete({ where: { id } });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
