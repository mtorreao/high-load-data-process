import { Module } from '@nestjs/common';
import { ProcessController } from './process.controller';
import { WorkService } from './work/work.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProcessService } from './process.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProcessController],
  providers: [WorkService, ProcessService],
})
export class ProcessModule {}
