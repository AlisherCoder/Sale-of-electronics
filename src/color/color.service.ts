import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async create(createColorDto: CreateColorDto) {
    try {
      let color = await this.prisma.color.findFirst({
        where: { name: createColorDto.name },
      });

      if (color) {
        return new ConflictException('Color already exists');
      }

      let data = await this.prisma.color.create({
        data: createColorDto,
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      let data = await this.prisma.color.findMany();

      if (!data.length) {
        return new NotFoundException('No colors found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let data = await this.prisma.color.findUnique({
        where: { id },
        include: { Items: true },
      });

      if (!data) {
        return new NotFoundException('No color found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    try {
      let color = await this.prisma.color.findFirst({
        where: { name: updateColorDto.name },
      });

      if (color) {
        return new ConflictException('Color already exists');
      }

      let data = await this.prisma.color.update({
        where: { id },
        data: updateColorDto,
      });

      if (!data) {
        return new NotFoundException('No color found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let data = await this.prisma.color.delete({ where: { id } });

      if (!data) {
        return new NotFoundException('No color found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
