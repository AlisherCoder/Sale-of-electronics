import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RegionModule } from './region/region.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { OrderModule } from './order/order.module';
import { InformationModule } from './information/information.module';
import { ChatModule } from './chat/chat.module';
import { ChattModule } from './chatt/chatt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RegionModule,
    MailModule,
    UserModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    CategoryModule,
    ColorModule,
    ProductModule,
    CommentModule,
    LikeModule,
    OrderModule,
    InformationModule,
    ChatModule,
    ChattModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
