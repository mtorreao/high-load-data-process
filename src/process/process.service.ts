import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from 'src/prisma/prisma.base.service';
import { WorkService } from './work/work.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaBlockchainService } from 'src/prisma/prisma.blockchain.service';

const READ_TRANSACTIONS_BATCH_SIZE = 10000;
const PROCESS_SIZE = 10;

@Injectable()
export class ProcessService {
  constructor(
    private readonly prismaBaseService: PrismaBaseService,
    private readonly prismaBlockchainService: PrismaBlockchainService,
    private readonly workService: WorkService,
  ) {}

  private async *getTransactions(page = 0) {
    const transactions = await this.prismaBaseService.transaction.findMany({
      where: {
        id: { gt: page * READ_TRANSACTIONS_BATCH_SIZE },
      },
      skip: 0,
      take: READ_TRANSACTIONS_BATCH_SIZE,
      orderBy: {
        id: 'asc',
      },
    });
    if (!transactions.length) return;
    yield transactions;
    yield* this.getTransactions(page + 1);
  }

  @OnEvent('start')
  async handler() {
    console.time('[PROCESS_SERVICE]');
    let totalItens = 0;
    const totalTransactions = await this.prismaBaseService.transaction.count();
    const work = await this.workService.handler({
      limitProcess:PROCESS_SIZE,
      onMessage: async (length) => {
        totalItens += length;

        if (totalItens !== totalTransactions) return;

        work.killAll();
        console.timeEnd('[PROCESS_SERVICE]');
        console.log(`Total itens processed: ${totalItens}`);
      },
    });
    console.time('[READ_TRANSACTIONS]');
    for await (const transactions of this.getTransactions()) {
      const totalTransactions = transactions.length;
      const writeTransactionsBatchSize = READ_TRANSACTIONS_BATCH_SIZE / PROCESS_SIZE;
      for (let i = 0; i < totalTransactions; i += writeTransactionsBatchSize) {
        work.send(transactions.slice(i, i + writeTransactionsBatchSize));
      }
    }
    console.timeEnd('[READ_TRANSACTIONS]');
  }

  async reset() {
    console.time('[RESET_TRANSACTIONS]');
    await this.prismaBlockchainService.transaction.deleteMany();
    console.timeEnd('[RESET_TRANSACTIONS]');
  }
}
