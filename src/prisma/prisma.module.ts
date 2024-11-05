import { Global, Module } from '@nestjs/common';
import { PrismaBaseService } from './prisma.base.service';
import { PrismaBlockchainService } from './prisma.blockchain.service';

@Global()
@Module({
  providers: [PrismaBaseService, PrismaBlockchainService],
  exports: [PrismaBaseService, PrismaBlockchainService],
})
export class PrismaModule {}
