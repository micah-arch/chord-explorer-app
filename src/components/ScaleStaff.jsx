import React from 'react';

const LETTER_POS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

// Staff position: E4 (bottom line) = 0, each line/space = +1
function toStaffPos(letter, octave) {
  return (LETTER_POS[letter] - LETTER_POS['E']) + (octave - 4) * 7;
}

// Key signature accidental positions on treble clef
const SHARP_STAFF = [8, 5, 9, 6, 3, 7, 4]; // F5 C5 G5 D5 A4 E5 B4
const FLAT_STAFF  = [4, 7, 3, 6, 2, 5, 1]; // B4 E5 A4 D5 G4 C5 F4

const ScaleStaff = ({ keySignature }) => {
  const { scaleNoteNames, accidentalType, accidentalCount } = keySignature;

  // 8 notes: scale + octave return
  const allNotes = [...scaleNoteNames, scaleNoteNames[0]];

  // Pick octave that keeps most notes on staff
  const rootLetter = allNotes[0][0];
  const rootPos4 = toStaffPos(rootLetter, 4);
  const startOctave = (rootPos4 + 7 > 10) ? 3 : 4;

  // Track octave for each note (bump when letter wraps past B→C)
  const octaves = [startOctave];
  for (let i = 1; i < allNotes.length; i++) {
    const prev = LETTER_POS[allNotes[i - 1][0]];
    const curr = LETTER_POS[allNotes[i][0]];
    octaves.push(curr < prev ? octaves[i - 1] + 1 : octaves[i - 1]);
  }

  // ── Layout constants ──
  const LS = 12;        // line spacing (px between staff lines)
  const H = LS / 2;     // half-space
  const TOP = 32;       // y of top staff line
  const BOT = TOP + 4 * LS;
  const toY = (pos) => BOT - pos * H;

  const CLEF_W = 40;
  const KS_X = CLEF_W + 2;
  const ACC_W = 14;
  const KS_W = accidentalCount * ACC_W + (accidentalCount > 0 ? 6 : 0);
  const NOTE_X0 = KS_X + KS_W + 20;
  const NOTE_DX = 44;
  const W = NOTE_X0 + 8 * NOTE_DX + 10;
  const SVG_H = 118;

  // ── Build note data ──
  const notes = allNotes.map((name, i) => {
    const pos = toStaffPos(name[0], octaves[i]);
    return {
      name,
      pos,
      x: NOTE_X0 + i * NOTE_DX,
      y: toY(pos),
      isAccidental: name.length > 1,
      degree: i < 7 ? i + 1 : 8,
    };
  });

  // ── Ledger lines ──
  const ledgers = [];
  for (const note of notes) {
    // Below staff
    for (let p = -2; p >= note.pos; p -= 2) {
      ledgers.push({ x: note.x, y: toY(p) });
    }
    // Above staff
    for (let p = 10; p <= note.pos; p += 2) {
      ledgers.push({ x: note.x, y: toY(p) });
    }
  }

  const ksPositions = accidentalType === 'sharp' ? SHARP_STAFF : FLAT_STAFF;
  const ksChar = accidentalType === 'sharp' ? '\u266F' : '\u266D';

  return (
    <div className="overflow-x-auto py-2">
      <svg
        width={W}
        height={SVG_H}
        viewBox={`0 0 ${W} ${SVG_H}`}
        className="mx-auto block"
      >
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`sl${i}`}
            x1={0} y1={TOP + i * LS}
            x2={W} y2={TOP + i * LS}
            stroke="#d1d5db" strokeWidth="1"
          />
        ))}

        {/* Treble clef (Unicode G clef) */}
        <text
          x="0" y={BOT + 9}
          fontSize="64"
          fill="#6b7280"
          fontFamily="'Noto Music','Segoe UI Symbol','Apple Symbols',serif"
        >
          {'\uD834\uDD1E'}
        </text>

        {/* Key signature */}
        {Array.from({ length: accidentalCount }, (_, i) => (
          <text
            key={`ks${i}`}
            x={KS_X + i * ACC_W}
            y={toY(ksPositions[i]) + 5}
            fontSize="16" fill="#d97706" fontWeight="bold"
          >
            {ksChar}
          </text>
        ))}

        {/* Ledger lines */}
        {ledgers.map((l, i) => (
          <line
            key={`ll${i}`}
            x1={l.x - 13} y1={l.y}
            x2={l.x + 13} y2={l.y}
            stroke="#d1d5db" strokeWidth="1"
          />
        ))}

        {/* Notes with labels */}
        {notes.map((n, i) => (
          <g key={`n${i}`}>
            {/* Whole note (hollow tilted ellipse) */}
            <ellipse
              cx={n.x} cy={n.y}
              rx={6.5} ry={4.5}
              fill="none"
              stroke={n.isAccidental ? '#d97706' : '#1f2937'}
              strokeWidth="2"
              transform={`rotate(-15 ${n.x} ${n.y})`}
            />
            {/* Scale degree / Nashville number above */}
            <text
              x={n.x} y={12}
              textAnchor="middle"
              fontSize="12" fontWeight="bold"
              fill="#4f46e5"
            >
              {n.degree}
            </text>
            {/* Note name below */}
            <text
              x={n.x} y={SVG_H - 2}
              textAnchor="middle"
              fontSize="10"
              fill={n.isAccidental ? '#d97706' : '#374151'}
            >
              {n.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ScaleStaff;
