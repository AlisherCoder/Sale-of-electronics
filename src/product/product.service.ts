import {
  BadRequestException,
  ForbiddenException,
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
      let [info] = await this.prisma.information.findMany();

      let category = await this.prisma.category.findUnique({
        where: { id: createData.category_id },
      });

      if (!category) {
        return new NotFoundException('Not found category');
      }

      if (!colors.length) {
        return new BadRequestException('Colors cannot be empty');
      }

      let current_colors = await this.prisma.color
        .findMany({ select: { id: true } })
        .then((colors) => colors.map((color) => color.id));

      for (let color of colors) {
        if (!current_colors.includes(color)) {
          return new NotFoundException('Not found color');
        }
      }

      if (createProductDto.currency == 'USD') {
        createProductDto.price = createProductDto.price * info.usd || 13000;
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
      let product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });
      if (!product) {
        return new NotFoundException('No product found');
      }

      let data = await this.prisma.product.update({
        data: { status: 'ACTIVE' },
        where: { id: product_id },
      });

      return { data: 'Product activated' };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(query: any) {
    let {
      page = 1,
      limit = 10,
      name,
      price,
      maxPrice,
      minPrice,
      condition,
      bargain,
      trade_type,
      category_id,
      sortBy = 'price',
      order = 'asc',
    } = query;
    page = Number(page);
    limit = Number(limit);
    try {
      let data = await this.prisma.product.findMany({
        where: {
          name: name ? { contains: name, mode: 'insensitive' } : undefined,
          price: {
            gte: Number(minPrice) || undefined,
            lte: Number(maxPrice) || undefined,
            equals: Number(price) || undefined,
          },
          condition: condition || undefined,
          bargain: Boolean(bargain) || undefined,
          trade_type: trade_type || undefined,
          category_id: Number(category_id) || undefined,
          status: 'ACTIVE',
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          Category: true,
          Comments: true,
          Colors: { include: { Color: true } },
        },
      });

      if (!data.length) {
        return new NotFoundException('No products found');
      }

      return { total: data.length, page, limit, data };
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

  async update(id: string, updateProductDto: UpdateProductDto, req: Request) {
    let user = req['user'];
    let { colors, ...updateprd } = updateProductDto;
    let updatedcoler = false;
    try {
      if (updateprd.category_id) {
        let category = await this.prisma.category.findUnique({
          where: { id: updateprd.category_id },
        });

        if (!category) {
          return new NotFoundException('Not found category');
        }
      }

      let product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        return new NotFoundException('No product found');
      }

      if (
        product.user_id != user.id &&
        (user.role != 'ADMIN' || user.role != 'SUPERADMIN')
      ) {
        return new ForbiddenException('Not allowed');
      }

      if (colors && !colors.length) {
        return new BadRequestException('Colors cannot be empty');
      } else if (colors && colors.length) {
        let current_colors = await this.prisma.color
          .findMany({ select: { id: true } })
          .then((colors) => colors.map((color) => color.id));

        for (let color of colors) {
          if (!current_colors.includes(color)) {
            return new NotFoundException('Not found color');
          }
        }
        updatedcoler = true;
      }

      let data = await this.prisma.product.update({
        where: { id },
        data: updateprd,
      });

      if (updatedcoler) {
        await this.prisma.colorItem.deleteMany({ where: { product_id: id } });
        for (let col of colors!) {
          await this.prisma.colorItem.create({
            data: { color_id: col, product_id: data.id },
          });
        }
      }

      if (updateprd.image && updateprd.image.length) {
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

  async remove(id: string, req: Request) {
    let user = req['user'];
    try {
      let product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        return new NotFoundException('Not found product');
      }

      let data = await this.prisma.product.delete({ where: { id } });

      if (
        data.user_id != user.id &&
        (user.role != 'ADMIN' || user.role != 'SUPERADMIN')
      ) {
        return new ForbiddenException('Not allowed');
      }

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

  async getPending(query: any) {
    let { page = 1, limit = 10, sortBy = 'created_at', order = 'asc' } = query;
    try {
      let data = await this.prisma.product.findMany({
        where: { status: 'PENDING' },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        include: {
          Category: true,
          User: true,
          Colors: { include: { Color: true } },
        },
      });

      if (!data.length) {
        return new NotFoundException('Not found products');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getInActive(query: any) {
    let { page = 1, limit = 10, sortBy = 'created_at', order = 'asc' } = query;
    try {
      let data = await this.prisma.product.findMany({
        where: { status: 'INACTIVE' },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        include: {
          Category: true,
          User: true,
          Colors: { include: { Color: true } },
        },
      });

      if (!data.length) {
        return new NotFoundException('Not found products');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getByReyting(query: any) {
    let { page = 1, limit = 10 } = query;
    page = Number(page);
    limit = Number(limit);
    try {
      let data = await this.prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: {
          Category: true,
          Comments: {
            select: {
              stars: true,
            },
          },
          Colors: { include: { Color: true } },
        },
      });

      if (!data.length) {
        return new BadRequestException('Not found data');
      }

      data = data.map((prd) => ({
        ...prd,
        avgStars: prd.Comments.length
          ? prd.Comments.reduce((sum, comment) => sum + comment.stars, 0) /
            prd.Comments.length
          : 0,
      }));

      data.sort((a, b) => b['avgStars'] - a['avgStars']);
      let skip = (page - 1) * limit;
      let take = skip + limit;

      data = data.slice(skip, take);

      return { total: data.length, page, limit, data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
