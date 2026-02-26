import React, { useState, useCallback } from 'react';
import {
  KEY_SIGNATURES,
  NASHVILLE_NUMBERS,
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
  buildNashvilleChart,
  findKeySignature,
} from '../data/musicTheory';

// Common keys weighted for beginner friendliness
const BEGINNER_MAJOR_ROOTS = [0, 7, 2, 9, 4, 5, 10, 3]; // C, G, D, A, E, F, Bb, Eb
const BEGINNER_MINOR_ROOTS = [9, 4, 11, 2, 7, 0]; // Am, Em, Bm, Dm, Gm, Cm

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateKeySigQuestion() {
  const mode = Math.random() > 0.3 ? 'major' : 'minor';
  const roots = mode === 'major' ? BEGINNER_MAJOR_ROOTS : BEGINNER_MINOR_ROOTS;
  const root = pickRandom(roots);
  const keySig = findKeySignature(root, mode);
  const questionType = pickRandom(['howMany', 'whichKey', 'isNoteAccidental']);

  if (questionType === 'howMany') {
    const correctAnswer = `${keySig.accidentalCount} ${keySig.accidentalCount === 0 ? '(none)' : keySig.accidentalType + (keySig.accidentalCount > 1 ? 's' : '')}`;
    const options = new Set([correctAnswer]);
    const possibleCounts = [0, 1, 2, 3, 4, 5, 6];
    while (options.size < 4) {
      const count = pickRandom(possibleCounts);
      const type = count === 0 ? '(none)' : (keySig.accidentalType === 'flat' ? 'flat' : 'sharp') + (count > 1 ? 's' : '');
      options.add(`${count} ${type}`);
    }
    return {
      question: `How many sharps or flats does ${keySig.displayName} have?`,
      correctAnswer,
      options: shuffle([...options]),
      explanation: keySig.accidentalCount === 0
        ? `${keySig.displayName} has no sharps or flats.`
        : `${keySig.displayName} has ${keySig.accidentalCount} ${keySig.accidentalType}${keySig.accidentalCount > 1 ? 's' : ''}: ${keySig.accidentals.join(', ')}`,
    };
  }

  if (questionType === 'whichKey') {
    const correctAnswer = keySig.displayName;
    const options = new Set([correctAnswer]);
    const allKeys = Object.values(KEY_SIGNATURES).filter(k => k.mode === mode);
    while (options.size < 4 && allKeys.length > 0) {
      const other = pickRandom(allKeys);
      options.add(other.displayName);
    }
    const countDesc = keySig.accidentalCount === 0
      ? 'no sharps or flats'
      : `${keySig.accidentalCount} ${keySig.accidentalType}${keySig.accidentalCount > 1 ? 's' : ''}`;
    return {
      question: `Which ${mode} key has ${countDesc}?`,
      correctAnswer,
      options: shuffle([...options]),
      explanation: `${keySig.displayName} has ${countDesc}${keySig.accidentalCount > 0 ? ': ' + keySig.accidentals.join(', ') : ''}.`,
    };
  }

  // isNoteAccidental
  const noteIndex = Math.floor(Math.random() * 7);
  const noteName = keySig.scaleNoteNames[noteIndex];
  const isSharp = noteName.includes('#');
  const isFlat = noteName.includes('b');
  const correctAnswer = isSharp ? 'Sharp' : isFlat ? 'Flat' : 'Natural';
  return {
    question: `In ${keySig.displayName}, is ${noteName.replace('#', '').replace('b', '')} sharp, flat, or natural?`,
    correctAnswer,
    options: shuffle(['Sharp', 'Flat', 'Natural', 'Not in the scale']),
    explanation: `In ${keySig.displayName}, ${noteName.replace('#', '').replace('b', '')} is ${correctAnswer.toLowerCase()}${isSharp || isFlat ? ` (${noteName})` : ''}.`,
  };
}

function generateNashvilleQuestion() {
  const mode = Math.random() > 0.3 ? 'major' : 'minor';
  const roots = mode === 'major' ? BEGINNER_MAJOR_ROOTS : BEGINNER_MINOR_ROOTS;
  const root = pickRandom(roots);
  const chart = buildNashvilleChart(root, mode);
  const keySig = findKeySignature(root, mode);
  const questionType = pickRandom(['numberToChord', 'chordToNumber', 'quality', 'transpose']);

  if (questionType === 'numberToChord') {
    const entry = pickRandom(chart);
    const correctAnswer = entry.chordName;
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const other = pickRandom(chart);
      options.add(other.chordName);
      const otherRoot = pickRandom(roots);
      const otherChart = buildNashvilleChart(otherRoot, mode);
      options.add(pickRandom(otherChart).chordName);
    }
    return {
      question: `In ${keySig.displayName}, what chord is the ${entry.number}?`,
      correctAnswer,
      options: shuffle([...options].slice(0, 4)),
      explanation: `In ${keySig.displayName}, the ${entry.number} chord is ${entry.chordName} (${entry.quality}).`,
    };
  }

  if (questionType === 'chordToNumber') {
    const entry = pickRandom(chart);
    const correctAnswer = `${entry.number}`;
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      options.add(`${Math.floor(Math.random() * 7) + 1}`);
    }
    return {
      question: `In ${keySig.displayName}, ${entry.chordName} is which Nashville number?`,
      correctAnswer,
      options: shuffle([...options]),
      explanation: `${entry.chordName} is the ${entry.number} chord in ${keySig.displayName}.`,
    };
  }

  if (questionType === 'quality') {
    const num = Math.floor(Math.random() * 7) + 1;
    const entry = NASHVILLE_NUMBERS[mode][num - 1];
    const correctAnswer = entry.quality.charAt(0).toUpperCase() + entry.quality.slice(1);
    const options = shuffle(['Major', 'Minor', 'Diminished', 'Augmented']);
    if (!options.includes(correctAnswer)) options[3] = correctAnswer;
    return {
      question: `In a ${mode} key, what is the quality of the ${num} chord?`,
      correctAnswer,
      options: shuffle(options),
      explanation: `The ${num} chord in a ${mode} key is always ${entry.quality} (${entry.romanNumeral}).`,
    };
  }

  // transpose
  const prog = [1, 5, 6, 4];
  const targetNum = pickRandom(prog);
  const root2 = pickRandom(roots.filter(r => r !== root));
  const chart2 = buildNashvilleChart(root2, mode);
  const keySig2 = findKeySignature(root2, mode);
  const entry2 = chart2[targetNum - 1];
  const correctAnswer = entry2.chordName;

  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    const otherRoot = pickRandom(roots);
    const otherChart = buildNashvilleChart(otherRoot, mode);
    options.add(otherChart[targetNum - 1].chordName);
  }
  return {
    question: `Transpose 1-5-6-4 from ${keySig.displayName} to ${keySig2.displayName}. What is the ${targetNum} chord?`,
    correctAnswer,
    options: shuffle([...options].slice(0, 4)),
    explanation: `The ${targetNum} chord in ${keySig2.displayName} is ${entry2.chordName}.`,
  };
}

const PracticeQuiz = () => {
  const [quizMode, setQuizMode] = useState('keySig');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateQuestion = useCallback(() => {
    const q = quizMode === 'keySig' ? generateKeySigQuestion() : generateNashvilleQuestion();
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setIsRevealed(false);
  }, [quizMode]);

  const handleAnswer = (answer) => {
    if (isRevealed) return;
    setSelectedAnswer(answer);
    setIsRevealed(true);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  const handleModeChange = (mode) => {
    setQuizMode(mode);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  return (
    <div className="space-y-4">
      {/* Quiz Mode Selector */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Quiz</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleModeChange('keySig')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              quizMode === 'keySig'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="font-bold">Key Signatures</div>
            <div className="text-xs mt-0.5 opacity-70">Sharps, flats, and scales</div>
          </button>
          <button
            onClick={() => handleModeChange('nashville')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              quizMode === 'nashville'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="font-bold">Nashville Numbers</div>
            <div className="text-xs mt-0.5 opacity-70">Numbers, chords, and transposing</div>
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between">
          <div className="text-gray-500 text-sm">
            Score: <span className="font-bold text-gray-900">{score.correct}</span> / {score.total}
            {score.total > 0 && (
              <span className="ml-2 text-xs">
                ({Math.round((score.correct / score.total) * 100)}%)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {score.total > 0 && (
              <button
                onClick={resetScore}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg text-sm transition-all"
              >
                Reset
              </button>
            )}
            <button
              onClick={generateQuestion}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              {currentQuestion ? 'Next Question' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6">
          <div className="text-center mb-6">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {quizMode === 'keySig' ? 'Key Signature Question' : 'Nashville Number Question'}
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQuestion.options.map((option, i) => {
              let style = 'bg-gray-50 text-gray-900 hover:bg-gray-100 border-2 border-gray-200';
              if (isRevealed) {
                if (option === currentQuestion.correctAnswer) {
                  style = 'bg-green-50 text-green-700 border-2 border-green-400';
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  style = 'bg-red-50 text-red-700 border-2 border-red-400';
                } else {
                  style = 'bg-gray-50 text-gray-300 border-2 border-gray-100';
                }
              } else if (selectedAnswer === option) {
                style = 'bg-indigo-50 text-indigo-700 border-2 border-indigo-400';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={isRevealed}
                  className={`p-3 md:p-4 rounded-xl font-medium transition-all text-center ${style}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isRevealed && (
            <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className="font-bold mb-1">
                {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite!'}
              </div>
              <div>{currentQuestion.explanation}</div>
            </div>
          )}

          {isRevealed && (
            <div className="text-center mt-4">
              <button
                onClick={generateQuestion}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}

      {/* Getting Started */}
      {!currentQuestion && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 md:p-6 text-center">
          <div className="text-gray-500 text-sm max-w-md mx-auto">
            {quizMode === 'keySig' ? (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Key Signature Quiz</p>
                <p>Test your knowledge of sharps and flats for each key. Questions cover:</p>
                <ul className="text-left list-disc list-inside space-y-1">
                  <li>How many sharps/flats does a key have?</li>
                  <li>Which key has a given number of accidentals?</li>
                  <li>Is a specific note sharp, flat, or natural?</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Nashville Number Quiz</p>
                <p>Practice the Nashville number system with questions about:</p>
                <ul className="text-left list-disc list-inside space-y-1">
                  <li>What chord does a number represent in a key?</li>
                  <li>What number is a given chord?</li>
                  <li>Chord qualities for each number</li>
                  <li>Transposing progressions between keys</li>
                </ul>
              </div>
            )}
            <button
              onClick={generateQuestion}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeQuiz;
