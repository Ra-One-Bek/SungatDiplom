import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  const adminName = process.env.ADMIN_SEED_NAME || 'Super Admin';

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD is not defined');
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        name: adminName,
        passwordHash,
        role: UserRole.ADMIN,
      },
    });

    console.log(`Updated existing admin: ${adminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash,
        role: UserRole.ADMIN,
      },
    });

    console.log(`Created admin: ${adminEmail}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});