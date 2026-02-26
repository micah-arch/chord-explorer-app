import React from 'react';
import {
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
} from '../data/musicTheory';
import ScaleStaff from './ScaleStaff';

const STEP_PATTERN_MAJOR = ['W', 'W', 'H', 'W', 'W', 'W', 'H'];
const STEP_PATTERN_MINOR = ['W', 'H', 'W', 'W', 'H', 'W', 'W'];

const SHARPS_ORDER = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
const FLATS_ORDER = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'];

const KeySignaturePanel = ({
  keyRoot,
  keyMode,
  keySignature,
  relativeKey,
  audio,
}) => {
  const stepPattern = keyMode === 'major' ? STEP_PATTERN_MAJOR : STEP_PATTERN_MINOR;
  const scaleIntervals = keyMode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;

  const playScale = () => {
    if (!audio.audioStarted || !audio.isLoaded) return;
    const baseMidi = 5 * 12 + keyRoot; // octave 4 in MIDI
    const ascending = scaleIntervals.map(i => baseMidi + i);
    ascending.push(baseMidi + 12); // octave
    const descending = [...ascending].reverse().slice(1);
    const full = [...ascending, ...descending];
    audio.playSequence(full, 350);
  };

  return (
    <div className="space-y-4">
      {/* Key Info */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{keySignature.displayName}</h2>
            <p className="text-gray-500 mt-1">
              {keySignature.accidentalCount === 0
                ? 'No sharps or flats'
                : `${keySignature.accidentalCount} ${keySignature.accidentalType}${keySignature.accidentalCount > 1 ? 's' : ''}: `}
              {keySignature.accidentalCount > 0 && (
                <span className="font-bold text-amber-600">
                  {keySignature.accidentals.join(', ')}
                </span>
              )}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <div className="text-gray-500 text-xs">Relative {keyMode === 'major' ? 'Minor' : 'Major'}</div>
            <div className="text-gray-900 font-bold">{relativeKey.displayName}</div>
            <div className="text-gray-400 text-xs">Same key signature</div>
          </div>
        </div>
      </div>

      {/* Staff Notation */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Notation</h3>
        <p className="text-gray-400 text-xs mb-2">
          The scale written on a treble clef staff. Numbers above = scale degrees (Nashville numbers). Amber notes = accidentals from the key signature.
        </p>
        <ScaleStaff keySignature={keySignature} />
      </div>

      {/* Scale Display */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scale Notes</h3>
          <button
            onClick={playScale}
            disabled={!audio.audioStarted || !audio.isLoaded}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-full text-sm font-medium transition-all"
          >
            Play Scale
          </button>
        </div>

        {/* Note boxes with step indicators */}
        <div className="flex items-center justify-center gap-0 flex-wrap">
          {keySignature.scaleNoteNames.map((noteName, i) => {
            const isAccidental = noteName.includes('#') || noteName.includes('b');
            return (
              <div key={i} className="flex items-center">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer transition-all hover:scale-105 ${
                    isAccidental
                      ? 'bg-amber-50 text-amber-700 border-2 border-amber-300'
                      : 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                  }`}
                  onClick={() => {
                    const midi = 5 * 12 + keyRoot + scaleIntervals[i];
                    audio.playNote(midi);
                  }}
                >
                  {noteName}
                </div>
                {i < 6 && (
                  <div className={`mx-1 text-xs font-mono ${
                    stepPattern[i] === 'H' ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    {stepPattern[i]}
                  </div>
                )}
              </div>
            );
          })}
          {/* Show octave return */}
          <div className="flex items-center">
            <div className="mx-1 text-xs font-mono text-gray-400">
              {stepPattern[6]}
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center font-bold text-lg bg-gray-50 text-gray-400 border-2 border-gray-200">
              {keySignature.scaleNoteNames[0]}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-xs mt-3 text-center">
          W = Whole step (2 frets) | H = Half step (1 fret)
          {keyMode === 'major'
            ? ' | Major pattern: W-W-H-W-W-W-H'
            : ' | Minor pattern: W-H-W-W-H-W-W'}
        </p>
      </div>

      {/* Order of Sharps / Flats */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order of Accidentals</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sharps */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-500 font-medium mb-2">Order of Sharps</div>
            <div className="flex gap-2 mb-2">
              {SHARPS_ORDER.map((sharp, i) => (
                <div
                  key={sharp}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                    keySignature.accidentalType === 'sharp' && i < keySignature.accidentalCount
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {sharp}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs italic">
              "Father Charles Goes Down And Ends Battle"
            </p>
          </div>

          {/* Flats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-500 font-medium mb-2">Order of Flats</div>
            <div className="flex gap-2 mb-2">
              {FLATS_ORDER.map((flat, i) => (
                <div
                  key={flat}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                    keySignature.accidentalType === 'flat' && i < keySignature.accidentalCount
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {flat}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs italic">
              "Battle Ends And Down Goes Charles' Father"
            </p>
          </div>
        </div>
      </div>

      {/* Beginner Tips */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Signature Tips</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-indigo-600 font-medium">What is a key signature?</span>
            <p className="mt-1">A key signature tells you which notes are sharp or flat throughout a piece of music. Instead of writing a sharp or flat every time, it's shown once at the beginning.</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-indigo-600 font-medium">Why does it matter?</span>
            <p className="mt-1">Knowing your key signature means you know which 7 notes to use. Every major and minor scale uses exactly 7 of the 12 possible notes — the key signature tells you which 7.</p>
          </div>
          {keySignature.scaleNoteNames.some(n => n === 'E#' || n === 'Cb' || n === 'B#' || n === 'Fb') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <span className="text-amber-700 font-medium">About E#, Cb, B#, and Fb</span>
              <p className="mt-1 text-amber-800">
                E# sounds the same as F, and Cb sounds the same as B. But in music theory, every letter (A through G) must appear exactly once in a scale. That's why we sometimes use these unusual names.
              </p>
            </div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-indigo-600 font-medium">Quick tricks</span>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>For sharp keys: the key name is one half step above the last sharp (e.g., last sharp is C# → key of D)</li>
              <li>For flat keys: the key name is the second-to-last flat (e.g., flats are Bb, Eb → key of Bb)</li>
              <li>Exception: F major has just one flat (Bb) — memorize this one!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeySignaturePanel;
