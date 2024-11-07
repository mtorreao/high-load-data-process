#!/bin/bash

# Generate
npx prisma generate --schema=./prisma/base/schema.base.prisma
npx prisma generate --schema=./prisma/blockchain/schema.blockchain.prisma

# Migrate
npx prisma migrate dev --schema=./prisma/base/schema.base.prisma
npx prisma migrate dev --schema=./prisma/blockchain/schema.blockchain.prisma
