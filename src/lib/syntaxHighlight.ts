import type { CodeLanguage, TokenType } from '@/types/typing';

export interface TokenChar {
  char: string;
  tokenType: TokenType;
}

/* ─── Keyword sets ───────────────────────────────────────── */
const PYTHON_KEYWORDS = new Set([
  'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return',
  'import', 'from', 'in', 'not', 'and', 'or', 'True', 'False', 'None',
  'try', 'except', 'with', 'as', 'lambda', 'pass', 'break', 'continue',
  'yield', 'del', 'raise', 'assert', 'global', 'nonlocal', 'is', 'self',
]);

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'class', 'import', 'export', 'from',
  'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
  'continue', 'typeof', 'instanceof', 'new', 'this', 'null', 'undefined',
  'true', 'false', 'default', 'try', 'catch', 'finally', 'throw', 'async',
  'await', 'of', 'in', 'delete', 'void',
]);

const BUILTIN_TYPES = new Set([
  'int', 'str', 'float', 'bool', 'list', 'dict', 'tuple', 'set', 'type',
  'Array', 'String', 'Number', 'Boolean', 'Object', 'Promise',
]);

/* ─── Single-line tokenizer ──────────────────────────────── */
function tokenizeLine(
  line: string,
  lang: CodeLanguage,
  inStr: { active: boolean; quote: string },
): TokenChar[] {
  const out: TokenChar[] = [];
  let i = 0;
  const isJS = lang === 'react' || lang === 'django';

  while (i < line.length) {
    const ch = line[i];
    const rest = line.slice(i);

    /* ── Comment (must check before string so # inside string isn't confused) */
    if (!inStr.active) {
      if (lang === 'python' && ch === '#') {
        while (i < line.length) {
          out.push({ char: line[i], tokenType: 'comment' });
          i++;
        }
        continue;
      }
      if (isJS && rest.startsWith('//')) {
        while (i < line.length) {
          out.push({ char: line[i], tokenType: 'comment' });
          i++;
        }
        continue;
      }
    }

    /* ── String open ── */
    if (!inStr.active && (ch === "'" || ch === '"' || ch === '`')) {
      inStr.active = true;
      inStr.quote = ch;
      out.push({ char: ch, tokenType: 'string' });
      i++;
      continue;
    }

    /* ── Inside string ── */
    if (inStr.active) {
      out.push({ char: ch, tokenType: 'string' });
      if (ch === inStr.quote) inStr.active = false;
      i++;
      continue;
    }

    /* ── Number (not inside identifier) ── */
    if (/\d/.test(ch) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
      while (i < line.length && /[\d.]/.test(line[i])) {
        out.push({ char: line[i], tokenType: 'number' });
        i++;
      }
      continue;
    }

    /* ── Identifier / keyword / function / type ── */
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        ident += line[i];
        i++;
      }
      const keywords = lang === 'python' ? PYTHON_KEYWORDS : JS_KEYWORDS;
      let tt: TokenType;
      if (keywords.has(ident)) {
        tt = 'keyword';
      } else if (BUILTIN_TYPES.has(ident)) {
        tt = 'type';
      } else if (line[i] === '(') {
        tt = 'function';
      } else if (/^[A-Z]/.test(ident)) {
        tt = 'type';
      } else {
        tt = 'plain';
      }
      for (const c of ident) out.push({ char: c, tokenType: tt });
      continue;
    }

    /* ── JSX tag < ── */
    if (lang === 'react' && ch === '<') {
      const m = rest.match(/^<\/?[A-Za-z][A-Za-z0-9]*/);
      if (m) {
        for (const c of m[0]) out.push({ char: c, tokenType: 'tag' });
        i += m[0].length;
        continue;
      }
    }

    /* ── Brackets ── */
    if (/[(){}[\]]/.test(ch)) {
      out.push({ char: ch, tokenType: 'bracket' });
      i++;
      continue;
    }

    /* ── Operators ── */
    if (/[+\-*/%=<>!&|^~?]/.test(ch)) {
      out.push({ char: ch, tokenType: 'operator' });
      i++;
      continue;
    }

    /* ── Default (space, comma, dot, colon, semicolon, etc.) ── */
    out.push({ char: ch, tokenType: 'plain' });
    i++;
  }

  return out;
}

/* ─── Full code tokenizer (handles multi-line) ───────────── */
export function tokenize(code: string, lang: CodeLanguage): TokenChar[] {
  const lines = code.split('\n');
  const out: TokenChar[] = [];
  const inStr = { active: false, quote: '' };

  for (let li = 0; li < lines.length; li++) {
    out.push(...tokenizeLine(lines[li], lang, inStr));
    if (li < lines.length - 1) {
      out.push({ char: '\n', tokenType: 'plain' });
    }
  }
  return out;
}
