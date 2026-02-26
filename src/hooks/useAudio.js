import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { midiToNoteName } from '../data/musicTheory';

export default function useAudio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);
  const samplerRef = useRef(null);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
        A7: "A7.mp3", C8: "C8.mp3"
      },
      release: 1.5,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        setIsLoaded(true);
        setIsLoading(false);
      }
    }).toDestination();

    samplerRef.current = sampler;
    return () => { sampler.dispose(); };
  }, []);

  const startAudio = useCallback(async () => {
    await Tone.start();
    setAudioStarted(true);
  }, []);

  const playNote = useCallback((midi) => {
    if (!samplerRef.current || !isLoaded || !audioStarted) return;
    const noteName = midiToNoteName(midi);
    samplerRef.current.triggerAttackRelease(noteName, "2n");
  }, [isLoaded, audioStarted]);

  const playChord = useCallback((midiArray) => {
    if (!samplerRef.current || !isLoaded || !audioStarted) return;
    const noteNames = midiArray.map(midiToNoteName);
    noteNames.forEach((note, i) => {
      setTimeout(() => {
        samplerRef.current.triggerAttackRelease(note, "2n");
      }, i * 30);
    });
  }, [isLoaded, audioStarted]);

  const playSequence = useCallback((midiArrays, tempo = 500) => {
    if (!samplerRef.current || !isLoaded || !audioStarted) return;
    midiArrays.forEach((midiArray, i) => {
      setTimeout(() => {
        const noteNames = (Array.isArray(midiArray) ? midiArray : [midiArray]).map(midiToNoteName);
        noteNames.forEach((note, j) => {
          setTimeout(() => {
            samplerRef.current.triggerAttackRelease(note, "2n");
          }, j * 30);
        });
      }, i * tempo);
    });
  }, [isLoaded, audioStarted]);

  return { isLoaded, isLoading, audioStarted, startAudio, playNote, playChord, playSequence };
}
