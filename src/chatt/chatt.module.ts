import { Module } from '@nestjs/common';
import { ChattService } from './chatt.service';
import { ChattController } from './chatt.controller';

@Module({
  controllers: [ChattController],
  providers: [ChattService],
})
export class ChattModule {}
