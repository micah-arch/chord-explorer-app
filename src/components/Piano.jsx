import React from 'react';
import { NOTE_NAMES } from '../data/musicTheory';

const PianoKey = ({ isBlack, isPressed, isScaleNote, label, labelColor, onClick }) => {
  const baseStyle = isBlack
    ? 'w-10 h-28 -mx-5 z-10 rounded-b-md shadow-lg'
    : 'w-14 h-44 rounded-b-md shadow-md border border-gray-300';

  let colorStyle;
  if (isBlack) {
    if (isPressed) colorStyle = 'bg-indigo-600';
    else if (isScaleNote) colorStyle = 'bg-indigo-900 active:bg-indigo-700';
    else colorStyle = 'bg-gray-800 active:bg-gray-600';
  } else {
    if (isPressed) colorStyle = 'bg-indigo-400';
    else if (isScaleNote) colorStyle = 'bg-indigo-100 active:bg-indigo-200';
    else colorStyle = 'bg-white active:bg-gray-100';
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${colorStyle} transition-colors relative flex items-end justify-center pb-2 select-none`}
    >
      {label && (
        <span className={`text-xs font-bold pointer-events-none ${labelColor || (isBlack ? 'text-white' : 'text-indigo-700')}`}>
          {label}
        </span>
      )}
    </button>
  );
};

const Piano = ({
  highlightedNotes = [],
  scaleHighlight = [],
  noteLabels = {},
  onKeyClick,
  startOctave = 3,
  numOctaves = 2,
}) => {
  const keys = [];

  for (let oct = startOctave; oct < startOctave + numOctaves; oct++) {
    NOTE_NAMES.forEach((note, i) => {
      const isBlack = note.includes('#');
      const midi = oct * 12 + i + 12;
      const isPressed = highlightedNotes.includes(midi);
      const isScaleNote = !isPressed && scaleHighlight.includes(midi);
      const labelEntry = noteLabels[midi];

      keys.push(
        <PianoKey
          key={`${note}${oct}`}
          note={note}
          isBlack={isBlack}
          isPressed={isPressed}
          isScaleNote={isScaleNote}
          label={labelEntry?.label || (isPressed && !isBlack ? note : undefined)}
          labelColor={labelEntry?.color}
          onClick={() => onKeyClick(midi)}
        />
      );
    });
  }

  return (
    <div className="relative flex justify-center select-none" style={{ touchAction: 'pan-y' }}>
      <div className="flex">
        {keys}
      </div>
    </div>
  );
};

export default Piano;
