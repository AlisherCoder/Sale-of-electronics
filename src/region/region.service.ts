import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    try {
      let region = await this.prisma.region.findFirst({
        where: { name: createRegionDto.name },
      });

      if (region) {
        return new ConflictException('Region already exists');
      }

      let data = await this.prisma.region.create({
        data: createRegionDto,
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      let data = await this.prisma.region.findMany();

      if (!data.length) {
        return new NotFoundException('No regions found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.region.findUnique({
        where: { id },
        include: { Users: true },
      });

      if (!data) {
        return new NotFoundException('No region found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    try {
      let region = await this.prisma.region.findFirst({
        where: { name: updateRegionDto.name },
      });

      if (region) {
        return new ConflictException('Region already exists');
      }

      let data = await this.prisma.region.update({
        where: { id },
        data: updateRegionDto,
      });

      if (!data) {
        return new NotFoundException('No region found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let data = await this.prisma.region.delete({ where: { id } });

      if (!data) {
        return new NotFoundException('No region found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
