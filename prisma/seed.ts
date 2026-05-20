/**
 * Seed script — populates the dev database with sample users and typing results.
 *
 * Run:  npm run db:seed
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── Seeded accounts (all share the same password for dev convenience) ────────
const SEED_PASSWORD = 'DevPass123!';

const USERS: { name: string; email: string }[] = [
  { name: 'Speed Demon',   email: 'speeddemon@dev.local' },
  { name: 'Night Owl',     email: 'nightowl@dev.local' },
  { name: 'Clarice K',     email: 'claricek@dev.local' },
  { name: 'Byte Racer',    email: 'byteracer@dev.local' },
  { name: 'Type Lord',     email: 'typelord@dev.local' },
  { name: 'Azrael404',     email: 'azrael@dev.local' },
  { name: 'Silent Keys',   email: 'silentkeys@dev.local' },
  { name: 'Phantom Dev',   email: 'phantomdev@dev.local' },
  { name: 'Inkbound',      email: 'inkbound@dev.local' },
  { name: 'Chrono Type',   email: 'chronotype@dev.local' },
  { name: 'Neon Fingers',  email: 'neonfingers@dev.local' },
  { name: 'Qwerty Queen',  email: 'qwertyqueen@dev.local' },
];

// Typing sessions per user — [wpm, accuracy, mode]
const TYPING_SESSIONS: Record<string, [number, number, string][]> = {
  'speeddemon@dev.local': [
    [224, 98.4, '60'], [218, 97.8, '30'], [212, 98.0, '60'],
    [209, 96.9, '15'], [205, 98.2, '60'], [224, 99.1, '60'],
    [198, 97.5, '100'], [215, 98.6, '60'],
  ],
  'nightowl@dev.local': [
    [198, 97.1, '60'], [194, 96.8, '60'], [190, 97.4, '30'],
    [186, 96.5, '15'], [193, 97.9, '60'], [188, 96.2, '50'],
    [196, 97.0, '60'],
  ],
  'claricek@dev.local': [
    [187, 99.0, '60'], [185, 98.7, '60'], [182, 99.2, '30'],
    [180, 98.5, '60'], [184, 99.0, '60'], [179, 98.8, '25'],
  ],
  'byteracer@dev.local': [
    [176, 96.5, '60'], [172, 95.9, '30'], [174, 96.8, '60'],
    [168, 95.5, '15'], [170, 96.1, '60'],
  ],
  'typelord@dev.local': [
    [169, 97.8, '60'], [165, 97.2, '60'], [163, 98.0, '30'],
    [161, 97.5, '60'], [166, 97.9, '100'],
  ],
  'azrael@dev.local': [
    [165, 95.2, '60'], [160, 94.8, '30'], [162, 95.5, '60'],
    [158, 94.5, '15'], [163, 95.1, '60'],
  ],
  'silentkeys@dev.local': [
    [161, 98.1, '60'], [158, 97.8, '60'], [155, 98.3, '30'],
    [153, 97.5, '60'],
  ],
  'phantomdev@dev.local': [
    [155, 96.8, '60'], [152, 96.3, '30'], [150, 97.0, '60'],
    [148, 96.0, '50'],
  ],
  'inkbound@dev.local': [
    [150, 97.5, '60'], [147, 97.0, '30'], [145, 97.8, '60'],
  ],
  'chronotype@dev.local': [
    [148, 96.0, '60'], [145, 95.5, '30'], [142, 96.3, '60'],
  ],
  'neonfingers@dev.local': [
    [138, 95.0, '60'], [135, 94.6, '30'], [140, 95.3, '60'],
  ],
  'qwertyqueen@dev.local': [
    [130, 94.0, '60'], [127, 93.5, '30'], [132, 94.4, '60'],
  ],
};

async function main() {
  console.log('🌱 Seeding database…');

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const userData of USERS) {
    const user = await prisma.user.upsert({
      where:  { email: userData.email },
      update: {},
      create: {
        name:     userData.name,
        email:    userData.email,
        password: hashedPassword,
      },
    });

    const sessions = TYPING_SESSIONS[userData.email] ?? [];

    for (const [wpm, accuracy, mode] of sessions) {
      // Spread results over the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(Date.now() - daysAgo * 86_400_000);

      await prisma.typingResult.create({
        data: { userId: user.id, wpm, accuracy, mode, createdAt },
      });
    }

    console.log(`  ✓ ${userData.name} (${sessions.length} sessions)`);
  }

  console.log('\n✅ Seed complete.');
  console.log(`\n📋 Dev credentials (all accounts):`);
  console.log(`   Password: ${SEED_PASSWORD}`);
  USERS.forEach(u => console.log(`   ${u.email}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
