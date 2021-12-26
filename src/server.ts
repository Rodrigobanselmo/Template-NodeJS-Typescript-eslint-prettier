import { v4 } from 'uuid';
require('dotenv').config();
import { app } from './app';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  app.listen(3333, () =>
    console.log(`Server is running on http://${process.env.HOST}:${3333}/`),
  );
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
