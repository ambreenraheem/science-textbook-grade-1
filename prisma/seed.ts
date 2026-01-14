/**
 * Prisma Seed Script for Grade-1 Science Learning Web Application
 *
 * Populates the database with:
 * - 5 Science Topics
 * - 17 Lessons (mapped to MDX files)
 * - 1 Admin user
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================================================
  // 1. Create Admin User
  // ============================================================================
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@science-grade1.local' },
    update: {},
    create: {
      email: 'admin@science-grade1.local',
      role: Role.admin,
    },
  });
  console.log(`✓ Admin user created: ${adminUser.email}\n`);

  // ============================================================================
  // 2. Create Topics
  // ============================================================================
  console.log('📚 Creating topics...');

  const topics = [
    {
      title: 'Living and Non-living Things',
      slug: '01-living-nonliving',
      description: 'Learn what makes something alive and how to tell living things from non-living things',
      orderIndex: 1,
    },
    {
      title: 'Human Body and Senses',
      slug: '02-human-body-senses',
      description: 'Explore your five senses and learn about different parts of your body',
      orderIndex: 2,
    },
    {
      title: 'Animals',
      slug: '03-animals',
      description: 'Discover different animals, where they live, and what they eat',
      orderIndex: 3,
    },
    {
      title: 'Plants',
      slug: '04-plants',
      description: 'Learn about plants, their parts, and how they help us',
      orderIndex: 4,
    },
    {
      title: 'Earth and Universe',
      slug: '05-earth-universe',
      description: 'Explore our planet Earth, the sun, moon, stars, and weather',
      orderIndex: 5,
    },
  ];

  const createdTopics: Record<string, any> = {};

  for (const topicData of topics) {
    const topic = await prisma.topic.upsert({
      where: { slug: topicData.slug },
      update: topicData,
      create: topicData,
    });
    createdTopics[topicData.slug] = topic;
    console.log(`✓ Created topic: ${topic.title}`);
  }
  console.log('');

  // ============================================================================
  // 3. Create Lessons
  // ============================================================================
  console.log('📝 Creating lessons...');

  const lessons = [
    // Topic 1: Living and Non-living Things
    {
      topicSlug: '01-living-nonliving',
      title: 'What Makes Something Alive?',
      contentPath: 'topics/01-living-nonliving/what-is-alive',
      orderIndex: 1,
    },
    {
      topicSlug: '01-living-nonliving',
      title: 'Non-living Things Around Us',
      contentPath: 'topics/01-living-nonliving/nonliving-things',
      orderIndex: 2,
    },
    {
      topicSlug: '01-living-nonliving',
      title: 'Sorting Living and Non-living',
      contentPath: 'topics/01-living-nonliving/sorting-activity',
      orderIndex: 3,
    },

    // Topic 2: Human Body and Senses
    {
      topicSlug: '02-human-body-senses',
      title: 'The Five Senses',
      contentPath: 'topics/02-human-body-senses/five-senses',
      orderIndex: 1,
    },
    {
      topicSlug: '02-human-body-senses',
      title: 'Parts of Your Body',
      contentPath: 'topics/02-human-body-senses/body-parts',
      orderIndex: 2,
    },
    {
      topicSlug: '02-human-body-senses',
      title: 'Using Your Senses',
      contentPath: 'topics/02-human-body-senses/using-senses',
      orderIndex: 3,
    },

    // Topic 3: Animals
    {
      topicSlug: '03-animals',
      title: 'Animals Around Us',
      contentPath: 'topics/03-animals/animals-around-us',
      orderIndex: 1,
    },
    {
      topicSlug: '03-animals',
      title: 'Animal Homes',
      contentPath: 'topics/03-animals/animal-homes',
      orderIndex: 2,
    },
    {
      topicSlug: '03-animals',
      title: 'What Animals Eat',
      contentPath: 'topics/03-animals/what-animals-eat',
      orderIndex: 3,
    },
    {
      topicSlug: '03-animals',
      title: 'Animal Sounds',
      contentPath: 'topics/03-animals/animal-sounds',
      orderIndex: 4,
    },

    // Topic 4: Plants
    {
      topicSlug: '04-plants',
      title: 'Parts of a Plant',
      contentPath: 'topics/04-plants/plant-parts',
      orderIndex: 1,
    },
    {
      topicSlug: '04-plants',
      title: 'What Plants Need',
      contentPath: 'topics/04-plants/plants-need',
      orderIndex: 2,
    },
    {
      topicSlug: '04-plants',
      title: 'Types of Plants',
      contentPath: 'topics/04-plants/types-of-plants',
      orderIndex: 3,
    },
    {
      topicSlug: '04-plants',
      title: 'How Plants Help Us',
      contentPath: 'topics/04-plants/plants-help-us',
      orderIndex: 4,
    },

    // Topic 5: Earth and Universe
    {
      topicSlug: '05-earth-universe',
      title: 'Day and Night',
      contentPath: 'topics/05-earth-universe/day-and-night',
      orderIndex: 1,
    },
    {
      topicSlug: '05-earth-universe',
      title: 'The Sun, Moon, and Stars',
      contentPath: 'topics/05-earth-universe/sun-moon-stars',
      orderIndex: 2,
    },
    {
      topicSlug: '05-earth-universe',
      title: 'Weather and Seasons',
      contentPath: 'topics/05-earth-universe/weather-seasons',
      orderIndex: 3,
    },
    {
      topicSlug: '05-earth-universe',
      title: 'Our Planet Earth',
      contentPath: 'topics/05-earth-universe/our-planet-earth',
      orderIndex: 4,
    },
  ];

  for (const lessonData of lessons) {
    const { topicSlug, ...lesson } = lessonData;
    const topic = createdTopics[topicSlug];

    if (!topic) {
      console.error(`❌ Topic not found: ${topicSlug}`);
      continue;
    }

    const createdLesson = await prisma.lesson.upsert({
      where: { contentPath: lesson.contentPath },
      update: { ...lesson, topicId: topic.id },
      create: {
        ...lesson,
        topicId: topic.id,
      },
    });

    console.log(`  ✓ Created lesson: ${createdLesson.title}`);
  }
  console.log('');

  // ============================================================================
  // Summary
  // ============================================================================
  console.log('✅ Database seed completed successfully!\n');
  console.log('Summary:');
  console.log(`  - Admin user: ${adminUser.email}`);
  console.log(`  - Topics: ${Object.keys(createdTopics).length}`);
  console.log(`  - Lessons: ${lessons.length}`);
  console.log('\nNext steps:');
  console.log('  1. Update .env with your DATABASE_URL');
  console.log('  2. Run: npx prisma migrate dev --name init');
  console.log('  3. Start creating lesson content in docs/topics/');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
