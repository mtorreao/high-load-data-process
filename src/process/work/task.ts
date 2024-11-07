import { PrismaBlockchainService } from '../../prisma/prisma.blockchain.service';
import { Transaction as TransactionBase } from '../../../prisma/generated/base';
const prismaBaseService = new PrismaBlockchainService();

type Message = {
  idx: number;
  data: TransactionBase[];
};

process.on('message', async ({ idx, data }: Message) => {
  console.log(`Process ${idx} received message`, data.length);
  await prismaBaseService.transaction.createMany({
    data: data.map((row) => ({
      addressFrom: row.addressFrom,
      addressTo: row.addressTo,
      amountFrom: row.amountFrom,
      amountTo: row.amountTo,
      block: row.block,
      network: row.network,
      symbolFrom: row.symbolFrom,
      symbolTo: row.symbolTo,
      status: row.status,
      timestamp: row.timestamp,
      transactionFee: row.transactionFee,
      transactionHash: row.transactionHash,
    })),
  });
  process.send?.({ message: 'done', length: data.length });
});

process.on('exit', async () => {
  console.log('Process exited');
  await prismaBaseService.$disconnect();
});
