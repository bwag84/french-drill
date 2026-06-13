// SM-2 Spaced Repetition System
// Based on SuperMemo SM-2 algorithm

export interface CardRecord {
  id: string;
  interval: number;      // days until next review
  repetitions: number;   // number of successful reviews
  easeFactor: number;    // difficulty multiplier (min 1.3)
  nextReview: number;    // timestamp (ms) of next due date
  lastReview: number;    // timestamp of last review
  totalReviews: number;
  correctStreak: number;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout
// 1 = wrong, remembered after seeing answer
// 2 = wrong, easy to recall once seen
// 3 = correct, hard
// 4 = correct, minor hesitation
// 5 = perfect, instant recall

const STORAGE_KEY = 'french-drill-srs';
const CUSTOM_CARDS_KEY = 'french-drill-custom';

function now(): number {
  return Date.now();
}

function daysFromNow(days: number): number {
  return now() + days * 24 * 60 * 60 * 1000;
}

export function loadRecords(): Record<string, CardRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRecords(records: Record<string, CardRecord>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getRecord(id: string): CardRecord {
  const records = loadRecords();
  return records[id] ?? newRecord(id);
}

function newRecord(id: string): CardRecord {
  return {
    id,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: 0,   // 0 = new / due now
    lastReview: 0,
    totalReviews: 0,
    correctStreak: 0,
  };
}

export function updateRecord(id: string, quality: Quality): CardRecord {
  const records = loadRecords();
  const record = records[id] ?? newRecord(id);

  record.totalReviews += 1;
  record.lastReview = now();

  if (quality >= 3) {
    // Correct response
    record.correctStreak += 1;
    if (record.repetitions === 0) {
      record.interval = 1;
    } else if (record.repetitions === 1) {
      record.interval = 6;
    } else {
      record.interval = Math.round(record.interval * record.easeFactor);
    }
    record.repetitions += 1;
  } else {
    // Failed — reset
    record.repetitions = 0;
    record.interval = 1;
    record.correctStreak = 0;
  }

  // Update ease factor
  record.easeFactor = Math.max(
    1.3,
    record.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  record.nextReview = daysFromNow(record.interval);

  records[id] = record;
  saveRecords(records);
  return record;
}

export function isDue(id: string): boolean {
  const record = getRecord(id);
  return record.nextReview <= now();
}

export function getDueCards(allIds: string[]): string[] {
  return allIds.filter(id => isDue(id));
}

export function getNewCards(allIds: string[], limit = 10): string[] {
  const records = loadRecords();
  const unseen = allIds.filter(id => !records[id] || records[id].totalReviews === 0);
  // Shuffle so we don't always start from the top of the list
  return unseen.sort(() => Math.random() - 0.5).slice(0, limit);
}

// Session builder — guaranteed category mix + due cards, max 20 per session
export function buildSession(allIds: string[], allCards?: { id: string; type: string; category: string }[]): string[] {
  const records = loadRecords();
  const n = now();

  const due = allIds.filter(id => {
    const r = records[id];
    return r && r.totalReviews > 0 && r.nextReview <= n;
  });

  const unseen = allIds.filter(id => !records[id] || records[id].totalReviews === 0);

  // If we have card metadata, guarantee grammar + MC representation
  if (allCards && allCards.length > 0) {
    const unseenByType = (type: string) =>
      unseen.filter(id => allCards.find(c => c.id === id)?.type === type);
    const dueByType = (type: string) =>
      due.filter(id => allCards.find(c => c.id === id)?.type === type);

    const pick = (pool: string[], n: number) =>
      [...pool].sort(() => Math.random() - 0.5).slice(0, n);

    // Targets: ~4 grammar, ~3 MC, ~7 words, ~6 sentences (out of 20)
    const grammarPool = [...dueByType('grammar'), ...unseenByType('grammar')];
    const mcPool      = [...dueByType('multiple-choice'), ...unseenByType('multiple-choice')];
    const wordPool    = [...dueByType('word'), ...unseenByType('word')];
    const sentPool    = [...dueByType('sentence'), ...unseenByType('sentence')];

    const grammar = pick(grammarPool, 4);
    const mc      = pick(mcPool, 3);
    const words   = pick(wordPool, 7);
    const sents   = pick(sentPool, 6);

    const combined = [...grammar, ...mc, ...words, ...sents];
    // Deduplicate and fill remaining from due
    const seen = new Set(combined);
    const extra = due.filter(id => !seen.has(id));
    return [...combined, ...extra].sort(() => Math.random() - 0.5).slice(0, 20);
  }

  // Fallback (no metadata)
  const combined = [...due, ...unseen.sort(() => Math.random() - 0.5).slice(0, Math.max(5, 15 - due.length))];
  return combined.sort(() => Math.random() - 0.5).slice(0, 20);
}

export function getStats(): { total: number; mastered: number; learning: number; newCount: number } {
  const records = loadRecords();
  const all = Object.values(records);
  return {
    total: all.length,
    mastered: all.filter(r => r.interval >= 21).length,
    learning: all.filter(r => r.totalReviews > 0 && r.interval < 21).length,
    newCount: 0, // filled in by caller
  };
}

// ─── Custom cards ──────────────────────────────────────────────────────────────
export interface CustomCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  createdAt: number;
}

export function loadCustomCards(): CustomCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCustomCard(front: string, back: string, hint?: string): CustomCard {
  const cards = loadCustomCards();
  const card: CustomCard = {
    id: `custom-${Date.now()}`,
    front: front.trim(),
    back: back.trim(),
    hint: hint?.trim(),
    createdAt: Date.now(),
  };
  cards.push(card);
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards));
  return card;
}

export function deleteCustomCard(id: string): void {
  const cards = loadCustomCards().filter(c => c.id !== id);
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards));
}
