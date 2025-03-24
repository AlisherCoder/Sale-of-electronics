import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role, Roles } from 'src/guards/roles.decorator';
import { SelfGuard } from 'src/guards/self.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('mydata')
  getMydata(@Req() req: Request) {
    return this.userService.getMydata(req);
  }

  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @UseGuards(AuthGuard)
  @Get('mylikes')
  getMyLikes(@Req() req: Request, @Query() query: any) {
    return this.userService.getMyLikes(req, query);
  }

  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @UseGuards(AuthGuard)
  @Get('myview')
  getMyView(@Req() req: Request, @Query() query: any) {
    return this.userService.getMyView(req, query);
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
  @UseGuards(AuthGuard)
  @Get('myproducts')
  getMyProducts(@Req() req: Request, @Query() query: any) {
    return this.userService.getMyProducts(req, query);
  }

  // @Get('mychats')
  // getMyChats(@Req() req: Request) {
  //   return this.userService.getMyChats(req);
  // }

  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @UseGuards(AuthGuard)
  @Get('myorders')
  getMyOrders(@Req() req: Request, @Query() query: any) {
    return this.userService.getMyOrders(req, query);
  }

  @UseGuards(AuthGuard)
  @Get('sessions')
  getSession(@Req() req: Request) {
    return this.userService.getSession(req);
  }

  @UseGuards(AuthGuard)
  @Delete('session/:id')
  delSession(@Param('id') id: string, @Req() req: Request) {
    return this.userService.delSession(id, req);
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
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    enum: ['USER', 'SUPERADMIN'],
  })
  @ApiQuery({ name: 'region_id', required: false, type: Number })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'last_name', required: false, type: String })
  @ApiQuery({ name: 'first_name', required: false, type: String })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
