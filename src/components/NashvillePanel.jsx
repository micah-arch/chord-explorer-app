import React, { useState, useMemo } from 'react';
import {
  NASHVILLE_PROGRESSIONS,
  CHORD_TYPES,
  buildNashvilleChart,
  findKeySignature,
} from '../data/musicTheory';

const NashvillePanel = ({
  keyRoot,
  keyMode,
  keySignature,
  nashvilleChart,
  selectedDegree,
  onDegreeChange,
  audio,
}) => {
  const [activeProgression, setActiveProgression] = useState(null);
  const [transposeRoot, setTransposeRoot] = useState(keyRoot);
  const [transposeMode, setTransposeMode] = useState(keyMode);

  const transposedChart = useMemo(
    () => buildNashvilleChart(transposeRoot, transposeMode),
    [transposeRoot, transposeMode]
  );
  const transposedKeySig = useMemo(
    () => findKeySignature(transposeRoot, transposeMode),
    [transposeRoot, transposeMode]
  );

  const filteredProgressions = NASHVILLE_PROGRESSIONS.filter(p => p.mode === keyMode);

  const playProgression = (numbers) => {
    if (!audio.audioStarted || !audio.isLoaded) return;
    const midiChords = numbers.map(num => {
      const entry = nashvilleChart[num - 1];
      if (!entry) return [];
      const type = CHORD_TYPES[entry.chordTypeKey];
      const baseMidi = 5 * 12 + entry.rootIndex;
      return type.intervals.map(i => baseMidi + i);
    });
    audio.playSequence(midiChords, 600);
  };

  const playTransposedProgression = () => {
    if (!activeProgression || !audio.audioStarted || !audio.isLoaded) return;
    const midiChords = activeProgression.numbers.map(num => {
      const entry = transposedChart[num - 1];
      if (!entry) return [];
      const type = CHORD_TYPES[entry.chordTypeKey];
      const baseMidi = 5 * 12 + entry.rootIndex;
      return type.intervals.map(i => baseMidi + i);
    });
    audio.playSequence(midiChords, 600);
  };

  return (
    <div className="space-y-4">
      {/* Nashville Number Chart */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Nashville Number Chart</h2>
        <p className="text-gray-500 text-sm mb-4">
          In <span className="font-bold text-gray-900">{keySignature.displayName}</span>, each number maps to a chord:
        </p>

        <div className="grid grid-cols-7 gap-2">
          {nashvilleChart.map((entry) => {
            const isSelected = selectedDegree === entry.number;
            return (
              <button
                key={entry.number}
                onClick={() => {
                  onDegreeChange(entry.number, entry.chordTypeKey);
                  const type = CHORD_TYPES[entry.chordTypeKey];
                  const baseMidi = 5 * 12 + entry.rootIndex;
                  const midiNotes = type.intervals.map(i => baseMidi + i);
                  audio.playChord(midiNotes);
                }}
                className={`p-2 md:p-3 rounded-xl transition-all text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="text-2xl md:text-3xl font-bold">{entry.number}</div>
                <div className="text-sm md:text-base font-medium mt-1">{entry.chordName}</div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {entry.quality}
                </div>
                <div className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {entry.romanNumeral}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-gray-400 text-xs mt-3 text-center">
          Click any number to hear the chord and see it on the piano
        </p>
      </div>

      {/* Common Nashville Progressions */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Progressions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProgressions.map((prog, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveProgression(prog);
                setTransposeRoot(keyRoot);
                setTransposeMode(keyMode);
                playProgression(prog.numbers);
              }}
              className={`p-3 rounded-xl transition-all text-left ${
                activeProgression === prog
                  ? 'bg-indigo-50 border-2 border-indigo-400'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="text-gray-900 font-medium">{prog.name}</div>
              <div className="text-indigo-600 font-mono text-lg mt-1">
                {prog.numbers.join(' - ')}
              </div>
              <div className="text-gray-400 text-xs mt-1">
                {prog.numbers.map(n => nashvilleChart[n - 1]?.chordName || n).join(' → ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transposition Demo */}
      {activeProgression && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transposition Demo</h3>
          <p className="text-gray-500 text-sm mb-4">
            The power of Nashville numbers: the same numbers work in <span className="font-bold text-gray-900">every key</span>. Change the key below and watch the chord names change while the numbers stay the same.
          </p>

          {/* Transpose key selector */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-gray-500 text-sm">Transpose to:</span>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 12 }, (_, i) => {
                const keySig = findKeySignature(i, transposeMode);
                const displayName = keySig.scaleNoteNames[0];
                return (
                  <button
                    key={i}
                    onClick={() => setTransposeRoot(i)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      transposeRoot === i
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-gray-500 text-xs mb-1">Original: {keySignature.displayName}</div>
              <div className="flex gap-2 flex-wrap">
                {activeProgression.numbers.map((num, i) => (
                  <div key={i} className="text-center">
                    <div className="text-indigo-600 font-mono text-xl font-bold">{num}</div>
                    <div className="text-gray-900 text-sm">{nashvilleChart[num - 1]?.chordName}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="text-indigo-600 text-xs mb-1">Transposed: {transposedKeySig.displayName}</div>
              <div className="flex gap-2 flex-wrap">
                {activeProgression.numbers.map((num, i) => (
                  <div key={i} className="text-center">
                    <div className="text-indigo-600 font-mono text-xl font-bold">{num}</div>
                    <div className="text-gray-900 text-sm font-bold">{transposedChart[num - 1]?.chordName}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={playTransposedProgression}
                disabled={!audio.audioStarted || !audio.isLoaded}
                className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full text-sm font-medium transition-all"
              >
                Play in {transposedKeySig.displayName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nashville vs Roman Numerals Reference */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Nashville Numbers vs. Roman Numerals</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left py-1 pr-4">Nashville</th>
                <th className="text-left py-1 pr-4">Roman</th>
                <th className="text-left py-1 pr-4">Quality ({keyMode})</th>
                <th className="text-left py-1">In {keySignature.displayName}</th>
              </tr>
            </thead>
            <tbody>
              {nashvilleChart.map(entry => (
                <tr key={entry.number} className="text-gray-900 border-t border-gray-100">
                  <td className="py-1.5 pr-4 font-mono font-bold text-indigo-600">{entry.number}</td>
                  <td className="py-1.5 pr-4">{entry.romanNumeral}</td>
                  <td className="py-1.5 pr-4 text-gray-500">{entry.quality}</td>
                  <td className="py-1.5 font-medium">{entry.chordName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
          <span className="text-indigo-600 font-medium">Why Nashville numbers?</span>
          <p className="mt-1">
            Developed by Nashville session musicians, this system uses simple Arabic numbers (1-7) instead of Roman numerals. The big advantage: a bandleader can call out "1-5-6-4" and the band can play in any key instantly. No rewriting sheet music needed — just know your numbers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NashvillePanel;
