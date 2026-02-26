import { useState, useMemo } from 'react';
import useAudio from './hooks/useAudio';
import useMusicTheory from './hooks/useMusicTheory';
import Piano from './components/Piano';
import ChordExplorer from './components/ChordExplorer';
import KeySignaturePanel from './components/KeySignaturePanel';
import NashvillePanel from './components/NashvillePanel';
import PracticeQuiz from './components/PracticeQuiz';
import {
  NOTE_NAMES,
  ENHARMONIC_NAMES,
  CHORD_TYPES,
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
} from './data/musicTheory';

const TABS = [
  { id: 'explore',   label: 'Explore' },
  { id: 'keySig',    label: 'Key Signatures' },
  { id: 'nashville', label: 'Nashville Numbers' },
  { id: 'practice',  label: 'Practice' },
];

function App() {
  // ── Key-level state ──
  const [keyRoot, setKeyRoot] = useState(0);
  const [keyMode, setKeyMode] = useState('major');

  // ── Chord-level state ──
  const [selectedDegree, setSelectedDegree] = useState(1);
  const [chordTypeOverride, setChordTypeOverride] = useState(null);
  const [inversion, setInversion] = useState(0);

  // ── UI state ──
  const [activeTab, setActiveTab] = useState('explore');

  // ── Hooks ──
  const audio = useAudio();
  const theory = useMusicTheory(keyRoot, keyMode);

  // ── Derived chord from Nashville degree ──
  const currentNashvilleEntry = theory.nashvilleChart[selectedDegree - 1];
  const chordType = chordTypeOverride || currentNashvilleEntry?.chordTypeKey || 'major';
  const chordRootIndex = currentNashvilleEntry?.rootIndex ?? 0;

  const chordData = useMemo(() => {
    const type = CHORD_TYPES[chordType];
    let notes = type.intervals.map(interval => (chordRootIndex + interval) % 12);
    for (let i = 0; i < inversion; i++) {
      if (notes.length > 0) notes.push(notes.shift());
    }
    return {
      name: `${currentNashvilleEntry?.rootName || NOTE_NAMES[chordRootIndex]}${type.symbol}`,
      notes,
      type,
    };
  }, [chordRootIndex, chordType, inversion, currentNashvilleEntry]);

  const highlightedMidi = useMemo(() => {
    const baseOctave = 4;
    return chordData.notes.map((note, i) => {
      let octave = baseOctave;
      if (i > 0 && i < inversion + 1) octave += 1;
      let midi = octave * 12 + note + 12;
      return midi;
    });
  }, [chordData.notes, inversion]);

  // Build piano labels based on active tab
  const pianoLabels = useMemo(() => {
    const labels = {};
    if (activeTab === 'keySig') {
      theory.scaleMidiNotes.forEach(midi => {
        const noteIndex = midi % 12;
        const keySig = theory.keySignature;
        const scaleIntervals = keyMode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
        for (let i = 0; i < scaleIntervals.length; i++) {
          if ((keySig.root + scaleIntervals[i]) % 12 === noteIndex) {
            const isAccidental = keySig.accidentals.includes(keySig.scaleNoteNames[i]);
            labels[midi] = {
              label: keySig.scaleNoteNames[i],
              color: isAccidental ? 'text-amber-700' : 'text-indigo-700',
            };
            break;
          }
        }
      });
    } else if (activeTab === 'nashville') {
      const scaleIntervals = keyMode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
      theory.scaleMidiNotes.forEach(midi => {
        const noteIndex = midi % 12;
        for (let i = 0; i < scaleIntervals.length; i++) {
          if ((theory.keySignature.root + scaleIntervals[i]) % 12 === noteIndex) {
            labels[midi] = {
              label: `${i + 1}`,
              color: 'text-indigo-700',
            };
            break;
          }
        }
      });
    }
    return labels;
  }, [activeTab, theory, keyMode]);

  const scaleHighlight = (activeTab === 'keySig' || activeTab === 'nashville')
    ? theory.scaleMidiNotes.filter(m => !highlightedMidi.includes(m))
    : [];

  // ── Key selector helpers ──
  const keySig = theory.keySignature;

  const handleKeyRootChange = (rootIndex) => {
    setKeyRoot(rootIndex);
    setSelectedDegree(1);
    setChordTypeOverride(null);
    setInversion(0);
  };

  const handleModeChange = (mode) => {
    setKeyMode(mode);
    setSelectedDegree(1);
    setChordTypeOverride(null);
    setInversion(0);
  };

  const handleDegreeChange = (degree, typeOverride = null) => {
    setSelectedDegree(degree);
    setChordTypeOverride(typeOverride);
    setInversion(0);
  };

  const maxInversions = CHORD_TYPES[chordType].intervals.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-1">
          Piano Chord Explorer
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Learn key signatures, Nashville numbers, and chord progressions
        </p>

        {/* Audio Start */}
        {!audio.audioStarted && (
          <div className="mb-6 text-center">
            <button
              onClick={audio.startAudio}
              disabled={audio.isLoading}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl font-medium transition-all shadow-md text-lg"
            >
              {audio.isLoading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading Piano Samples...
                </span>
              ) : (
                'Click to Enable Piano Audio'
              )}
            </button>
            <p className="text-gray-400 text-sm mt-2">
              {audio.isLoading ? 'Loading Salamander Grand Piano samples...' : 'Browsers require a click to enable audio'}
            </p>
          </div>
        )}

        {/* Key Selector — always visible */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <label className="block text-gray-600 text-sm mb-2 font-medium">Select Key</label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
                {Array.from({ length: 12 }, (_, i) => {
                  const en = ENHARMONIC_NAMES[i];
                  const displayName = keySig.accidentalType === 'flat' && en.flat !== en.sharp
                    ? en.flat
                    : en.sharp;
                  return (
                    <button
                      key={i}
                      onClick={() => handleKeyRootChange(i)}
                      className={`px-1 py-2 rounded text-sm font-medium transition-all ${
                        keyRoot === i
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {displayName}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-2 font-medium">Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModeChange('major')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    keyMode === 'major'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Major
                </button>
                <button
                  onClick={() => handleModeChange('minor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    keyMode === 'minor'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Minor
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-gray-500 text-sm">
            Key of <span className="font-bold text-gray-900">{keySig.displayName}</span>
            {keySig.accidentalCount > 0 && (
              <span className="ml-2">
                ({keySig.accidentalCount} {keySig.accidentalType}{keySig.accidentalCount > 1 ? 's' : ''}: {keySig.accidentals.join(', ')})
              </span>
            )}
            {keySig.accidentalCount === 0 && (
              <span className="ml-2">(no sharps or flats)</span>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Piano — always visible, above tab content */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6 mb-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">
              {activeTab === 'keySig' && 'Scale tones highlighted'}
              {activeTab === 'nashville' && 'Nashville numbers on keys'}
              {activeTab === 'explore' && `${chordData.name}${inversion > 0 ? ` (${inversion}${inversion === 1 ? 'st' : inversion === 2 ? 'nd' : 'rd'} inv.)` : ''}`}
              {activeTab === 'practice' && 'Piano'}
            </h3>
            {activeTab === 'explore' && (
              <button
                onClick={() => audio.playChord(highlightedMidi)}
                disabled={!audio.audioStarted || !audio.isLoaded}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-full text-sm font-medium transition-all"
              >
                Play
              </button>
            )}
          </div>
          <Piano
            highlightedNotes={highlightedMidi}
            scaleHighlight={scaleHighlight}
            noteLabels={pianoLabels}
            onKeyClick={audio.playNote}
            startOctave={3}
            numOctaves={2}
          />
          {!audio.audioStarted && (
            <p className="text-center text-gray-400 text-sm mt-4">
              Enable audio above to play the piano
            </p>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'explore' && (
          <ChordExplorer
            keyMode={keyMode}
            keySignature={keySig}
            nashvilleChart={theory.nashvilleChart}
            selectedDegree={selectedDegree}
            chordType={chordType}
            chordData={chordData}
            inversion={inversion}
            maxInversions={maxInversions}
            onDegreeChange={handleDegreeChange}
            onChordTypeChange={(type) => { setChordTypeOverride(type); setInversion(0); }}
            onInversionChange={setInversion}
            onPlayChord={() => audio.playChord(highlightedMidi)}
            audioReady={audio.audioStarted && audio.isLoaded}
          />
        )}

        {activeTab === 'keySig' && (
          <KeySignaturePanel
            keyRoot={keyRoot}
            keyMode={keyMode}
            keySignature={keySig}
            relativeKey={theory.relativeKey}
            audio={audio}
          />
        )}

        {activeTab === 'nashville' && (
          <NashvillePanel
            keyRoot={keyRoot}
            keyMode={keyMode}
            keySignature={keySig}
            nashvilleChart={theory.nashvilleChart}
            selectedDegree={selectedDegree}
            onDegreeChange={handleDegreeChange}
            audio={audio}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeQuiz
          />
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-4">
          Piano samples: Salamander Grand Piano by Alexander Holm (CC BY 3.0)
        </p>
      </div>
    </div>
  );
}

export default App;
