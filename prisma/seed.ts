import { randomUUID } from 'crypto';
import { PrismaClient } from './generated/base';

const prisma = new PrismaClient();

const networks = ['Bitcoin', 'Ethereum', 'Solana', 'Base', 'Sui', 'Sai'];
const status = ['success', 'failure', 'canceled', 'error', 'catastrophe'];
const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'SUI', 'SAI', 'SHIB'];

const TOTAL_TRANSACTIONS = 1000000;
const BATCH_SIZE = 1000;
const BATCH_COUNT = Math.ceil(TOTAL_TRANSACTIONS / BATCH_SIZE);

async function main() {
  const symbolInt = symbols.length - 1;
  const statusInt = status.length - 1;
  const networkInt = networks.length - 1;

  let count = 0;
  for (let i = 0; i < BATCH_COUNT; i++) {
    const data = [];
    count++;

    for (let y = 0; y < BATCH_SIZE; y++) {
      data.push({
        addressFrom: randomUUID(),
        addressTo: randomUUID(),
        symbolFrom: symbols[Math.floor(Math.random() * symbolInt)],
        symbolTo: symbols[Math.floor(Math.random() * symbolInt)],
        amountFrom: String(count * 1000),
        amountTo: String(count * 990),
        block: String(count * 100),
        network: networks[Math.floor(Math.random() * networkInt)],
        status: status[Math.floor(Math.random() * statusInt)],
        timestamp: String(new Date().toISOString()),
        transactionFee: String(Math.round(Math.random() * 100)),
        transactionHash: randomUUID(),
      });
    }

    await prisma.transaction.createMany({
      data,
    });

    console.log({ count });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
  });
