import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ActiveProductDto, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role, Roles } from 'src/guards/roles.decorator';

@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('activated')
  activate(@Body() activeProductDto: ActiveProductDto) {
    return this.productService.activate(activeProductDto);
  }

  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('pending')
  getPending(@Query() query: any) {
    return this.productService.getPending(query);
  }

  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('inactive')
  getInActive(@Query() query: any) {
    return this.productService.getInActive(query);
  }

  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @Get('by-reyting')
  getByReyting(@Query() query: any) {
    return this.productService.getByReyting(query);
  }

  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({
    name: 'trade_type',
    required: false,
    type: String,
    enum: ['PAID', 'FREE', 'BARTER'],
  })
  @ApiQuery({ name: 'bargain', required: false, type: Boolean })
  @ApiQuery({
    name: 'condition',
    required: false,
    type: String,
    enum: ['NEW', 'USED'],
  })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'price', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.productService.findOne(id, req);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.update(id, updateProductDto, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.productService.remove(id, req);
  }
}
