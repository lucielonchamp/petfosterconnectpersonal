import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting seeding process from JSON...');

  const jsonPath = path.join(__dirname, 'init-db.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Seed data file not found at ${jsonPath}`);
  }
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // 1. Create Roles
  console.log('Creating Roles...');
  await prisma.role.createMany({
    data: jsonData.roles,
    skipDuplicates: true,
  });
  console.log('Roles created.');

  // 2. Create Species
  console.log('Creating Species...');
  await prisma.specie.createMany({
    data: jsonData.species,
    skipDuplicates: true,
  });
  console.log('Species created.');

  // 3. Create Users (avec hachage de mot de passe)
  console.log('Hashing passwords and creating Users...');
  const usersToCreate = await Promise.all(
    jsonData.users.map(async (user: any) => {
      const hashedPassword = await bcrypt.hash(
        user.password,
        parseInt(process.env.SALT_ROUNDS || '10', 10)
      );
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );
  await prisma.user.createMany({
    data: usersToCreate,
    skipDuplicates: true,
  });
  console.log('Users created.');

  // 4. Create Shelters
  console.log('Creating Shelters...');

  await Promise.all(
    jsonData.shelters.map((shelter: any) =>
      prisma.shelter.upsert({
        where: { id: shelter.id },
        update: shelter,
        create: shelter,
      })
    )
  );
  console.log('Shelters created.');

  // 5. Create Fosters
  console.log('Creating Fosters...');
  await Promise.all(
    jsonData.fosters.map((foster: any) =>
      prisma.foster.upsert({
        where: { id: foster.id },
        update: foster,
        create: foster,
      })
    )
  );
  console.log('Fosters created.');

  // 6. Create Animals
  console.log('Creating Animals...');
  await Promise.all(
    jsonData.animals.map((animal: any) =>
      prisma.animal.upsert({
        where: { id: animal.id },
        update: { ...animal, fosterId: animal.fosterId || null },
        create: { ...animal, fosterId: animal.fosterId || null },
      })
    )
  );
  console.log('Animals created.');

  // 7. Create Requests
  console.log('Creating Requests...');
  await Promise.all(
    jsonData.requests.map((request: any) =>
      prisma.request.upsert({
        where: { id: request.id },
        update: request,
        create: request,
      })
    )
  );
  console.log('Requests created.');

  console.log('Seeding finished successfully.');
}

seed()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
