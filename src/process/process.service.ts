import { Injectable } from '@nestjs/common';
import { Transaction as TransactionBase } from 'prisma/generated/base';
import { PrismaBaseService } from 'src/prisma/prisma.base.service';

const TRANSACTIONS_BATCH_SIZE = 1000;

@Injectable()
export class ProcessService {
  constructor(private readonly prismaBaseService: PrismaBaseService) {}

  private async *getTransactions(page = 0) {
    const transactions = await this.prismaBaseService.transaction.findMany({
      where: {
        id: { gt: page * TRANSACTIONS_BATCH_SIZE },
        synced: false,
      },
      skip: 0,
      take: TRANSACTIONS_BATCH_SIZE,
      orderBy: {
        id: 'asc',
      },
    });
    if (!transactions.length) return;
    yield transactions;
    yield* this.getTransactions(page + 1);
  }

  private async syncTransactions(transactions: TransactionBase[]) {
    await this.prismaBaseService.transaction.updateMany({
      where: {
        id: { in: transactions.map((t) => t.id) },
      },
      data: { synced: true },
    });
  }

  async handler() {
    console.time('[PROCESS_SERVICE]');
    let totalItens = 0;
    const syncPromise = [];
    for await (const transactions of this.getTransactions()) {
      totalItens += transactions.length;
      syncPromise.push(this.syncTransactions(transactions));
    }
    console.time('[SYNC_TRANSACTIONS]');
    await Promise.all(syncPromise);
    console.timeEnd('[SYNC_TRANSACTIONS]');
    console.timeEnd('[PROCESS_SERVICE]');
    console.log(`Total itens processed: ${totalItens}`);
  }
}
