#!/bin/bash

# Generate
npx prisma generate --schema=./prisma/schema.base.prisma
npx prisma generate --schema=./prisma/schema.blockchain.prisma

# Migrate
npx prisma migrate dev --schema=./prisma/schema.base.prisma
npx prisma migrate dev --schema=./prisma/schema.blockchain.prisma
