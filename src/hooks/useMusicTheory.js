import { useMemo } from 'react';
import {
  findKeySignature,
  buildNashvilleChart,
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
  getRelativeKey,
} from '../data/musicTheory';

export default function useMusicTheory(keyRoot, keyMode) {
  const keySignature = useMemo(
    () => findKeySignature(keyRoot, keyMode),
    [keyRoot, keyMode]
  );

  const nashvilleChart = useMemo(
    () => buildNashvilleChart(keyRoot, keyMode),
    [keyRoot, keyMode]
  );

  const scaleIntervals = keyMode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;

  const scaleMidiNotes = useMemo(() => {
    const notes = [];
    for (let oct = 3; oct <= 4; oct++) {
      scaleIntervals.forEach(interval => {
        const midi = (oct + 1) * 12 + keyRoot + interval;
        if (midi >= 48 && midi <= 84) notes.push(midi);
      });
    }
    return [...new Set(notes)].sort((a, b) => a - b);
  }, [keyRoot, scaleIntervals]);

  const relativeKey = useMemo(
    () => getRelativeKey(keyRoot, keyMode),
    [keyRoot, keyMode]
  );

  return {
    keySignature,
    nashvilleChart,
    scaleMidiNotes,
    scaleIntervals,
    relativeKey,
  };
}
