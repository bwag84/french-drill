'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllCards, Card, CONJUGATIONS } from '@/lib/content';
import {
  buildSession, updateRecord, loadRecords,
  addCustomCard, loadCustomCards, deleteCustomCard,
  CustomCard, Quality,
} from '@/lib/srs';

type Screen = 'home' | 'drill' | 'result' | 'stats' | 'add-card';

interface SessionCard {
  card: Card | (CustomCard & { type: 'word'; category: 'core' });
  reversed: boolean;
}

function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    greetings: '👋', campsite: '⛺', bakery: '🥐', restaurant: '🍽️',
    shopping: '🛍️', directions: '🗺️', numbers: '🔢', core: '💬', grammar: '📝',
  };
  return map[cat] ?? '📚';
}

// ─── Conjugation table ────────────────────────────────────────────────────────
function ConjTable({ verbKey, highlightPronoun }: { verbKey: string; highlightPronoun: string }) {
  const table = CONJUGATIONS[verbKey];
  if (!table) return null;
  return (
    <div style={{ marginTop: 16, width: '100%' }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>{table.verb}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {table.rows.map(({ pronoun, form }) => {
          const hi = pronoun === highlightPronoun;
          return (
            <div key={pronoun} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', minWidth: 56 }}>{pronoun}</span>
              <span style={{ fontSize: 15, fontWeight: hi ? 700 : 400, color: hi ? 'var(--accent)' : 'var(--text)' }}>{form}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Rating bar ───────────────────────────────────────────────────────────────
function RatingBar({ onRate }: { onRate: (q: Quality) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      <button onClick={() => onRate(1)} style={{ padding: '14px 0', borderRadius: 14, fontSize: 14, fontWeight: 600, background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', cursor: 'pointer' }}>Again</button>
      <button onClick={() => onRate(3)} style={{ padding: '14px 0', borderRadius: 14, fontSize: 14, fontWeight: 600, background: '#fff8e1', color: '#9a6700', border: 'none', cursor: 'pointer' }}>Hard</button>
      <button onClick={() => onRate(5)} style={{ padding: '14px 0', borderRadius: 14, fontSize: 14, fontWeight: 600, background: 'var(--success-light)', color: 'var(--success)', border: 'none', cursor: 'pointer' }}>Easy</button>
    </div>
  );
}

function ProgressBar({ index, total }: { index: number; total: number }) {
  return (
    <div style={{ height: 3, borderRadius: 8, background: 'var(--border)', marginBottom: 4 }}>
      <div style={{ height: '100%', borderRadius: 8, background: 'var(--accent)', width: `${((index + 1) / total) * 100}%`, transition: 'width 0.4s' }} />
    </div>
  );
}

// ─── Flashcard ────────────────────────────────────────────────────────────────
function Flashcard({ card, reversed, onRate, index, total }: {
  card: SessionCard['card']; reversed: boolean;
  onRate: (q: Quality) => void; index: number; total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => { setFlipped(false); setFlash(''); }, [card.id, reversed]);

  const handleRate = (q: Quality) => {
    setFlash(q >= 3 ? 'flash-correct' : 'flash-wrong');
    setTimeout(() => onRate(q), 320);
  };

  const displayFront = reversed ? card.back : card.front;
  const displayBack  = reversed ? card.front : card.back;
  const dirLabel     = reversed ? '🇳🇱 → 🇫🇷' : '🇫🇷 → 🇳🇱';

  const c = card as Card;
  const typeLabel = 'type' in c
    ? { word: 'Word', sentence: 'Phrase', grammar: 'Grammar', 'multiple-choice': 'Quiz' }[c.type] ?? 'Card'
    : 'My Card';
  const cat = 'category' in card ? (card as Card).category : 'core';
  const hasConjTable = !reversed && c.verbKey && c.highlightPronoun;
  const hasInformal  = c.informal && !reversed;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          <span>{typeLabel} · {getCategoryEmoji(cat)} {cat}</span>
          <span style={{ display: 'flex', gap: 10 }}>
            <span style={{ opacity: 0.7 }}>{dirLabel}</span>
            <span>{index + 1} / {total}</span>
          </span>
        </div>
        <ProgressBar index={index} total={total} />
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 24 }}>
        <div className="card-wrapper">
          <div className={`card-inner ${flipped ? 'flipped' : ''}`} style={{ minHeight: 200 + (hasConjTable ? 150 : 0) + (hasInformal ? 56 : 0) }}>
            {/* Front */}
            <div
              className={`card-face ${flash}`}
              onClick={() => setFlipped(f => !f)}
              style={{ background: 'var(--surface)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', minHeight: 200 + (hasConjTable ? 150 : 0) + (hasInformal ? 56 : 0), boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            >
              <p style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, margin: 0 }}>{displayFront}</p>
              {!flipped && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, marginBottom: 0 }}>tap to reveal</p>}
            </div>

            {/* Back */}
            <div
              className="card-back"
              onClick={() => setFlipped(f => !f)}
              style={{ background: 'var(--surface)', borderRadius: 20, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', cursor: 'pointer', minHeight: 200, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            >
              {/* Main answer */}
              <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)', margin: '12px 0 0' }}>{displayBack}</p>

              {/* Hint */}
              {!reversed && c.hint && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>{c.hint}</p>
              )}

              {/* Formal / Informal pair */}
              {hasInformal && !reversed && (
                <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', minWidth: 52, textAlign: 'right' }}>formal</span>
                    <span style={{ fontSize: 14, color: 'var(--text)' }}>{c.front}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--success)', minWidth: 52, textAlign: 'right' }}>informal</span>
                    <span style={{ fontSize: 14, color: 'var(--text)' }}>{c.informal}</span>
                  </div>
                </div>
              )}

              {/* Conjugation table */}
              {hasConjTable && (
                <ConjTable verbKey={c.verbKey!} highlightPronoun={c.highlightPronoun!} />
              )}

              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 14, marginBottom: 0 }}>tap to flip back</p>
            </div>
          </div>
        </div>
      </div>

      {flipped ? (
        <RatingBar onRate={handleRate} />
      ) : (
        <button onClick={() => setFlipped(true)} style={{ width: '100%', padding: '16px 0', borderRadius: 16, fontWeight: 600, fontSize: 16, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}>
          Reveal
        </button>
      )}
    </div>
  );
}

// ─── Multiple Choice ──────────────────────────────────────────────────────────
function MultipleChoice({ card, onRate, index, total }: {
  card: Card; onRate: (q: Quality) => void; index: number; total: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const choices = useRef(shuffleArr(card.choices!));

  useEffect(() => {
    setSelected(null);
    choices.current = shuffleArr(card.choices!);
  }, [card.id]);

  const correct = card.correctChoice!;
  const isCorrect = selected === correct;

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    // No auto-advance — user must click Next
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          <span>Quiz · {getCategoryEmoji(card.category)} {card.category}</span>
          <span>{index + 1} / {total}</span>
        </div>
        <ProgressBar index={index} total={total} />
      </div>

      {/* Question */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{card.front}</p>
      </div>

      {/* Choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {choices.current.map(choice => {
          let bg = 'var(--surface)', border = 'var(--border)', color = 'var(--text)';
          if (selected) {
            if (choice === correct)        { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
            else if (choice === selected)  { bg = 'var(--danger-light)';  border = 'var(--danger)';  color = 'var(--danger)';  }
          }
          return (
            <button key={choice} onClick={() => handleSelect(choice)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 18px', borderRadius: 16, fontSize: 14, fontWeight: 500, background: bg, border: `1.5px solid ${border}`, color, cursor: selected ? 'default' : 'pointer', transition: 'all 0.15s' }}>
              {choice}
            </button>
          );
        })}
      </div>

      {/* Next button appears after selection */}
      {selected && (
        <button
          onClick={() => onRate(isCorrect ? 5 : 1)}
          style={{ marginTop: 16, width: '100%', padding: '16px 0', borderRadius: 16, fontWeight: 600, fontSize: 16, background: isCorrect ? 'var(--success)' : 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {isCorrect ? 'Correct — Next →' : 'Next →'}
        </button>
      )}
    </div>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────────
function ResultScreen({ correct, total, onHome, onAgain }: { correct: number; total: number; onHome: () => void; onAgain: () => void }) {
  const pct = Math.round((correct / total) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work.' : 'Keep going.'}</h2>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 40 }}>{correct} of {total} correct · {pct}%</p>
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onAgain} style={{ padding: '16px 0', borderRadius: 16, fontWeight: 600, fontSize: 16, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>New session</button>
        <button onClick={onHome}  style={{ padding: '16px 0', borderRadius: 16, fontWeight: 600, fontSize: 16, background: 'var(--surface)', color: 'var(--text)', border: '1.5px solid var(--border)', cursor: 'pointer', width: '100%' }}>Home</button>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatsScreen({ onBack }: { onBack: () => void }) {
  const [, forceUpdate] = useState(0);
  const records = loadRecords();
  const allIds  = getAllCards().map(c => c.id);
  const custom  = loadCustomCards();
  const n = Date.now();
  const seen     = Object.values(records).filter(r => r.totalReviews > 0).length;
  const mastered = Object.values(records).filter(r => r.interval >= 21).length;
  const due      = allIds.filter(id => { const r = records[id]; return r && r.totalReviews > 0 && r.nextReview <= n; }).length;
  const handleDelete = (id: string) => { deleteCustomCard(id); forceUpdate(n => n + 1); };

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button onClick={onBack} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Progress</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total cards', value: allIds.length + custom.length, accent: false },
          { label: 'Seen', value: seen, accent: false },
          { label: 'Mastered', value: mastered, accent: mastered > 0 },
          { label: 'Due now', value: due, accent: due > 0 },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ borderRadius: 18, padding: 20, background: accent ? 'var(--accent-light)' : 'var(--surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      {custom.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>My Cards ({custom.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {custom.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: '12px 16px', background: 'var(--surface)' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{c.front}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{c.back}</p>
                </div>
                <button onClick={() => handleDelete(c.id)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 10, background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Card ─────────────────────────────────────────────────────────────────
function AddCardScreen({ onBack, onAdded }: { onBack: () => void; onAdded: () => void }) {
  const [front, setFront] = useState('');
  const [back, setBack]   = useState('');
  const [hint, setHint]   = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!front.trim() || !back.trim()) return;
    addCustomCard(front, back, hint);
    setSaved(true); setFront(''); setBack(''); setHint(''); onAdded();
    setTimeout(() => setSaved(false), 1500);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '14px 16px', borderRadius: 14, fontSize: 16, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 6 };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button onClick={onBack} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Add a word</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
        <div><label style={labelStyle}>French</label><input value={front} onChange={e => setFront(e.target.value)} placeholder="e.g. une tente" style={inputStyle} /></div>
        <div><label style={labelStyle}>Meaning</label><input value={back} onChange={e => setBack(e.target.value)} placeholder="e.g. a tent" style={inputStyle} /></div>
        <div><label style={labelStyle}>Note (optional)</label><input value={hint} onChange={e => setHint(e.target.value)} placeholder="e.g. feminine noun" style={inputStyle} /></div>
      </div>
      <button onClick={handleSave} disabled={!front.trim() || !back.trim()}
        style={{ width: '100%', padding: '16px 0', borderRadius: 16, fontWeight: 600, fontSize: 16, background: saved ? 'var(--success)' : 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', opacity: (!front.trim() || !back.trim()) ? 0.4 : 1 }}>
        {saved ? 'Saved ✓' : 'Save card'}
      </button>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen({ onStart, onStats, onAdd, dueCount, newCount }: { onStart: () => void; onStats: () => void; onAdd: () => void; dueCount: number; newCount: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 0 0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>French Drill</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, color: 'var(--text)', margin: 0 }}>Bonjour,<br />Bart.</h1>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>{newCount}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>new</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: dueCount > 0 ? 'var(--accent)' : 'var(--text)' }}>{dueCount}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>due for review</div>
            </div>
          </div>
          <button onClick={onStart} style={{ width: '100%', padding: '16px 0', borderRadius: 16, fontWeight: 600, fontSize: 16, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}>
            Start session →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Add word', emoji: '✏️', action: onAdd },
            { label: 'Progress', emoji: '📊', action: onStats },
          ].map(({ label, emoji, action }) => (
            <button key={label} onClick={action} style={{ padding: '20px 0', borderRadius: 18, fontSize: 13, fontWeight: 600, background: 'var(--surface)', color: 'var(--text)', border: '1.5px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 24 }}>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', paddingBottom: 8 }}>
        {dueCount > 0 ? `${dueCount} card${dueCount !== 1 ? 's' : ''} ready for review` : 'All caught up — new cards queued'}
      </p>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]             = useState<Screen>('home');
  const [sessionQueue, setSessionQueue] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [dueCount, setDueCount]         = useState(0);
  const [newCount, setNewCount]         = useState(0);
  const [, setCustomAdded]              = useState(0);

  const allCards = getAllCards();
  const allIds   = allCards.map(c => c.id);

  const refreshCounts = useCallback(() => {
    const records = loadRecords();
    const n = Date.now();
    const due  = allIds.filter(id => { const r = records[id]; return r && r.totalReviews > 0 && r.nextReview <= n; }).length;
    const newC = allIds.filter(id => !records[id] || records[id].totalReviews === 0).length;
    setDueCount(due);
    setNewCount(Math.min(newC, 15));
  }, []);

  useEffect(() => { refreshCounts(); }, [refreshCounts]);

  const startSession = useCallback(() => {
    const ids = buildSession(allIds, allCards);
    const custom = loadCustomCards();
    const sessionCards: SessionCard[] = ids.map(id => {
      const card = allCards.find(c => c.id === id);
      if (!card) return null;
      const canReverse = card.type !== 'grammar' && card.type !== 'multiple-choice';
      return { card, reversed: canReverse && Math.random() < 0.5 };
    }).filter(Boolean) as SessionCard[];
    const customSlots: SessionCard[] = custom.slice(0, 3).map(c => ({
      card: { ...c, type: 'word' as const, category: 'core' as const },
      reversed: Math.random() < 0.5,
    }));
    setSessionQueue(shuffleArr([...sessionCards, ...customSlots]));
    setCurrentIndex(0);
    setSessionCorrect(0);
    setScreen('drill');
  }, [allCards, allIds]);

  const handleRate = useCallback((quality: Quality) => {
    const current = sessionQueue[currentIndex];
    if (current) {
      updateRecord(current.card.id, quality);
      if (quality >= 3) setSessionCorrect(n => n + 1);
    }
    if (currentIndex + 1 >= sessionQueue.length) { setScreen('result'); refreshCounts(); }
    else setCurrentIndex(i => i + 1);
  }, [sessionQueue, currentIndex, refreshCounts]);

  const base: React.CSSProperties   = { maxWidth: 480, margin: '0 auto', height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflowY: 'auto' };
  const padded: React.CSSProperties = { ...base, padding: '0 20px 32px' };

  if (screen === 'home')     return <div style={padded}                        className="safe-top"><HomeScreen onStart={startSession} onStats={() => setScreen('stats')} onAdd={() => setScreen('add-card')} dueCount={dueCount} newCount={newCount} /></div>;
  if (screen === 'stats')    return <div style={padded}                        className="safe-top"><StatsScreen onBack={() => setScreen('home')} /></div>;
  if (screen === 'add-card') return <div style={{ ...padded, paddingTop: 24 }} className="safe-top"><AddCardScreen onBack={() => setScreen('home')} onAdded={() => { setCustomAdded(n => n + 1); refreshCounts(); }} /></div>;
  if (screen === 'result')   return <div style={base}                          className="safe-top"><ResultScreen correct={sessionCorrect} total={sessionQueue.length} onHome={() => { setScreen('home'); refreshCounts(); }} onAgain={startSession} /></div>;

  const current = sessionQueue[currentIndex];
  if (!current) return null;
  const card = current.card as Card;

  return (
    <div style={{ ...padded, paddingTop: 0 }} className="safe-top">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, paddingBottom: 16 }}>
        <button onClick={() => setScreen('home')} style={{ fontSize: 14, padding: '8px 14px', borderRadius: 12, background: 'var(--surface)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>← quit</button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sessionCorrect} ✓</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {card.type === 'multiple-choice' && card.choices
          ? <MultipleChoice card={card} onRate={handleRate} index={currentIndex} total={sessionQueue.length} />
          : <Flashcard card={current.card} reversed={current.reversed} onRate={handleRate} index={currentIndex} total={sessionQueue.length} />
        }
      </div>
    </div>
  );
}
