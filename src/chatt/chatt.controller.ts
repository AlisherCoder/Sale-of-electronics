import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChattService } from './chatt.service';
import { CreateChattDto } from './dto/create-chatt.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@Controller('chatt')
export class ChattController {
  constructor(private readonly chattService: ChattService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChattDto: CreateChattDto, @Req() req: Request) {
    return this.chattService.create(createChattDto, req);
  }

  @UseGuards(AuthGuard)
  @Get('open-chat/:product_id')
  openChat(@Param('product_id') product_id: string, @Req() req: Request) {
    return this.chattService.openChat(product_id, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.chattService.remove(id, req);
  }
}
