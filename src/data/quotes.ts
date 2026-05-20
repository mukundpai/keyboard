export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags: string[];
}

export const QUOTES: Quote[] = [
  {
    id: 'q1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    tags: ['motivation', 'short'],
  },
  {
    id: 'q2',
    text: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
    tags: ['motivation', 'short'],
  },
  {
    id: 'q3',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    tags: ['motivation', 'short'],
  },
  {
    id: 'q4',
    text: 'Life is what happens to you while you are busy making other plans.',
    author: 'John Lennon',
    tags: ['life', 'short'],
  },
  {
    id: 'q5',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    tags: ['motivation', 'short'],
  },
  {
    id: 'q6',
    text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.',
    author: 'Mother Teresa',
    tags: ['life', 'medium'],
  },
  {
    id: 'q7',
    text: "When you reach the end of your rope, tie a knot in it and hang on.",
    author: 'Franklin D. Roosevelt',
    tags: ['motivation', 'medium'],
  },
  {
    id: 'q8',
    text: 'Always remember that you are absolutely unique. Just like everyone else.',
    author: 'Margaret Mead',
    tags: ['life', 'medium'],
  },
  {
    id: 'q9',
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: 'Ralph Waldo Emerson',
    tags: ['motivation', 'medium'],
  },
  {
    id: 'q10',
    text: "You will face many defeats in life, but never let yourself be defeated.",
    author: 'Maya Angelou',
    tags: ['resilience', 'medium'],
  },
  {
    id: 'q11',
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: 'Nelson Mandela',
    tags: ['resilience', 'medium'],
  },
  {
    id: 'q12',
    text: "In the end, it is not the years in your life that count. It is the life in your years.",
    author: 'Abraham Lincoln',
    tags: ['life', 'medium'],
  },
  {
    id: 'q13',
    text: "Never let the fear of striking out keep you from playing the game.",
    author: 'Babe Ruth',
    tags: ['courage', 'short'],
  },
  {
    id: 'q14',
    text: "Life is either a daring adventure or nothing at all.",
    author: 'Helen Keller',
    tags: ['adventure', 'short'],
  },
  {
    id: 'q15',
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: 'Thomas A. Edison',
    tags: ['motivation', 'medium'],
  },
  {
    id: 'q16',
    text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
    author: 'Dr. Seuss',
    tags: ['motivation', 'medium'],
  },
  {
    id: 'q17',
    text: "If life were predictable it would cease to be life, and be without flavor.",
    author: 'Eleanor Roosevelt',
    tags: ['life', 'short'],
  },
  {
    id: 'q18',
    text: "If you look at what you have in life, you will always have more. If you look at what you do not have in life, you will never have enough.",
    author: 'Oprah Winfrey',
    tags: ['gratitude', 'long'],
  },
  {
    id: 'q19',
    text: "If you want to live a happy life, tie it to a goal, not to people or things.",
    author: 'Albert Einstein',
    tags: ['happiness', 'medium'],
  },
  {
    id: 'q20',
    text: "Never let the fear of striking out keep you from playing the game.",
    author: 'Babe Ruth',
    tags: ['courage', 'short'],
  },
  {
    id: 'q21',
    text: "First, solve the problem. Then, write the code.",
    author: 'John Johnson',
    tags: ['coding', 'short'],
  },
  {
    id: 'q22',
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: 'Martin Fowler',
    tags: ['coding', 'medium'],
  },
  {
    id: 'q23',
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: 'Harold Abelson',
    tags: ['coding', 'medium'],
  },
  {
    id: 'q24',
    text: "The best error message is the one that never shows up.",
    author: 'Thomas Fuchs',
    tags: ['coding', 'short'],
  },
  {
    id: 'q25',
    text: "Code is like humor. When you have to explain it, it is bad.",
    author: 'Cory House',
    tags: ['coding', 'short'],
  },
  {
    id: 'q26',
    text: "Simplicity is the soul of efficiency.",
    author: 'Austin Freeman',
    tags: ['coding', 'short'],
  },
  {
    id: 'q27',
    text: "Before software can be reusable it first has to be usable.",
    author: 'Ralph Johnson',
    tags: ['coding', 'short'],
  },
  {
    id: 'q28',
    text: "Make it work, make it right, make it fast.",
    author: 'Kent Beck',
    tags: ['coding', 'short'],
  },
  {
    id: 'q29',
    text: "The most dangerous phrase in the language is we have always done it this way.",
    author: 'Grace Hopper',
    tags: ['innovation', 'medium'],
  },
  {
    id: 'q30',
    text: "Walking on water and developing software from a specification are easy if both are frozen.",
    author: 'Edward V. Berard',
    tags: ['coding', 'medium'],
  },
  {
    id: 'q31',
    text: "It is not enough to be busy. So are the ants. The question is what are we busy about.",
    author: 'Henry David Thoreau',
    tags: ['focus', 'medium'],
  },
  {
    id: 'q32',
    text: "Excellence is not a destination but a continuous journey that never ends.",
    author: 'Brian Tracy',
    tags: ['excellence', 'short'],
  },
  {
    id: 'q33',
    text: "The secret of getting ahead is getting started.",
    author: 'Mark Twain',
    tags: ['motivation', 'short'],
  },
  {
    id: 'q34',
    text: "An investment in knowledge pays the best interest.",
    author: 'Benjamin Franklin',
    tags: ['knowledge', 'short'],
  },
  {
    id: 'q35',
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: 'Plutarch',
    tags: ['learning', 'short'],
  },
];

export function getRandomQuote(tags?: string[]): Quote {
  const pool = tags?.length
    ? QUOTES.filter(q => q.tags.some(t => tags.includes(t)))
    : QUOTES;
  const source = pool.length ? pool : QUOTES;
  return source[Math.floor(Math.random() * source.length)];
}

export function getDailyQuote(): Quote {
  // Deterministic: same quote all day, rotates daily
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return QUOTES[dayIndex % QUOTES.length];
}
