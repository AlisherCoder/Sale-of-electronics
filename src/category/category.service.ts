import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      let category = await this.prisma.category.findFirst({
        where: { name: createCategoryDto.name },
      });

      if (category) {
        return new ConflictException('Category already exists');
      }

      let data = await this.prisma.category.create({
        data: createCategoryDto,
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(query: any) {
    let { page = 1, limit = 10, ...filter } = query;
    let search: any = {};
    if (filter.name) {
      search.name = { mode: 'insensitive', contains: filter.name };
    }

    if (filter.type) {
      search.type = filter.type;
    }

    try {
      let data = await this.prisma.category.findMany({
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          name: 'asc',
        },
        where: search,
      });

      if (!data.length) {
        return new NotFoundException('No categories found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.category.findUnique({
        where: { id },
        include: { Products: true },
      });

      if (!data) {
        return new NotFoundException('No category found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      let category = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name },
      });

      if (category) {
        return new ConflictException('Category already exists');
      }

      let data = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      if (!data) {
        return new NotFoundException('No category found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let data = await this.prisma.category.delete({ where: { id } });

      if (!data) {
        return new NotFoundException('No category found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
