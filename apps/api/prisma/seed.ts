import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.upsert({
    where: { id: 'a0000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'CN Quận 1',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      phone: '0281234567',
      bankInfo: {
        bank: 'Vietcombank',
        account: '1234567890',
        holder: 'Cafe ABC',
      },
    },
  });

  console.log('Seeded branch:', branch.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
