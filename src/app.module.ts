import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProcessModule } from './process/process.module';

@Module({
  imports: [PrismaModule, ProcessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
