/* ─────────────────────────────────────────────────────────────── *
 *  ~500 of the most common English words, curated for typing tests.
 *  Excludes single-letter words and very rare/archaic words.
 * ─────────────────────────────────────────────────────────────── */
const WORD_POOL = [
  'the', 'be', 'of', 'and', 'to', 'in', 'that', 'have', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'from',
  'or', 'but', 'his', 'by', 'they', 'we', 'say', 'her', 'she', 'all',
  'will', 'there', 'their', 'what', 'up', 'out', 'if', 'about', 'who',
  'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
  'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
  'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after',
  'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'often', 'hand', 'high', 'place',
  'hold', 'turn', 'help', 'world', 'try', 'call', 'point', 'play', 'small',
  'number', 'off', 'always', 'move', 'show', 'every', 'good', 'feel',
  'next', 'home', 'sure', 'open', 'seem', 'together', 'start', 'three',
  'white', 'children', 'begin', 'got', 'walk', 'those', 'set', 'both',
  'old', 'another', 'eye', 'still', 'light', 'land', 'enough', 'run',
  'watch', 'right', 'hear', 'side', 'face', 'keep', 'year', 'own',
  'long', 'life', 'few', 'north', 'each', 'leave', 'cut', 'really',
  'name', 'near', 'order', 'line', 'simple', 'learn', 'around', 'here',
  'plant', 'cover', 'stand', 'draw', 'form', 'below', 'story', 'since',
  'much', 'city', 'area', 'animal', 'food', 'mile', 'true', 'often',
  'close', 'mean', 'body', 'music', 'color', 'road', 'map', 'rain',
  'rule', 'cold', 'push', 'floor', 'front', 'river', 'book', 'drive',
  'above', 'clear', 'care', 'send', 'class', 'happen', 'power', 'town',
  'fine', 'drive', 'deep', 'plan', 'both', 'across', 'rock', 'build',
  'count', 'earth', 'heart', 'grow', 'tree', 'stone', 'water', 'fire',
  'while', 'voice', 'break', 'those', 'round', 'under', 'live', 'rest',
  'bird', 'bring', 'short', 'word', 'write', 'read', 'mind', 'stay',
  'stop', 'change', 'again', 'ready', 'idea', 'fish', 'sleep', 'throw',
  'catch', 'letter', 'tell', 'left', 'found', 'carry', 'sit', 'fall',
  'laugh', 'smile', 'though', 'thought', 'friend', 'follow', 'came',
  'done', 'never', 'best', 'free', 'wide', 'kind', 'gave', 'strong',
  'thing', 'second', 'table', 'paper', 'group', 'often', 'until',
  'question', 'answer', 'better', 'enough', 'along', 'early', 'picture',
  'example', 'become', 'through', 'before', 'family', 'later', 'during',
  'school', 'where', 'young', 'whole', 'human', 'never', 'piece', 'such',
  'state', 'watch', 'system', 'fact', 'local', 'force', 'base', 'level',
  'month', 'being', 'night', 'real', 'within', 'quite', 'sense', 'sound',
  'social', 'major', 'special', 'happen', 'result', 'during', 'using',
  'common', 'action', 'return', 'against', 'today', 'speak', 'bring',
  'already', 'given', 'create', 'whether', 'likely', 'inside', 'outside',
  'almost', 'across', 'little', 'program', 'problem', 'notice', 'reason',
  'moment', 'player', 'market', 'number', 'happen', 'report', 'nation',
  'public', 'office', 'season', 'ground', 'window', 'nature', 'please',
  'future', 'design', 'manage', 'charge', 'energy', 'figure', 'minute',
  'choice', 'expect', 'happen', 'street', 'demand', 'support', 'consider',
  'appear', 'product', 'project', 'network', 'provide', 'develop', 'center',
  'contain', 'current', 'pattern', 'process', 'success', 'require', 'beyond',
  'without', 'instead', 'several', 'achieve', 'between', 'control', 'connect',
  'reflect', 'explain', 'similar', 'purpose', 'perfect', 'natural', 'service',
  'measure', 'include', 'nothing', 'history', 'quality', 'compare', 'surface',
  'picture', 'freedom', 'practice', 'increase', 'language', 'movement',
  'position', 'remember', 'complete', 'possible', 'continue', 'specific',
  'function', 'personal', 'physical', 'together', 'evidence', 'previous',
  'distance', 'anything', 'security', 'standard', 'approach', 'describe',
];

/** Fisher-Yates shuffle (in-place) */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Generate a space-separated word string of the requested length */
export function generateWords(count: number): string {
  const pool = shuffle([...WORD_POOL]);
  const words: string[] = [];
  while (words.length < count) {
    words.push(...pool.slice(0, Math.min(pool.length, count - words.length)));
    shuffle(pool);
  }
  return words.slice(0, count).join(' ');
}
