import React from 'react';
import {
  NOTE_NAMES,
  CHORD_TYPES,
  CHORD_PROGRESSIONS,
  SCALE_DEGREES_MAJOR,
  SCALE_DEGREES_MINOR,
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
} from '../data/musicTheory';

const ChordExplorer = ({
  keyMode,
  keySignature,
  nashvilleChart,
  selectedDegree,
  chordType,
  chordData,
  inversion,
  maxInversions,
  onDegreeChange,
  onChordTypeChange,
  onInversionChange,
  onPlayChord,
  audioReady,
}) => {
  const scaleDegrees = keyMode === 'major' ? SCALE_DEGREES_MAJOR : SCALE_DEGREES_MINOR;
  const scaleIntervals = keyMode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  const progressions = keyMode === 'major' ? CHORD_PROGRESSIONS.major : CHORD_PROGRESSIONS.minor;

  // Get related chords based on current degree's Roman numeral
  const currentRoman = nashvilleChart[selectedDegree - 1]?.romanNumeral;
  const relatedRomans = currentRoman ? (progressions[currentRoman] || []) : [];

  const relatedChords = relatedRomans.map(roman => {
    const degreeIndex = scaleDegrees.indexOf(roman);
    if (degreeIndex === -1) return null;
    const entry = nashvilleChart[degreeIndex];
    if (!entry) return null;
    return {
      degree: degreeIndex + 1,
      roman: entry.romanNumeral,
      nashville: entry.number,
      name: entry.chordName,
      chordTypeKey: entry.chordTypeKey,
    };
  }).filter(Boolean);

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Scale Degree / Nashville Number Selector */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Scale Degree</label>
          <div className="grid grid-cols-7 gap-1">
            {nashvilleChart.map((entry) => (
              <button
                key={entry.number}
                onClick={() => onDegreeChange(entry.number)}
                className={`px-1 py-2 rounded text-sm font-medium transition-all ${
                  selectedDegree === entry.number
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-base font-bold">{entry.number}</div>
                <div className="text-[10px] opacity-70">{entry.romanNumeral}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chord Type Override */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Chord Type</label>
          <select
            value={chordType}
            onChange={(e) => onChordTypeChange(e.target.value)}
            className="w-full bg-gray-100 text-gray-900 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200"
          >
            {Object.entries(CHORD_TYPES).map(([key, { name }]) => (
              <option key={key} value={key} className="text-gray-900">{name}</option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">
            Default for {selectedDegree}: {nashvilleChart[selectedDegree - 1]?.quality}
          </p>
        </div>

        {/* Inversion */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Inversion</label>
          <div className="flex gap-2">
            {Array.from({ length: maxInversions + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => onInversionChange(i)}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                  inversion === i
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i === 0 ? 'Root' : `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : 'rd'}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Chord Display */}
      <div className="text-center mb-4">
        <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-1">{chordData.name}</div>
        <div className="text-gray-500 text-sm">
          Nashville: <span className="font-bold text-gray-900">{selectedDegree}</span>
          <span className="mx-2">|</span>
          Roman: <span className="font-bold text-gray-900">{nashvilleChart[selectedDegree - 1]?.romanNumeral}</span>
          <span className="mx-2">|</span>
          Notes: {chordData.notes.map(n => {
            const scaleNote = keySignature.scaleNoteNames.find((_, idx) => {
              return (keySignature.root + scaleIntervals[idx]) % 12 === n;
            });
            return scaleNote || NOTE_NAMES[n];
          }).join(' - ')}
          {inversion > 0 && (
            <span> (bass: {NOTE_NAMES[chordData.notes[0]]})</span>
          )}
        </div>
        <button
          onClick={onPlayChord}
          disabled={!audioReady}
          className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg"
        >
          Play Chord
        </button>
      </div>

      {/* Related Chords / Progressions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Where to go next</h3>
        <p className="text-gray-500 text-sm mb-3">
          In {keySignature.displayName}, the <span className="font-bold text-gray-900">{selectedDegree}</span> chord ({chordData.name}) commonly moves to:
        </p>

        {relatedChords.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedChords.map((related, i) => (
              <button
                key={i}
                onClick={() => onDegreeChange(related.degree, related.chordTypeKey)}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all text-left group"
              >
                <div className="text-xl font-bold text-gray-900 group-hover:text-indigo-600">
                  {related.name}
                </div>
                <div className="text-gray-400 text-xs flex gap-2">
                  <span>Nashville: {related.nashville}</span>
                  <span>({related.roman})</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Select a diatonic scale degree to see progression suggestions.
          </p>
        )}
      </div>

      {/* Quick Reference */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Progressions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-500 font-medium mb-2">Major Key</div>
            <div className="text-gray-900 space-y-1">
              <div><span className="text-indigo-600 font-mono">1 - 4 - 5 - 1</span> Classic</div>
              <div><span className="text-indigo-600 font-mono">1 - 5 - 6 - 4</span> Pop</div>
              <div><span className="text-indigo-600 font-mono">2 - 5 - 1</span> Jazz</div>
              <div><span className="text-indigo-600 font-mono">1 - 6 - 4 - 5</span> 50s</div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-500 font-medium mb-2">Minor Key</div>
            <div className="text-gray-900 space-y-1">
              <div><span className="text-indigo-600 font-mono">1 - 4 - 5 - 1</span> Classical</div>
              <div><span className="text-indigo-600 font-mono">1 - 7 - 6 - 5</span> Andalusian</div>
              <div><span className="text-indigo-600 font-mono">1 - 6 - 7 - 1</span> Rock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordExplorer;
