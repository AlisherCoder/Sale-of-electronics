import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActiveProductDto, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    let { colors, ...createData } = createProductDto;
    let user = req['user'];
    try {
      let category = await this.prisma.category.findUnique({
        where: { id: createData.category_id },
      });

      if (!category) {
        return new NotFoundException('Not found category');
      }

      if (!colors.length) {
        return new BadRequestException('Colors cannot be empty');
      }

      if (createProductDto.currency == 'USD') {
        createProductDto.price = createProductDto.price * 12.926;
      }

      let newProduct = await this.prisma.product.create({
        data: { ...createData, user_id: user.id },
      });

      for (let col of colors) {
        let colorItem = await this.prisma.colorItem.create({
          data: { color_id: col, product_id: newProduct.id },
        });
      }

      return { data: newProduct };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async activate(activeProductDto: ActiveProductDto) {
    let { product_id } = activeProductDto;
    try {
      await this.prisma.product.update({
        data: { status: 'ACTIVE' },
        where: { id: product_id },
      });

      return { data: 'Product activated' };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      let data = await this.prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: { Category: true },
      });

      if (!data.length) {
        return new NotFoundException('No products found');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string, req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.product.findUnique({
        where: { id },
        include: {
          Category: true,
          User: true,
          Comments: {
            include: { User: true },
          },
          Colors: {
            include: { Color: true },
          },
          _count: true,
        },
      });

      if (!data) {
        return new NotFoundException('No products found');
      }

      let view = await this.prisma.view.findFirst({
        where: { user_id: user.id, product_id: id },
      });

      if (!view) {
        await this.prisma.view.create({
          data: { user_id: user.id, product_id: id },
        });
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let { category_id, image, colors } = updateProductDto;
    try {
      if (category_id) {
        let category = await this.prisma.category.findUnique({
          where: { id: category_id },
        });

        if (!category) {
          return new NotFoundException('Not found category');
        }
      }

      let product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        return new NotFoundException('No product found');
      }

      if (colors && !colors.length) {
        return new BadRequestException('Colors cannot be empty');
      } else if (colors && colors.length) {
        await this.prisma.colorItem.deleteMany({ where: { product_id: id } });
      }

      let data = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      if (image && image.length) {
        product.image.forEach((image) => {
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
      let data = await this.prisma.product.delete({ where: { id } });

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

  async getPending() {
    try {
      let data = await this.prisma.product.findMany({
        where: { status: 'PENDING' },
      });

      if (!data.length) {
        return new NotFoundException('Not found products');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getInActive() {
    try {
      let data = await this.prisma.product.findMany({
        where: { status: 'INACTIVE' },
      });

      if (!data.length) {
        return new NotFoundException('Not found products');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
