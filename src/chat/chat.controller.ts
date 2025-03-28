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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chattService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChattDto: CreateChatDto, @Req() req: Request) {
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
