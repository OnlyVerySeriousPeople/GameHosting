import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const achievements = [
  {
    title: 'First Steps',
    description: 'Play your first game.',
    statTarget: 'totalGamesPlayed',
    operator: '>=',
    threshold: 1,
  },
  {
    title: 'Getting Warmed Up',
    description: 'Complete 5 games.',
    statTarget: 'completedGames',
    operator: '>=',
    threshold: 5,
  },
  {
    title: 'Gaming Enthusiast',
    description: 'Play 50 games in total.',
    statTarget: 'totalGamesPlayed',
    operator: '>=',
    threshold: 50,
  },
  {
    title: 'Persistent Player',
    description: 'Complete 100 games.',
    statTarget: 'completedGames',
    operator: '>=',
    threshold: 100,
  },
];

async function main() {
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { title: achievement.title },
      update: {},
      create: achievement,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
