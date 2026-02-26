// ── Note Names & Indices ──────────────────────────────────────────────
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const ENHARMONIC_NAMES = {
  0:  { sharp: 'C',  flat: 'C' },
  1:  { sharp: 'C#', flat: 'Db' },
  2:  { sharp: 'D',  flat: 'D' },
  3:  { sharp: 'D#', flat: 'Eb' },
  4:  { sharp: 'E',  flat: 'E' },
  5:  { sharp: 'F',  flat: 'F' },
  6:  { sharp: 'F#', flat: 'Gb' },
  7:  { sharp: 'G',  flat: 'G' },
  8:  { sharp: 'G#', flat: 'Ab' },
  9:  { sharp: 'A',  flat: 'A' },
  10: { sharp: 'A#', flat: 'Bb' },
  11: { sharp: 'B',  flat: 'B' },
};

// ── Chord Types ───────────────────────────────────────────────────────
export const CHORD_TYPES = {
  major:    { name: 'Major',          intervals: [0, 4, 7],     symbol: '' },
  minor:    { name: 'Minor',          intervals: [0, 3, 7],     symbol: 'm' },
  dim:      { name: 'Diminished',     intervals: [0, 3, 6],     symbol: '°' },
  aug:      { name: 'Augmented',      intervals: [0, 4, 8],     symbol: '+' },
  maj7:     { name: 'Major 7th',      intervals: [0, 4, 7, 11], symbol: 'maj7' },
  min7:     { name: 'Minor 7th',      intervals: [0, 3, 7, 10], symbol: 'm7' },
  dom7:     { name: 'Dominant 7th',   intervals: [0, 4, 7, 10], symbol: '7' },
  dim7:     { name: 'Diminished 7th', intervals: [0, 3, 6, 9],  symbol: '°7' },
  halfDim7: { name: 'Half-Dim 7th',   intervals: [0, 3, 6, 10], symbol: 'ø7' },
  sus2:     { name: 'Suspended 2nd',  intervals: [0, 2, 7],     symbol: 'sus2' },
  sus4:     { name: 'Suspended 4th',  intervals: [0, 5, 7],     symbol: 'sus4' },
  add9:     { name: 'Add 9',          intervals: [0, 4, 7, 14], symbol: 'add9' },
};

// ── Scale Data ────────────────────────────────────────────────────────
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

export const SCALE_DEGREES_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
export const SCALE_DEGREES_MINOR = ['i', 'ii°', 'III', 'iv', 'V', 'VI', 'VII'];

// ── Chord Progressions (Roman Numeral) ───────────────────────────────
export const CHORD_PROGRESSIONS = {
  major: {
    'I':    ['IV', 'V', 'vi', 'ii'],
    'ii':   ['V', 'vii°', 'IV'],
    'iii':  ['vi', 'IV', 'ii'],
    'IV':   ['V', 'I', 'ii', 'vii°'],
    'V':    ['I', 'vi', 'IV'],
    'vi':   ['IV', 'ii', 'V', 'iii'],
    'vii°': ['I', 'iii'],
  },
  minor: {
    'i':   ['iv', 'V', 'VII', 'VI'],
    'ii°': ['V', 'VII'],
    'III': ['VI', 'iv', 'VII'],
    'iv':  ['V', 'i', 'VII'],
    'V':   ['i', 'VI'],
    'VI':  ['iv', 'ii°', 'VII', 'III'],
    'VII': ['III', 'i', 'V'],
  }
};

// ── Key Signatures ────────────────────────────────────────────────────
export const KEY_SIGNATURES = {
  // Major keys — ordered by circle of fifths
  'C_major':  { root: 0,  displayName: 'C Major',  mode: 'major', accidentalType: 'none',  accidentalCount: 0, accidentals: [],                              scaleNoteNames: ['C','D','E','F','G','A','B'] },
  'G_major':  { root: 7,  displayName: 'G Major',  mode: 'major', accidentalType: 'sharp', accidentalCount: 1, accidentals: ['F#'],                           scaleNoteNames: ['G','A','B','C','D','E','F#'] },
  'D_major':  { root: 2,  displayName: 'D Major',  mode: 'major', accidentalType: 'sharp', accidentalCount: 2, accidentals: ['F#','C#'],                      scaleNoteNames: ['D','E','F#','G','A','B','C#'] },
  'A_major':  { root: 9,  displayName: 'A Major',  mode: 'major', accidentalType: 'sharp', accidentalCount: 3, accidentals: ['F#','C#','G#'],                 scaleNoteNames: ['A','B','C#','D','E','F#','G#'] },
  'E_major':  { root: 4,  displayName: 'E Major',  mode: 'major', accidentalType: 'sharp', accidentalCount: 4, accidentals: ['F#','C#','G#','D#'],            scaleNoteNames: ['E','F#','G#','A','B','C#','D#'] },
  'B_major':  { root: 11, displayName: 'B Major',  mode: 'major', accidentalType: 'sharp', accidentalCount: 5, accidentals: ['F#','C#','G#','D#','A#'],       scaleNoteNames: ['B','C#','D#','E','F#','G#','A#'] },
  'F#_major': { root: 6,  displayName: 'F# Major', mode: 'major', accidentalType: 'sharp', accidentalCount: 6, accidentals: ['F#','C#','G#','D#','A#','E#'],  scaleNoteNames: ['F#','G#','A#','B','C#','D#','E#'] },
  'F_major':  { root: 5,  displayName: 'F Major',  mode: 'major', accidentalType: 'flat',  accidentalCount: 1, accidentals: ['Bb'],                           scaleNoteNames: ['F','G','A','Bb','C','D','E'] },
  'Bb_major': { root: 10, displayName: 'Bb Major', mode: 'major', accidentalType: 'flat',  accidentalCount: 2, accidentals: ['Bb','Eb'],                      scaleNoteNames: ['Bb','C','D','Eb','F','G','A'] },
  'Eb_major': { root: 3,  displayName: 'Eb Major', mode: 'major', accidentalType: 'flat',  accidentalCount: 3, accidentals: ['Bb','Eb','Ab'],                 scaleNoteNames: ['Eb','F','G','Ab','Bb','C','D'] },
  'Ab_major': { root: 8,  displayName: 'Ab Major', mode: 'major', accidentalType: 'flat',  accidentalCount: 4, accidentals: ['Bb','Eb','Ab','Db'],            scaleNoteNames: ['Ab','Bb','C','Db','Eb','F','G'] },
  'Db_major': { root: 1,  displayName: 'Db Major', mode: 'major', accidentalType: 'flat',  accidentalCount: 5, accidentals: ['Bb','Eb','Ab','Db','Gb'],       scaleNoteNames: ['Db','Eb','F','Gb','Ab','Bb','C'] },
  'Gb_major': { root: 6,  displayName: 'Gb Major', mode: 'major', accidentalType: 'flat',  accidentalCount: 6, accidentals: ['Bb','Eb','Ab','Db','Gb','Cb'],  scaleNoteNames: ['Gb','Ab','Bb','Cb','Db','Eb','F'] },

  // Minor keys — natural minor (relative minors)
  'A_minor':  { root: 9,  displayName: 'A Minor',  mode: 'minor', accidentalType: 'none',  accidentalCount: 0, accidentals: [],                              scaleNoteNames: ['A','B','C','D','E','F','G'] },
  'E_minor':  { root: 4,  displayName: 'E Minor',  mode: 'minor', accidentalType: 'sharp', accidentalCount: 1, accidentals: ['F#'],                           scaleNoteNames: ['E','F#','G','A','B','C','D'] },
  'B_minor':  { root: 11, displayName: 'B Minor',  mode: 'minor', accidentalType: 'sharp', accidentalCount: 2, accidentals: ['F#','C#'],                      scaleNoteNames: ['B','C#','D','E','F#','G','A'] },
  'F#_minor': { root: 6,  displayName: 'F# Minor', mode: 'minor', accidentalType: 'sharp', accidentalCount: 3, accidentals: ['F#','C#','G#'],                 scaleNoteNames: ['F#','G#','A','B','C#','D','E'] },
  'C#_minor': { root: 1,  displayName: 'C# Minor', mode: 'minor', accidentalType: 'sharp', accidentalCount: 4, accidentals: ['F#','C#','G#','D#'],            scaleNoteNames: ['C#','D#','E','F#','G#','A','B'] },
  'G#_minor': { root: 8,  displayName: 'G# Minor', mode: 'minor', accidentalType: 'sharp', accidentalCount: 5, accidentals: ['F#','C#','G#','D#','A#'],       scaleNoteNames: ['G#','A#','B','C#','D#','E','F#'] },
  'D_minor':  { root: 2,  displayName: 'D Minor',  mode: 'minor', accidentalType: 'flat',  accidentalCount: 1, accidentals: ['Bb'],                           scaleNoteNames: ['D','E','F','G','A','Bb','C'] },
  'G_minor':  { root: 7,  displayName: 'G Minor',  mode: 'minor', accidentalType: 'flat',  accidentalCount: 2, accidentals: ['Bb','Eb'],                      scaleNoteNames: ['G','A','Bb','C','D','Eb','F'] },
  'C_minor':  { root: 0,  displayName: 'C Minor',  mode: 'minor', accidentalType: 'flat',  accidentalCount: 3, accidentals: ['Bb','Eb','Ab'],                 scaleNoteNames: ['C','D','Eb','F','G','Ab','Bb'] },
  'F_minor':  { root: 5,  displayName: 'F Minor',  mode: 'minor', accidentalType: 'flat',  accidentalCount: 4, accidentals: ['Bb','Eb','Ab','Db'],            scaleNoteNames: ['F','G','Ab','Bb','C','Db','Eb'] },
  'Bb_minor': { root: 10, displayName: 'Bb Minor', mode: 'minor', accidentalType: 'flat',  accidentalCount: 5, accidentals: ['Bb','Eb','Ab','Db','Gb'],       scaleNoteNames: ['Bb','C','Db','Eb','F','Gb','Ab'] },
  'Eb_minor': { root: 3,  displayName: 'Eb Minor', mode: 'minor', accidentalType: 'flat',  accidentalCount: 6, accidentals: ['Bb','Eb','Ab','Db','Gb','Cb'],  scaleNoteNames: ['Eb','F','Gb','Ab','Bb','Cb','Db'] },
};

// ── Nashville Number System ───────────────────────────────────────────
export const NASHVILLE_NUMBERS = {
  major: [
    { number: 1, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'I',    symbol: '' },
    { number: 2, quality: 'minor',      chordTypeKey: 'minor', romanNumeral: 'ii',   symbol: 'm' },
    { number: 3, quality: 'minor',      chordTypeKey: 'minor', romanNumeral: 'iii',  symbol: 'm' },
    { number: 4, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'IV',   symbol: '' },
    { number: 5, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'V',    symbol: '' },
    { number: 6, quality: 'minor',      chordTypeKey: 'minor', romanNumeral: 'vi',   symbol: 'm' },
    { number: 7, quality: 'diminished', chordTypeKey: 'dim',   romanNumeral: 'vii°', symbol: '°' },
  ],
  minor: [
    { number: 1, quality: 'minor',      chordTypeKey: 'minor', romanNumeral: 'i',    symbol: 'm' },
    { number: 2, quality: 'diminished', chordTypeKey: 'dim',   romanNumeral: 'ii°',  symbol: '°' },
    { number: 3, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'III',  symbol: '' },
    { number: 4, quality: 'minor',      chordTypeKey: 'minor', romanNumeral: 'iv',   symbol: 'm' },
    { number: 5, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'V',    symbol: '' },
    { number: 6, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'VI',   symbol: '' },
    { number: 7, quality: 'major',      chordTypeKey: 'major', romanNumeral: 'VII',  symbol: '' },
  ],
};

export const NASHVILLE_PROGRESSIONS = [
  { name: 'Pop / Rock',         numbers: [1, 5, 6, 4],             mode: 'major' },
  { name: 'Classic Country',    numbers: [1, 4, 5, 1],             mode: 'major' },
  { name: '50s Doo-Wop',        numbers: [1, 6, 4, 5],             mode: 'major' },
  { name: 'Jazz ii-V-I',        numbers: [2, 5, 1],                mode: 'major' },
  { name: 'Sad Ballad',         numbers: [6, 4, 1, 5],             mode: 'major' },
  { name: 'Blues',              numbers: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5], mode: 'major' },
  { name: 'Canon',             numbers: [1, 5, 6, 3, 4, 1, 4, 5], mode: 'major' },
  { name: 'Minor Classical',    numbers: [1, 4, 5, 1],             mode: 'minor' },
  { name: 'Andalusian Cadence', numbers: [1, 7, 6, 5],             mode: 'minor' },
  { name: 'Minor Rock',         numbers: [1, 6, 7, 1],             mode: 'minor' },
];

// ── Helper Functions ──────────────────────────────────────────────────

/** Convert MIDI number to note name for Tone.js (always uses sharps) */
export const midiToNoteName = (midi) => {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
};

/** Find the KEY_SIGNATURES entry for a given root (0-11) and mode */
export function findKeySignature(rootIndex, mode) {
  // Preferred key lookup — choose the most common enharmonic spelling
  const preferredMajor = {
    0: 'C_major', 1: 'Db_major', 2: 'D_major', 3: 'Eb_major',
    4: 'E_major', 5: 'F_major', 6: 'F#_major', 7: 'G_major',
    8: 'Ab_major', 9: 'A_major', 10: 'Bb_major', 11: 'B_major',
  };
  const preferredMinor = {
    0: 'C_minor', 1: 'C#_minor', 2: 'D_minor', 3: 'Eb_minor',
    4: 'E_minor', 5: 'F_minor', 6: 'F#_minor', 7: 'G_minor',
    8: 'G#_minor', 9: 'A_minor', 10: 'Bb_minor', 11: 'B_minor',
  };
  const key = mode === 'major' ? preferredMajor[rootIndex] : preferredMinor[rootIndex];
  return KEY_SIGNATURES[key] || KEY_SIGNATURES['C_major'];
}

/** Get the display name for a note in the context of a key signature */
export function getNoteNameInKey(pitchIndex, keySignatureId) {
  const keySig = KEY_SIGNATURES[keySignatureId];
  if (!keySig) return NOTE_NAMES[pitchIndex % 12];

  const scaleIntervals = keySig.mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  // Check if this pitch is a scale tone and return its proper name
  for (let i = 0; i < scaleIntervals.length; i++) {
    const scalePitch = (keySig.root + scaleIntervals[i]) % 12;
    if (scalePitch === pitchIndex % 12) {
      return keySig.scaleNoteNames[i];
    }
  }
  // Non-scale tone: use the key's accidental preference
  const en = ENHARMONIC_NAMES[pitchIndex % 12];
  return keySig.accidentalType === 'flat' ? en.flat : en.sharp;
}

/** Get the key signature ID string from root index and mode */
export function getKeySignatureId(rootIndex, mode) {
  const keySig = findKeySignature(rootIndex, mode);
  // Reconstruct the ID
  for (const [id, sig] of Object.entries(KEY_SIGNATURES)) {
    if (sig === keySig) return id;
  }
  return 'C_major';
}

/** Build the Nashville chart for a key: array of { number, chordName, rootIndex, quality, chordTypeKey, romanNumeral } */
export function buildNashvilleChart(rootIndex, mode) {
  const keySig = findKeySignature(rootIndex, mode);
  const scaleIntervals = mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  const nashvilleData = NASHVILLE_NUMBERS[mode];

  return nashvilleData.map((entry, i) => {
    const chordRootIndex = (keySig.root + scaleIntervals[i]) % 12;
    const chordRootName = keySig.scaleNoteNames[i];
    return {
      number: entry.number,
      chordName: `${chordRootName}${entry.symbol}`,
      rootIndex: chordRootIndex,
      rootName: chordRootName,
      quality: entry.quality,
      chordTypeKey: entry.chordTypeKey,
      romanNumeral: entry.romanNumeral,
      symbol: entry.symbol,
    };
  });
}

/** Get MIDI numbers for a scale starting from a given octave */
export function getScaleMidi(rootIndex, mode, startOctave = 3) {
  const scaleIntervals = mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  const baseMidi = (startOctave + 1) * 12 + rootIndex;
  return scaleIntervals.map(interval => {
    return baseMidi + interval;
  });
}

/** Get the relative major/minor key info */
export function getRelativeKey(rootIndex, mode) {
  if (mode === 'major') {
    // Relative minor is 3 semitones below (or 9 above)
    const minorRoot = (rootIndex + 9) % 12;
    return findKeySignature(minorRoot, 'minor');
  } else {
    // Relative major is 3 semitones above
    const majorRoot = (rootIndex + 3) % 12;
    return findKeySignature(majorRoot, 'major');
  }
}

/** Get display name for a root note in context (flat or sharp) */
export function getRootDisplayName(rootIndex, mode) {
  const keySig = findKeySignature(rootIndex, mode);
  return keySig.scaleNoteNames[0];
}
