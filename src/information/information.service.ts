import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InformationService {
  constructor(private prisma: PrismaService) {}

  async create(createInformationDto: CreateInformationDto) {
    try {
      let data = await this.prisma.information.create({
        data: createInformationDto,
      });
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      let data = await this.prisma.information.findMany();
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateInformationDto: UpdateInformationDto) {
    try {
      let data = await this.prisma.information.update({
        where: { id },
        data: updateInformationDto,
      });
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
