# Grade-1 Science Textbook - Content Outline

**Target Audience**: Children ages 6-7 (Grade 1)
**Language**: English (with Urdu translation planned)
**Total Topics**: 5

## Topic 01: Living and Non-living Things

**Learning Objectives:**
- Identify living and non-living things
- Understand basic characteristics of living things
- Recognize examples from daily life

**Lessons:**
1. **What Makes Something Alive?**
   - Living things grow
   - Living things need food and water
   - Living things move
   - Examples: dog, cat, tree, flower

2. **Non-living Things Around Us**
   - Things that do not grow
   - Things that do not need food
   - Examples: rock, chair, toy, water

3. **Sorting Living and Non-living**
   - Interactive activity: sort pictures
   - Daily life examples
   - Understanding differences

**Key Vocabulary**: living, non-living, grow, move, food, water

---

## Topic 02: Human Body And Senses

**Learning Objectives:**
- Identify five senses and their organs
- Understand how we use our senses
- Recognize body parts and their functions

**Lessons:**
1. **Our Five Senses**
   - Sight (eyes) - we see colors and shapes
   - Hearing (ears) - we hear sounds
   - Smell (nose) - we smell flowers and food
   - Taste (tongue) - we taste sweet and salty
   - Touch (skin) - we feel hot, cold, soft, hard

2. **Body Parts We Use Every Day**
   - Head, arms, legs, hands, feet
   - What each part helps us do
   - Taking care of our body

3. **How Our Senses Help Us**
   - Using senses to explore the world
   - Senses keep us safe
   - Fun activities with senses

**Key Vocabulary**: senses, see, hear, smell, taste, touch, eyes, ears, nose, tongue, skin

---

## Topic 03: Animals

**Learning Objectives:**
- Identify different types of animals
- Understand where animals live
- Learn what animals eat
- Recognize animal sounds and movements

**Lessons:**
1. **Animals Around Us**
   - Pets (dog, cat, fish, bird)
   - Farm animals (cow, chicken, goat, sheep)
   - Wild animals (lion, elephant, monkey, deer)

2. **Where Animals Live**
   - Homes in water (fish, frog)
   - Homes on land (dog, cat, lion)
   - Homes in air (birds, butterflies)
   - Animal shelters (nest, den, barn, pond)

3. **What Animals Eat**
   - Animals that eat plants (cow, goat, rabbit)
   - Animals that eat meat (lion, tiger, cat)
   - Animals that eat both (dog, bear, humans)

4. **How Animals Move and Sound**
   - Animals that walk, run, jump
   - Animals that swim, fly, crawl
   - Animal sounds (bark, meow, moo, roar)

**Key Vocabulary**: pet, farm, wild, home, nest, food, eat, move, sound

---

## Topic 04: Plants

**Learning Objectives:**
- Identify parts of a plant
- Understand what plants need to grow
- Recognize different types of plants
- Learn how plants help us

**Lessons:**
1. **Parts of a Plant**
   - Roots (underground, take water from soil)
   - Stem (holds plant up, carries water)
   - Leaves (green, make food for plant)
   - Flowers (colorful, make seeds)
   - Fruits and seeds

2. **What Plants Need to Grow**
   - Sunlight (plants need light)
   - Water (plants get thirsty)
   - Soil (plants grow in dirt)
   - Air (plants breathe too)

3. **Types of Plants**
   - Trees (big and tall with trunk)
   - Flowers (small and colorful)
   - Vegetables (we can eat them)
   - Grass (soft and green)

4. **How Plants Help Us**
   - Give us food (fruits, vegetables)
   - Give us oxygen (air to breathe)
   - Make our world beautiful
   - Give shade and shelter

**Key Vocabulary**: roots, stem, leaves, flowers, seeds, grow, sunlight, water, soil, tree

---

## Topic 05: Earth And Universe Planets

**Learning Objectives:**
- Understand day and night
- Identify sun, moon, and stars
- Recognize weather patterns
- Learn about our planet Earth

**Lessons:**
1. **Day and Night**
   - What happens during day (sun is up, bright, we play)
   - What happens at night (moon and stars, dark, we sleep)
   - Why day and night happen (Earth spins)

2. **Sun, Moon, and Stars**
   - The Sun (big, bright, gives light and warmth)
   - The Moon (shines at night, changes shape)
   - Stars (tiny lights in night sky, so many!)

3. **Weather and Seasons**
   - Sunny weather (bright, warm)
   - Rainy weather (clouds, water falls)
   - Windy weather (air moves)
   - Cold and hot days
   - Four seasons (summer, winter, spring, autumn)

4. **Our Planet Earth**
   - Earth is our home
   - Earth is round like a ball
   - Land and water on Earth
   - Taking care of our Earth

**Key Vocabulary**: day, night, sun, moon, stars, weather, sunny, rainy, windy, Earth, planet

---

## Content Guidelines (Per Constitution)

**Language Complexity:**
- Maximum 10 words per sentence
- Grade-1 vocabulary only
- One concept per screen
- Visual support for every concept

**Safety Requirements:**
- All images vetted by educators
- YouTube videos manually reviewed and marked verified_safe
- No external links without approval
- Child-friendly error messages

**Interactive Elements:**
- Simple quizzes (multiple choice, picture matching)
- Sorting activities (drag and drop)
- Embedded chatbot for questions (1-3 sentence responses)
- Progress tracker for completed lessons

**Multimedia:**
- At least 2-3 images per lesson
- 1-2 curated educational videos per topic
- Simple animations for key concepts
- Audio pronunciation for key vocabulary (optional)

---

## Implementation Notes

**Docusaurus Structure:**
```
docs/
├── intro.md
├── topics/
│   ├── 01-living-nonliving/
│   │   ├── index.md
│   │   ├── what-is-alive.mdx
│   │   ├── nonliving-things.mdx
│   │   └── sorting-activity.mdx
│   ├── 02-human-body-senses/
│   │   ├── index.md
│   │   ├── five-senses.mdx
│   │   ├── body-parts.mdx
│   │   └── using-senses.mdx
│   ├── 03-animals/
│   │   ├── index.md
│   │   ├── animals-around-us.mdx
│   │   ├── animal-homes.mdx
│   │   ├── what-animals-eat.mdx
│   │   └── animal-sounds.mdx
│   ├── 04-plants/
│   │   ├── index.md
│   │   ├── plant-parts.mdx
│   │   ├── plants-need.mdx
│   │   ├── types-of-plants.mdx
│   │   └── plants-help-us.mdx
│   └── 05-earth-universe/
│       ├── index.md
│       ├── day-and-night.mdx
│       ├── sun-moon-stars.mdx
│       ├── weather-seasons.mdx
│       └── our-planet-earth.mdx
└── activities/
    ├── quizzes.mdx
    └── experiments.mdx
```

**Database Schema (Topics and Lessons):**
- 5 topics (order_index: 1-5)
- 17 total lessons across all topics
- Progress tracking per student per lesson
- Curated videos linked to lessons

**Estimated Content Volume:**
- ~50-60 MDX pages
- ~100-150 images
- ~10-15 curated videos
- ~30-40 quiz questions
- ~10 interactive activities
