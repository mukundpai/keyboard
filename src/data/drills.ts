export type DrillDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type DrillGroup =
  | 'foundation'
  | 'finger-isolation'
  | 'speed-building'
  | 'coding'
  | 'endurance';

export interface DrillDef {
  id: string;
  title: string;
  description: string;
  category: 'drill' | 'task';
  group: DrillGroup;
  difficulty: DrillDifficulty;
  content: string; // The exact text to type
  metric?: string;
  tip?: string; // Technique tip shown on the drill page
}

export const DIFFICULTY_LABEL: Record<DrillDifficulty, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

export const DIFFICULTY_COLOR: Record<DrillDifficulty, string> = {
  beginner:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  intermediate: 'text-amber-400  bg-amber-400/10  border-amber-400/20',
  advanced:     'text-rose-400   bg-rose-400/10   border-rose-400/20',
};
// ─── GROUP METADATA ────────────────────────────────────────────────────────────
export const DRILL_GROUPS: Record<DrillGroup, { label: string; description: string }> = {
  foundation: {
    label: 'Foundation',
    description: 'Build muscle memory row by row before combining them.',
  },
  'finger-isolation': {
    label: 'Finger Isolation',
    description: 'Strengthen each finger independently for balanced dexterity.',
  },
  'speed-building': {
    label: 'Speed Building',
    description: 'Common words and bigrams that unlock your natural rhythm.',
  },
  coding: {
    label: 'Coding & Symbols',
    description: 'Punctuation, operators, and identifiers used in everyday code.',
  },
  endurance: {
    label: 'Endurance Tasks',
    description: 'Longer runs that test sustained speed, accuracy, or both.',
  },
};

// ─── DRILLS ────────────────────────────────────────────────────────────────────
export const DRILLS: Record<string, DrillDef> = {

  // ── FOUNDATION ──────────────────────────────────────────────────────────────
  'home-row': {
    id: 'home-row',
    title: 'Home Row Mastery',
    description: 'ASDF · JKL; — the anchor of every keystroke. Keep fingers resting here.',
    category: 'drill',
    group: 'foundation',
    difficulty: 'beginner',
    tip: 'Your index fingers should always rest on F and J (the bumped keys). Never lift both hands simultaneously.',
    content:
      'asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; fdsa ;lkj ' +
      'ask fall jab glad flask hall lads skill jaff slab flask ' +
      'all ask had lad fall dads glad flask skill shall',
  },

  'top-row': {
    id: 'top-row',
    title: 'Top Row Reach',
    description: 'Reach up to QWERTYUIOP without glancing at the board.',
    category: 'drill',
    group: 'foundation',
    difficulty: 'beginner',
    tip: 'Curl fingers slightly and reach up — do not slide your hand. Return to home row after every keystroke.',
    content:
      'qwer uiop qwer uiop rewq poiu rewq poiu ' +
      'type write quiet worry equip tower power your prior ' +
      'riot pour quirk quote tower wire rope riot',
  },

  'bottom-row': {
    id: 'bottom-row',
    title: 'Bottom Row Agility',
    description: 'Tackle the trickier ZXCV and M,./ keys with confidence.',
    category: 'drill',
    group: 'foundation',
    difficulty: 'beginner',
    tip: 'The bottom row requires a slight curl downward. Keep wrists neutral and avoid bending them.',
    content:
      'zxcv m,./ zxcv m,./ vcxz /.,m vcxz /.,m ' +
      'mix calm zone vibe exam cozy zinc blame ' +
      'calm mix zone vibe exam cozy zinc blame calm',
  },

  'all-rows': {
    id: 'all-rows',
    title: 'Full Keyboard Flow',
    description: 'Combine all three rows into smooth, connected prose.',
    category: 'drill',
    group: 'foundation',
    difficulty: 'intermediate',
    tip: 'Focus on returning to home row between reaches. Smooth beats fast at this stage.',
    content:
      'the five boxing wizards jump quickly. ' +
      'pack my box with five dozen liquor jugs. ' +
      'how vexingly quick daft zebras jump. ' +
      'the job requires extra pluck and zeal from every young wage earner.',
  },

  // ── FINGER ISOLATION ────────────────────────────────────────────────────────
  'index-fingers': {
    id: 'index-fingers',
    title: 'Index Fingers',
    description: 'F · J and all their reaches: G H R U T Y V B N M.',
    category: 'drill',
    group: 'finger-isolation',
    difficulty: 'beginner',
    tip: 'Index fingers are your workhorses — they cover 6 columns. Keep the anchor on F and J and stretch sideways.',
    content:
      'fj fg jh ft ju fr jy fv jm fb jn fg jh fr ju ' +
      'tug hug rug fun run gun nut but jet yet get ' +
      'numb thumb verb hymn myth rhythm grunt front',
  },

  'middle-fingers': {
    id: 'middle-fingers',
    title: 'Middle Fingers',
    description: 'D · K — precise vertical movement between three rows.',
    category: 'drill',
    group: 'finger-isolation',
    difficulty: 'beginner',
    tip: 'Middle fingers handle D, E, C on the left and K, I, , on the right. Focus on clean vertical movement.',
    content:
      'd k dk ek ik dc k, de ki dc k, ' +
      'deck kick dice kite cord silk ' +
      'click creek decode medic decide clocked',
  },

  'ring-fingers': {
    id: 'ring-fingers',
    title: 'Ring Fingers',
    description: 'S · L — the often-neglected fingers. Build their independence.',
    category: 'drill',
    group: 'finger-isolation',
    difficulty: 'beginner',
    tip: 'Ring fingers control S, W, X (left) and L, O, . (right). Isolate them — do not let adjacent fingers drift.',
    content:
      's l sl sw lo sx l. sw lo sx l. ' +
      'slow loss will oil loss well soul ' +
      'fossil scroll lawful allows polls',
  },

  'pinky-fingers': {
    id: 'pinky-fingers',
    title: 'Pinky Fingers',
    description: 'A · ; and the outer column stretches: Q, Z, P, /.',
    category: 'drill',
    group: 'finger-isolation',
    difficulty: 'intermediate',
    tip: 'Pinkies are the weakest. Never over-extend — keep the movement crisp and short. Avoid curling or twisting the wrist.',
    content:
      'a ; aq ;p az ;/ aq ;p az ;/ ' +
      'aqua zap plaza spa pal zip zeal ' +
      'plaza squeeze zealous qualify alias',
  },

  'left-hand-only': {
    id: 'left-hand-only',
    title: 'Left Hand Isolation',
    description: 'Train the left hand alone — great for building weak-hand confidence.',
    category: 'drill',
    group: 'finger-isolation',
    difficulty: 'intermediate',
    tip: 'Right hand rests. Focus entirely on clean left-hand movement without compensation.',
    content:
      'as we are rave vast gear star cast fare ' +
      'based after trade great stare greet ' +
      'creates fastest greater staged',
  },

  'right-hand-only': {
    id: 'right-hand-only',
    title: 'Right Hand Isolation',
    description: 'Train the right hand alone — reinforce the weaker side for most typists.',
    category: 'drill',
    group: 'finger-isolation',
    difficulty: 'intermediate',
    tip: 'Left hand rests. Keep all movement on the right side of the board. Return to JKL; after every word.',
    content:
      'in on up oil him pin link loin moon ' +
      'opinion minimum union million ' +
      'opinion polo lion loin union million',
  },

  // ── SPEED BUILDING ──────────────────────────────────────────────────────────
  'common-bigrams': {
    id: 'common-bigrams',
    title: 'Common Bigrams',
    description: 'The 20 most frequent letter pairs in English — type them until they feel automatic.',
    category: 'drill',
    group: 'speed-building',
    difficulty: 'beginner',
    tip: 'Bigrams are the atoms of typing speed. When your fingers learn the pairs, words become automatic.',
    content:
      'th he in er an re on en at nd st es te ed ' +
      'or ti hi as to is il ou be ar le sa ve of ' +
      'the and that have this with they from which',
  },

  'common-trigrams': {
    id: 'common-trigrams',
    title: 'Common Trigrams',
    description: 'The most frequent three-letter sequences — the building blocks of fluent prose.',
    category: 'drill',
    group: 'speed-building',
    difficulty: 'beginner',
    tip: 'Trigrams start to feel like whole words. Let muscle memory chain them together.',
    content:
      'the and ing ion tio ent for ati her ter ' +
      'hat his was not all are but had our one ' +
      'their there which about would could should',
  },

  'top-100-words': {
    id: 'top-100-words',
    title: 'Top 100 English Words',
    description: 'The most common words make up 50% of all text. Master them for a huge speed boost.',
    category: 'drill',
    group: 'speed-building',
    difficulty: 'beginner',
    tip: 'Do not spell individual letters — think in whole words. Let your hands remember the shape.',
    content:
      'the be to of and a in that have it for not on with he as you do at ' +
      'this but his by from they we say her she or an will my one all would there their what ' +
      'so up out if about who get which go me when make can like time no just him know take people',
  },

  'word-rhythm': {
    id: 'word-rhythm',
    title: 'Rhythm Typing',
    description: 'Evenly-spaced short words to train a consistent keystroke cadence.',
    category: 'drill',
    group: 'speed-building',
    difficulty: 'intermediate',
    tip: 'Aim for a metronome-like rhythm. Every keystroke should arrive at the same interval — no bursts, no pauses.',
    content:
      'did fit him hit its lot men net off put run sat sit six tax ten try use way win yet ' +
      'back bold call dark even from gold help just keep left long make name once open play ' +
      'read real said show side some tell than then time turn well went wide',
  },

  'alternate-hands': {
    id: 'alternate-hands',
    title: 'Hand Alternation',
    description: 'Words that naturally alternate left and right hands — the fastest typing pattern.',
    category: 'drill',
    group: 'speed-building',
    difficulty: 'intermediate',
    tip: 'When hands alternate, each has time to prepare the next keystroke. These words should feel effortless.',
    content:
      'the to if he did so when then with also such both land form work hand turn down held ' +
      'rush fuel snap clan than snap when profit',
  },

  'shift-caps': {
    id: 'shift-caps',
    title: 'Capitalization & Shift',
    description: 'Use the opposite-hand shift for every capital. No exceptions.',
    category: 'drill',
    group: 'speed-building',
    difficulty: 'intermediate',
    tip: 'Left-shift for right-hand letters (J, K, L, U, I, O…). Right-shift for left-hand letters (A, S, D, F, W…). Never same-hand shift.',
    content:
      'Hello World My Name Is Alex. ' +
      'New York London Paris Tokyo Berlin. ' +
      'JavaScript TypeScript React Next Vue. ' +
      'Monday Tuesday Wednesday Thursday Friday.',
  },

  // ── CODING & SYMBOLS ────────────────────────────────────────────────────────
  'symbol-precision': {
    id: 'symbol-precision',
    title: 'Symbol Precision',
    description: 'Brackets, slashes, and operators used constantly in code.',
    category: 'drill',
    group: 'coding',
    difficulty: 'intermediate',
    tip: 'Use shift without looking. Develop a feel for the shift-reach combination.',
    content: '() {} [] <> () {} [] <> // \\\\ || && != == => -> :: ?? %% ** ++ -- && || () {}',
  },

  'number-row': {
    id: 'number-row',
    title: 'Number Row',
    description: 'Reach to the number row without drifting the home position.',
    category: 'drill',
    group: 'coding',
    difficulty: 'intermediate',
    tip: 'Numbers sit above the top letter row. Reach — do not lift — and snap back to home row immediately.',
    content:
      '1 2 3 4 5 6 7 8 9 0 ' +
      '12 23 34 45 56 67 78 89 90 ' +
      '123 456 789 012 321 654 987 ' +
      '1024 2048 4096 8192 1337 9001',
  },

  'numpad-speed': {
    id: 'numpad-speed',
    title: 'Numpad Speed',
    description: 'Right-hand ten-key data entry with the numpad.',
    category: 'drill',
    group: 'coding',
    difficulty: 'intermediate',
    tip: '5 is the anchor key on the numpad (has a bump). Keep your index on 5 and work outward.',
    content: '147 258 369 147 258 369 741 852 963 741 852 963 123 456 789 987 654 321',
  },

  'coding-operators': {
    id: 'coding-operators',
    title: 'Coding Operators',
    description: 'Arithmetic, comparison, and logical operators used in every language.',
    category: 'drill',
    group: 'coding',
    difficulty: 'intermediate',
    tip: 'Focus on smooth shift-key transitions. The symbols !, @, #, $ all need clean right-hand shift.',
    content:
      '+ - * / % = == != < > <= >= && || ! ~ ^ & | ' +
      'a + b == c - d && e * f != g / h ' +
      'x >= 0 ? x : -x',
  },

  'camelcase-ids': {
    id: 'camelcase-ids',
    title: 'camelCase Identifiers',
    description: 'JavaScript / TypeScript-style variable and function names.',
    category: 'drill',
    group: 'coding',
    difficulty: 'intermediate',
    tip: 'Each capital after a lowercase letter is a shift burst. Use opposite-hand shift and keep rhythm.',
    content:
      'getUserName setActiveTab fetchData handleClick ' +
      'isLoading hasError currentUser defaultValue ' +
      'onMouseEnter onKeyDown useEffect useState useRef ' +
      'createServer parseResponse validateInput formatDate',
  },

  'css-properties': {
    id: 'css-properties',
    title: 'CSS Properties',
    description: 'Hyphenated property names from everyday CSS and Tailwind.',
    category: 'drill',
    group: 'coding',
    difficulty: 'intermediate',
    tip: 'Hyphens sit on the right side of the keyboard, struck with the right pinky. Keep it short and sharp.',
    content:
      'background-color border-radius font-size ' +
      'flex-direction justify-content align-items ' +
      'max-width min-height margin-top padding-left ' +
      'text-transform letter-spacing line-height',
  },

  'html-tags': {
    id: 'html-tags',
    title: 'HTML Tags & JSX',
    description: 'Practice the angle-bracket heavy syntax of HTML and JSX.',
    category: 'drill',
    group: 'coding',
    difficulty: 'advanced',
    tip: 'Angle brackets < and > need left-shift and right-shift respectively. Plan the shift ahead of the key.',
    content:
      '<div> <span> <p> <a> <ul> <li> </div> </span> </p> ' +
      '<button onClick={handleClick}> ' +
      '<input type="text" value={name} onChange={setName} /> ' +
      '<img src={url} alt="description" className="rounded-lg" />',
  },

  // ── ENDURANCE TASKS ─────────────────────────────────────────────────────────
  '100-wpm-sprint': {
    id: '100-wpm-sprint',
    title: 'The 100 WPM Sprint',
    description: 'A short burst test. The only goal is raw speed — errors are counted but do not block you.',
    category: 'task',
    group: 'endurance',
    difficulty: 'advanced',
    metric: '15 Seconds',
    tip: 'Push beyond your comfort zone. Sprint tests reveal your peak ceiling, not your average.',
    content:
      'the quick brown fox jumps over the lazy dog and the five boxing wizards jump quickly ' +
      'pack my box with five dozen liquor jugs how vexingly quick daft zebras jump ' +
      'the job requires extra pluck and zeal from every young wage earner',
  },

  'perfect-accuracy': {
    id: 'perfect-accuracy',
    title: 'Perfect Accuracy Marathon',
    description: 'Type the full passage without a single wrong keystroke. Slow down if you must.',
    category: 'task',
    group: 'endurance',
    difficulty: 'advanced',
    metric: '200 Words',
    tip: 'Slow is smooth. Smooth is fast. Any error here is a failure of preparation, not speed.',
    content:
      'precision is the difference between a butcher and a surgeon. ' +
      'when typing, accuracy must always precede speed. ' +
      'slow is smooth, and smooth is fast. ' +
      'build the correct pathways in your mind and the speed will naturally follow without conscious effort. ' +
      'the typist who never makes mistakes moves slower at first but accelerates without a ceiling. ' +
      'every backspace is a broken rhythm, every correction a tax on momentum. ' +
      'train yourself to see the next word before your fingers finish the current one. ' +
      'that anticipation is the secret weapon of every professional typist.',
  },

  'code-endurance': {
    id: 'code-endurance',
    title: 'Code Endurance Run',
    description: 'Real-world code snippets with symbols, operators, and identifiers back to back.',
    category: 'task',
    group: 'endurance',
    difficulty: 'advanced',
    metric: 'Full Passage',
    tip: 'Coding text is 30% slower than prose for most people. Stay calm when symbols appear.',
    content:
      'function debounce(fn, delay) { ' +
      'let timer = null; ' +
      'return function(...args) { ' +
      'clearTimeout(timer); ' +
      'timer = setTimeout(() => fn.apply(this, args), delay); ' +
      '}; ' +
      '} ' +
      'const result = items.filter(x => x.active).map(x => x.value).reduce((a, b) => a + b, 0);',
  },

  'no-look-challenge': {
    id: 'no-look-challenge',
    title: 'No-Look Challenge',
    description: 'A variety of tricky words. Cover your hands and never peek at the keyboard.',
    category: 'task',
    group: 'endurance',
    difficulty: 'advanced',
    metric: 'Eyes Up',
    tip: 'Place a cloth over your hands. Your fingers already know where to go — trust the muscle memory.',
    content:
      'rhythm vacuum syringe pneumonia psychology mnemonic ' +
      'acknowledge conscientious surveillance bureaucracy ' +
      'questionnaire exaggerate maneuver necessary occurrence ' +
      'privilege recommend separate supersede threshold',
  },
};
