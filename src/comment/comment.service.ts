import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, req: Request) {
    let user = req['user'];
    try {
      let product = await this.prisma.product.findUnique({
        where: { id: createCommentDto.product_id },
      });

      if (!product) {
        return new NotFoundException('No product found');
      }

      let data = await this.prisma.comment.create({
        data: { ...createCommentDto, user_id: user.id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, req) {
    let user = req['user'];
    try {
      let comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        return new NotFoundException('Not found data');
      }

      if (comment.user_id != user.id && user.role != 'ADMIN') {
        return new ForbiddenException('Not allowed');
      }

      let data = await this.prisma.comment.update({
        data: updateCommentDto,
        where: { id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string, req) {
    let user = req['user'];
    try {
      let comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        return new NotFoundException('Not found data');
      }

      if (comment.user_id != user.id && user.role != 'ADMIN') {
        return new ForbiddenException('Not allowed');
      }
      let data = await this.prisma.comment.delete({ where: { id } });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
