import { GameScreen } from '../types/game';

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE MAP (from slide_image_mappings.json + direct inspection)
//
// image_001.png  Kitchen with Mom + Kid, empty tawa on counter  (Slide 3, 4)
// image_002.png  Bowl of dosa batter (ingredient)
// image_003.png  Bowl of potato filling (ingredient)
// image_004.png  Oil bottle (ingredient)
// image_005.png  Spatula / Turner (spatula tool)
// image_006.png  Blue plate (ingredient)
// image_007.png  Close-up batter bowl with spoon
// image_008.png  Kitchen with Mom only, pointing at tawa
// image_009.png  Kitchen with Mom + Kid, empty tawa (clean bg for drag slides)
// image_010.png  Ladle pouring batter onto tawa (overlay)
// image_011.png  Ladle spreading batter (overlay)
// image_012.png  Nicely spread batter circle (overlay)
// image_013.png  Masala being added on dosa (overlay)
// image_014.png  Masala spread on dosa (overlay)
// image_015.png  Oil dripping on dosa edges (overlay)
// image_016.png  Spatula under dosa ready to flip (overlay)
// image_017.png  Spatula lifting folded dosa (overlay)
// image_018.png  Mom + Kid eating dosa (Slide 13)
// image_019.png  Tawa/pan isolated (vocab)
// image_020.png  Gas stove (vocab)
// image_021.png  Refrigerator (vocab)
// image_022.png  Kitchen: batter poured on tawa (full-res cooking background)
// image_023.png  Kitchen: batter spread on tawa (full-res cooking background)
// image_024.png  Kitchen: masala added on tawa (full-res cooking background)
// image_025.png  Kitchen: dosa flipped/served (full-res cooking background)
// image_026.jpg  Kitchen: potato masala put on dosa (full-res cooking background)
// image_027.jpg  Kitchen: potato masala spread evenly (full-res cooking background)
// image_028.png  Kitchen: oil drops added on edges (full-res cooking background)
// image_030.png  Kitchen: folded dosa flipped/ready (full-res cooking background)
// ─────────────────────────────────────────────────────────────────────────────

const IMG = (n: string) => `/make_a_dosa_images/${n}`;

export const makeDosaData: GameScreen[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 1 : Welcome
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-1',
    type: 'welcome',
    slideNumber: 1,
    title: 'Make a Dosa',
    description: 'Follow Aarav and his mom as they cook a yummy masala dosa together!'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 3 : Story: Intro (Mom + Kid, empty tawa, two dialogues)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-3',
    type: 'story',
    slideNumber: 3,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd3-mom',
        speaker: 'mom',
        text: "Today we're going to make a masala dosa! Are you ready?",
        position: { top: 4, left: 2 },
        tailDirection: 'down'
      },
      {
        id: 'd3-kid',
        speaker: 'kid',
        text: "Yes! I'm so hungry!",
        position: { top: 4, left: 58 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 4 : Story-Items: Mom points to ingredients (STATIC display, no drag)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-4',
    type: 'story-items',
    slideNumber: 4,
    image: IMG('image_008.png'),
    dialogues: [
      {
        id: 'd4-mom',
        speaker: 'mom',
        text: "First, let's put some dosa batter.",
        position: { top: 4, left: 38 },
        tailDirection: 'down'
      }
    ],
    items: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') },
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') },
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') },
      { id: 'ladle', label: 'Ladle', image: IMG('image_005.png') },
      { id: 'plate', label: 'Plate', image: IMG('image_006.png') }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 5 : DRAG #1: Pour batter on tawa
  // Start: Empty tawa (image_009.png)
  // Drag item: Dosa Batter
  // Success overlay: image_022.png (full-screen background state showing batter poured)
  // End background: image_022.png
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-5',
    type: 'drag',
    slideNumber: 5,
    instruction: "Can you help me put the batter on the tawa?",
    backgroundImage: IMG('image_009.png'),
    options: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') }
    ],
    correctOptionId: 'batter',
    targetArea: { id: 'tawa', label: 'Tawa', image: IMG('image_019.png') },
    dropTargetPos: { top: 35, left: 5, width: 88, height: 55 },
    successTransitionImage: IMG('image_022.png'),
    nextBackgroundImage: IMG('image_022.png'),
    nextOverlays: [],
    dialogues: [
      {
        id: 'd5-mom',
        speaker: 'mom',
        text: "Can you help me put the batter on the tawa?",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 6 : Story: Spreading the batter
  // Start: Dosa batter spread (image_023.png showing batter spread)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-6',
    type: 'story',
    slideNumber: 6,
    image: IMG('image_023.png'),
    initialOverlays: [],
    dialogues: [
      {
        id: 'd6-mom',
        speaker: 'mom',
        text: "Let's make it bigger.",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 7 : Story: Nicely spread
  // Start: Nicely spread batter (image_024.png showing nicely spread state)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-7',
    type: 'story',
    slideNumber: 7,
    image: IMG('image_024.png'),
    initialOverlays: [],
    dialogues: [
      {
        id: 'd7-mom',
        speaker: 'mom',
        text: "Now it's nicely spread on the tawa.",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 8 : DRAG #2: Add potato masala
  // Start: Nicely spread batter (image_024.png)
  // Drag item: Potato filling
  // Success overlay: image_026.png (potato masala put on dosa)
  // End background: image_026.png
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-8',
    type: 'drag',
    slideNumber: 8,
    instruction: "Let's put some potato masala.",
    backgroundImage: IMG('image_024.png'),
    initialOverlays: [],
    options: [
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') }
    ],
    correctOptionId: 'masala',
    targetArea: { id: 'tawa', label: 'Tawa', image: IMG('image_019.png') },
    dropTargetPos: { top: 35, left: 5, width: 88, height: 55 },
    successTransitionImage: IMG('image_026.png'),
    nextBackgroundImage: IMG('image_026.png'),
    nextOverlays: [],
    dialogues: [
      {
        id: 'd8-mom',
        speaker: 'mom',
        text: "Let's put some potato masala.",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 9 : Story: Spreading the masala
  // Start: potato masala spread evenly (image_027.png)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-9',
    type: 'story',
    slideNumber: 9,
    image: IMG('image_027.png'),
    initialOverlays: [],
    dialogues: [
      {
        id: 'd9-mom',
        speaker: 'mom',
        text: "Let's spread it evenly on the batter.",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 10 : DRAG #3: Add drops of oil
  // Start: Masala spread evenly (image_027.png)
  // Drag item: Oil
  // Success overlay: image_028.png (oil drops added on edges)
  // End background: image_028.png
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-10',
    type: 'drag',
    slideNumber: 10,
    instruction: "Let's add some drops of oil on the edges.",
    backgroundImage: IMG('image_027.png'),
    initialOverlays: [],
    options: [
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') }
    ],
    correctOptionId: 'oil',
    targetArea: { id: 'tawa', label: 'Tawa', image: IMG('image_019.png') },
    dropTargetPos: { top: 35, left: 5, width: 88, height: 55 },
    successTransitionImage: IMG('image_028.png'),
    nextBackgroundImage: IMG('image_028.png'),
    nextOverlays: [],
    dialogues: [
      {
        id: 'd10-mom',
        speaker: 'mom',
        text: "Let's add some drops of oil on the edges.",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 11 : DRAG #4: Flip the dosa
  // Start: Oil added (image_028.png)
  // Drag item: Spatula (Ladle)
  // Success overlay: image_030.png (folded dosa flipped/ready)
  // End background: image_030.png
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-11',
    type: 'drag',
    slideNumber: 11,
    instruction: "It's time to flip the dosa!",
    backgroundImage: IMG('image_028.png'),
    initialOverlays: [],
    options: [
      { id: 'ladle', label: 'Ladle', image: IMG('image_005.png') }
    ],
    correctOptionId: 'ladle',
    targetArea: { id: 'tawa', label: 'Tawa', image: IMG('image_019.png') },
    dropTargetPos: { top: 35, left: 5, width: 88, height: 55 },
    successTransitionImage: IMG('image_030.png'),
    nextBackgroundImage: IMG('image_030.png'),
    nextOverlays: [],
    dialogues: [
      {
        id: 'd11-mom',
        speaker: 'mom',
        text: "It's time to flip the dosa!",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 12 : DRAG #5: Serve on plate
  // Start: Folded dosa ready (image_030.png)
  // Drag item: Plate
  // Success overlay: image_018.png (eating scene - full cover)
  // End background: image_018.png
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-12',
    type: 'drag',
    slideNumber: 12,
    instruction: "Grab a plate before the dosa turns cold!",
    backgroundImage: IMG('image_030.png'),
    initialOverlays: [],
    options: [
      { id: 'plate', label: 'Plate', image: IMG('image_006.png') }
    ],
    correctOptionId: 'plate',
    targetArea: { id: 'tawa', label: 'Tawa', image: IMG('image_019.png') },
    dropTargetPos: { top: 35, left: 5, width: 88, height: 55 },
    successTransitionImage: IMG('image_018.png'),
    nextBackgroundImage: IMG('image_018.png'),
    nextOverlays: [],
    dialogues: [
      {
        id: 'd12-mom',
        speaker: 'mom',
        text: "Grab a plate before the dosa turns cold!",
        position: { top: 4, left: 5 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 13 : Story: Eating the dosa
  // Start: Mom + Kid eating (image_018.png)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-13',
    type: 'story',
    slideNumber: 13,
    image: IMG('image_018.png'),
    dialogues: [
      {
        id: 'd13-kid',
        speaker: 'kid',
        text: "Maa, the dosa is delicious!",
        position: { top: 4, left: 52 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 14 : Section: Practice intro
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-14',
    type: 'story',
    slideNumber: 14,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd14',
        speaker: 'instruction',
        text: "Now let's practice language skills! Complete each activity.",
        position: { top: 28, left: 10 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 15 : Section Intro
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-15',
    type: 'story',
    slideNumber: 15,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd15',
        speaker: 'instruction',
        text: "RECEPTIVE & EXPRESSIVE LANGUAGE : Point to the correct object!",
        position: { top: 28, left: 10 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDES 16–20 : Vocabulary Practice
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-16',
    type: 'vocabulary',
    slideNumber: 16,
    instruction: 'Point to the pan',
    correctOptionId: 'pan',
    options: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') },
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') },
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') },
      { id: 'ladle', label: 'Ladle', image: IMG('image_005.png') },
      { id: 'pan', label: 'Pan / Tawa', image: IMG('image_019.png') },
      { id: 'fridge', label: 'Fridge', image: IMG('image_021.png') }
    ]
  },
  {
    id: 'slide-17',
    type: 'vocabulary',
    slideNumber: 17,
    instruction: 'Point to the plate',
    correctOptionId: 'plate',
    options: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') },
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') },
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') },
      { id: 'plate', label: 'Plate', image: IMG('image_006.png') },
      { id: 'pan', label: 'Pan / Tawa', image: IMG('image_019.png') },
      { id: 'fridge', label: 'Fridge', image: IMG('image_021.png') }
    ]
  },
  {
    id: 'slide-18',
    type: 'vocabulary',
    slideNumber: 18,
    instruction: 'Point to the oil',
    correctOptionId: 'oil',
    options: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') },
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') },
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') },
      { id: 'ladle', label: 'Ladle', image: IMG('image_005.png') },
      { id: 'pan', label: 'Pan / Tawa', image: IMG('image_019.png') },
      { id: 'fridge', label: 'Fridge', image: IMG('image_021.png') }
    ]
  },
  {
    id: 'slide-19',
    type: 'vocabulary',
    slideNumber: 19,
    instruction: 'Point to the batter',
    correctOptionId: 'batter',
    options: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') },
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') },
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') },
      { id: 'ladle', label: 'Ladle', image: IMG('image_005.png') },
      { id: 'pan', label: 'Pan / Tawa', image: IMG('image_019.png') },
      { id: 'fridge', label: 'Fridge', image: IMG('image_021.png') }
    ]
  },
  {
    id: 'slide-20',
    type: 'vocabulary',
    slideNumber: 20,
    instruction: 'Point to the fridge',
    correctOptionId: 'fridge',
    options: [
      { id: 'batter', label: 'Dosa batter', image: IMG('image_002.png') },
      { id: 'masala', label: 'Potato filling', image: IMG('image_003.png') },
      { id: 'oil', label: 'Oil', image: IMG('image_004.png') },
      { id: 'ladle', label: 'Ladle', image: IMG('image_005.png') },
      { id: 'pan', label: 'Pan / Tawa', image: IMG('image_019.png') },
      { id: 'fridge', label: 'Fridge', image: IMG('image_021.png') }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 21 : Object Function Intro
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-21',
    type: 'story',
    slideNumber: 21,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd21',
        speaker: 'instruction',
        text: "OBJECT FUNCTION : What is it? How do we use it?",
        position: { top: 28, left: 10 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDES 22–26 : Object Function Practice
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-22',
    type: 'object-function',
    slideNumber: 22,
    image: IMG('image_019.png'),
    objectName: 'Pan / Tawa',
    questions: [
      {
        questionText: 'What is it?',
        options: [
          { text: 'A Pan / Tawa', isCorrect: true },
          { text: 'A Bowl', isCorrect: false },
          { text: 'A Plate', isCorrect: false }
        ]
      },
      {
        questionText: 'How do we use it?',
        options: [
          { text: 'To heat and cook food', isCorrect: true },
          { text: 'To store food', isCorrect: false },
          { text: 'To clean dishes', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'slide-23',
    type: 'object-function',
    slideNumber: 23,
    image: IMG('image_005.png'),
    objectName: 'Ladle',
    questions: [
      {
        questionText: 'What is it?',
        options: [
          { text: 'A Ladle', isCorrect: true },
          { text: 'A Fork', isCorrect: false },
          { text: 'A Spoon', isCorrect: false }
        ]
      },
      {
        questionText: 'How do we use it?',
        options: [
          { text: 'To scoop and spread batter', isCorrect: true },
          { text: 'To wash dishes', isCorrect: false },
          { text: 'To eat food', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'slide-24',
    type: 'object-function',
    slideNumber: 24,
    image: IMG('image_006.png'),
    objectName: 'Plate',
    questions: [
      {
        questionText: 'What is it?',
        options: [
          { text: 'A Plate', isCorrect: true },
          { text: 'A Pan', isCorrect: false },
          { text: 'A Bowl', isCorrect: false }
        ]
      },
      {
        questionText: 'How do we use it?',
        options: [
          { text: 'To serve and hold food', isCorrect: true },
          { text: 'To cook food', isCorrect: false },
          { text: 'To freeze food', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'slide-25',
    type: 'object-function',
    slideNumber: 25,
    image: IMG('image_020.png'),
    objectName: 'Gas Stove',
    questions: [
      {
        questionText: 'What is it?',
        options: [
          { text: 'A Gas Stove', isCorrect: true },
          { text: 'A Fridge', isCorrect: false },
          { text: 'A Microwave', isCorrect: false }
        ]
      },
      {
        questionText: 'How do we use it?',
        options: [
          { text: 'To heat and cook food', isCorrect: true },
          { text: 'To keep food cold', isCorrect: false },
          { text: 'To store vegetables', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'slide-26',
    type: 'object-function',
    slideNumber: 26,
    image: IMG('image_021.png'),
    objectName: 'Refrigerator',
    questions: [
      {
        questionText: 'What is it?',
        options: [
          { text: 'A Refrigerator', isCorrect: true },
          { text: 'A Washing Machine', isCorrect: false },
          { text: 'A Stove', isCorrect: false }
        ]
      },
      {
        questionText: 'How do we use it?',
        options: [
          { text: 'To keep food cold and fresh', isCorrect: true },
          { text: 'To cook food', isCorrect: false },
          { text: 'To wash vegetables', isCorrect: false }
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 27 : Sentence Building Intro
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-27',
    type: 'story',
    slideNumber: 27,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd27',
        speaker: 'instruction',
        text: "SENTENCE BUILDING : Drag the words in the correct order!",
        position: { top: 28, left: 10 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDES 28–32 : Sentence Building Practice
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-28',
    type: 'sentence',
    slideNumber: 28,
    instruction: 'Drag the words in the correct order to make a sentence.',
    words: ['hands', 'yours', 'Wash', 'first'],
    correctOrder: ['Wash', 'yours', 'hands', 'first']
  },
  {
    id: 'slide-29',
    type: 'sentence',
    slideNumber: 29,
    instruction: 'Drag the words in the correct order to make a sentence.',
    words: ['batter', 'dosa', 'the', 'Take'],
    correctOrder: ['Take', 'the', 'dosa', 'batter']
  },
  {
    id: 'slide-30',
    type: 'sentence',
    slideNumber: 30,
    instruction: 'Drag the words in the correct order to make a sentence.',
    words: ['tawa', 'on', 'batter', 'Pour'],
    correctOrder: ['Pour', 'batter', 'on', 'tawa']
  },
  {
    id: 'slide-31',
    type: 'sentence',
    slideNumber: 31,
    instruction: 'Drag the words in the correct order to make a sentence.',
    words: ['evenly', 'batter', 'Spread', 'the'],
    correctOrder: ['Spread', 'the', 'batter', 'evenly']
  },
  {
    id: 'slide-32',
    type: 'sentence',
    slideNumber: 32,
    instruction: 'Drag the words in the correct order to make a sentence.',
    words: ['now', 'Add', 'oil', 'some'],
    correctOrder: ['Add', 'some', 'oil', 'now']
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 33 : WH Questions Intro
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-33',
    type: 'story',
    slideNumber: 33,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd33',
        speaker: 'instruction',
        text: "WH QUESTIONS : Select the correct answer!",
        position: { top: 28, left: 10 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDES 34–43 : WH Questions Practice
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-34',
    type: 'quiz',
    slideNumber: 34,
    question: 'What did mom cook?',
    options: [
      { id: 'a', text: 'Idli', isCorrect: false },
      { id: 'b', text: 'Dosa', isCorrect: true },
      { id: 'c', text: 'Pav bhaji', isCorrect: false }
    ]
  },
  {
    id: 'slide-35',
    type: 'quiz',
    slideNumber: 35,
    question: 'Where do we spread the batter?',
    options: [
      { id: 'a', text: 'On the plate', isCorrect: false },
      { id: 'b', text: 'On the tawa', isCorrect: true },
      { id: 'c', text: 'On the floor', isCorrect: false }
    ]
  },
  {
    id: 'slide-36',
    type: 'quiz',
    slideNumber: 36,
    question: 'What do we pour on the tawa?',
    options: [
      { id: 'a', text: 'Rice', isCorrect: false },
      { id: 'b', text: 'Juice', isCorrect: false },
      { id: 'c', text: 'Dosa batter', isCorrect: true }
    ]
  },
  {
    id: 'slide-37',
    type: 'quiz',
    slideNumber: 37,
    question: 'What do we add to make the dosa crispy?',
    options: [
      { id: 'a', text: 'Oil', isCorrect: true },
      { id: 'b', text: 'Sugar', isCorrect: false },
      { id: 'c', text: 'Chocolate', isCorrect: false }
    ]
  },
  {
    id: 'slide-38',
    type: 'quiz',
    slideNumber: 38,
    question: 'What do we spread inside the dosa?',
    options: [
      { id: 'a', text: 'Jam', isCorrect: false },
      { id: 'b', text: 'Potato masala', isCorrect: true },
      { id: 'c', text: 'Ice cream', isCorrect: false }
    ]
  },
  {
    id: 'slide-39',
    type: 'quiz',
    slideNumber: 39,
    question: 'Why do we flip the dosa?',
    options: [
      { id: 'a', text: 'To wash it', isCorrect: false },
      { id: 'b', text: 'To cool it', isCorrect: false },
      { id: 'c', text: 'To cook the other side', isCorrect: true }
    ]
  },
  {
    id: 'slide-40',
    type: 'quiz',
    slideNumber: 40,
    question: 'When do we fold the dosa?',
    options: [
      { id: 'a', text: 'After it is cooked', isCorrect: true },
      { id: 'b', text: 'Before heating the tawa', isCorrect: false },
      { id: 'c', text: 'Before pouring the batter', isCorrect: false }
    ]
  },
  {
    id: 'slide-41',
    type: 'quiz',
    slideNumber: 41,
    question: 'What do we use to spread the batter?',
    options: [
      { id: 'a', text: 'A knife', isCorrect: false },
      { id: 'b', text: 'A ladle', isCorrect: true },
      { id: 'c', text: 'A fork', isCorrect: false }
    ]
  },
  {
    id: 'slide-42',
    type: 'quiz',
    slideNumber: 42,
    question: 'What do we eat the dosa with?',
    options: [
      { id: 'a', text: 'Mayonnaise', isCorrect: false },
      { id: 'b', text: 'Ketchup', isCorrect: false },
      { id: 'c', text: 'Chutney', isCorrect: true }
    ]
  },
  {
    id: 'slide-43',
    type: 'quiz',
    slideNumber: 43,
    question: 'How does a well-cooked dosa look?',
    options: [
      { id: 'a', text: 'Purple', isCorrect: false },
      { id: 'b', text: 'Golden brown', isCorrect: true },
      { id: 'c', text: 'Blue', isCorrect: false }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 44 : Sequencing Intro
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-44',
    type: 'story',
    slideNumber: 44,
    image: IMG('image_001.png'),
    dialogues: [
      {
        id: 'd44',
        speaker: 'instruction',
        text: "SEQUENCING : Drag the images in the correct order!",
        position: { top: 28, left: 10 },
        tailDirection: 'down'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 45 : Sequencing Practice
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-45',
    type: 'sequence',
    slideNumber: 45,
    instruction: 'Drag the images in the correct order to complete the sequence.',
    items: [
      { id: 'seq-1', image: IMG('image_010.png'), label: 'Pour batter', order: 0 },
      { id: 'seq-2', image: IMG('image_012.png'), label: 'Spread batter', order: 1 },
      { id: 'seq-3', image: IMG('image_014.png'), label: 'Add potato masala', order: 2 },
      { id: 'seq-4', image: IMG('image_017.png'), label: 'Fold and serve', order: 3 }
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDES 46–49 : Celebration images
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-46',
    type: 'story',
    slideNumber: 46,
    image: IMG('image_022.png'),
    dialogues: []
  },
  {
    id: 'slide-47',
    type: 'story',
    slideNumber: 47,
    image: IMG('image_023.png'),
    dialogues: []
  },
  {
    id: 'slide-48',
    type: 'story',
    slideNumber: 48,
    image: IMG('image_024.png'),
    dialogues: []
  },
  {
    id: 'slide-49',
    type: 'story',
    slideNumber: 49,
    image: IMG('image_025.png'),
    dialogues: []
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 50 : Completion
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'slide-50',
    type: 'completion',
    slideNumber: 50,
    title: 'Dosa Master Chef! 🍽️',
    subtitle: 'Amazing job! You made a delicious masala dosa and completed all the language activities!'
  }
];
