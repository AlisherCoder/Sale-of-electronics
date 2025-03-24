import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChattDto } from './dto/create-chatt.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChattService {
  constructor(private prisma: PrismaService) {}

  async create(createChattDto: CreateChattDto, req: Request) {
    let { product_id } = createChattDto;
    let user = req['user'];
    try {
      let product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return new NotFoundException('Not found product');
      }

      let message = await this.prisma.chat.create({
        data: { ...createChattDto, from_id: user.id, to_id: product.user_id },
      });

      return { data: message };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async openChat(product_id: string, req: Request) {
    let user = req['user'];
    try {
      let product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return new NotFoundException('Not found product');
      }

      let chat = await this.prisma.chat.findMany({
        where: { product_id, from_id: user.id, to_id: product.user_id },
        include: { from: true, to: true, product: true },
      });

      if (!chat) {
        return new NotFoundException('Not found chat');
      }

      return { data: chat };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string, req: Request) {
    let user = req['user'];
    try {
      let message = await this.prisma.chat.findUnique({
        where: { id },
      });

      if (!message) {
        return new NotFoundException('Not found message');
      }

      if (
        message.from_id != user.id &&
        (user.role != 'ADMIN' || user.role != 'SUPERADMIN')
      ) {
        return new ForbiddenException('Not allowed');
      }
      let deleted = await this.prisma.chat.delete({
        where: { id },
      });

      return { data: deleted };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
