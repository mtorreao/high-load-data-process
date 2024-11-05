#!/bin/bash

prisma() {
    ./scripts/prisma.sh
}

npm install

prisma

npm run lint

npm run build
