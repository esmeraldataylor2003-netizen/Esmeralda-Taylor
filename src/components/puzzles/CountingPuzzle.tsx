import React, { useState } from 'react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface CountingPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface CountRound {
  question: string;
  groups: { icon: NatureIconId; count: number; label: string }[];
  answer: number;
  options: number[];
  hints: [string, string, string];
  explanation: string;
}

const ROUNDS_EASY: CountRound[] = [
  {
    question: 'Quantos patinhos chegaram à margem segura?',
    groups: [{ icon: 'duckling', count: 5, label: 'patinhos' }],
    answer: 5,
    options: [3, 5, 6],
    hints: [
      'Aponta com o dedo para cada patinho da esquerda para a direita.',
      'A Athenas ajudou a numerar os patinhos: olha para o último número!',
      'Conta devagar: 1, 2, 3, 4, 5. São 5 patinhos!',
    ],
    explanation: 'São 5 patinhos juntos e seguros junto ao ninho!',
  },
  {
    question: 'Quantos sapinhos verdes estão a descansar nas pedras?',
    groups: [{ icon: 'frog', count: 7, label: 'sapinhos' }],
    answer: 7,
    options: [6, 7, 8],
    hints: [
      'Conta primeiro os sapinhos de cima e depois os de baixo.',
      'Olha para o número marcado em cima do último sapinho.',
      'Ao todo são 7 sapinhos a apanhar sol!',
    ],
    explanation: 'Contámos 7 sapinhos! Todos os animais do riacho estão bem.',
  },
];

const ROUNDS_HARD: CountRound[] = [
  {
    question:
      'Estão 6 patinhos amarelos e 5 sapinhos verdes junto à ponte. Quantos animais são ao todo?',
    groups: [
      { icon: 'duckling', count: 6, label: 'patinhos' },
      { icon: 'frog', count: 5, label: 'sapinhos' },
    ],
    answer: 11,
    options: [9, 11, 12, 13],
    hints: [
      'Conta primeiro a fila dos patinhos (6) e continua a contar pelos sapinhos!',
      '6 mais 4 dá 10... e falta somar mais 1 sapinho!',
      '6 + 5 = 11 animais no total!',
    ],
    explanation: '6 patinhos + 5 sapinhos = 11 animais felizes na margem!',
  },
  {
    question:
      'Na outra margem há 8 flores cor-de-rosa e 6 borboletas. Quantos elementos são no total?',
    groups: [
      { icon: 'flower_pink', count: 8, label: 'flores' },
      { icon: 'butterfly', count: 6, label: 'borboletas' },
    ],
    answer: 14,
    options: [12, 13, 14, 15],
    hints: [
      'Começa nas 8 flores e junta as 6 borboletas uma a uma.',
      '8 mais 2 dá 10, e ainda sobram 4 borboletas!',
      '10 + 4 = 14 elementos ao todo!',
    ],
    explanation: '8 flores + 6 borboletas = 14! Já podemos seguir para o jardim.',
  },
];

export const CountingPuzzle: React.FC<CountingPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const rounds = ageGroup === '5-7' ? ROUNDS_EASY : ROUNDS_HARD;
  const [roundIdx, setRoundIdx] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [solved, setSolved] = useState(false);

  const current = rounds[roundIdx];

  const handleAnswer = (val: number) => {
    if (solved) return;
    if (val === current.answer) {
      sound.playSuccess();
      setSolved(true);
      setCurrentHint(null);
      setDogNote(null);
      setExplanation(current.explanation);
      setFeedback({
        text: `Exato! São mesmo ${current.answer}!`,
        tone: 'success',
      });
      setTimeout(() => {
        if (roundIdx + 1 < rounds.length) {
          setRoundIdx(roundIdx + 1);
          setSolved(false);
          setShowNumbers(false);
          setHintsUsed(0);
          setExplanation(null);
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1250);
    } else {
      sound.playGentleTryAgain();
      onGentleRetry?.();
      setFeedback({
        text: `Quase! ${val} não é o total certo. Podes contar outra vez devagarinho!`,
        tone: 'gentle',
      });
    }
  };

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);
    if (nextNum >= 2) {
      setShowNumbers(true);
    }
    const notes = [
      'Athenas senta-se quieta na margem a olhar para os animais.',
      'Athenas olha do primeiro ao último desenho sem se mexer.',
      'Athenas inclina a cabeça contente quando chegas ao último número.',
    ];
    setDogNote(notes[nextNum - 1]);
    setCurrentHint(current.hints[nextNum - 1]);
  };

  const handleCalmSolution = () => {
    setShowNumbers(true);
    setExplanation(current.explanation);
    setFeedback({
      text: `A Esmeralda conta contigo pelos números: o total é ${current.answer}. Toca no botão ${current.answer}!`,
      tone: 'gentle',
    });
  };

  let runningIndex = 0;

  return (
    <div>
      <PuzzleInstruction
        goal="Confirmar que todos os animais estão seguros na margem."
        roundLabel={`Contagem ${roundIdx + 1} de ${rounds.length}`}
        instruction={current.question}
      />

      <div className="p-5 rounded-3xl bg-[#E0F7FA] border-2 border-[#67E8F9] mb-6 space-y-4">
        {current.groups.map((grp, gIdx) => (
          <div key={gIdx} className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: grp.count }).map((_, i) => {
              runningIndex += 1;
              const num = runningIndex;
              return (
                <div
                  key={i}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 border border-[#A5F3FC] flex items-center justify-center shadow-sm"
                >
                  <NatureItemIcon id={grp.icon} size={42} />
                  {showNumbers && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#7C3AED] text-white text-xs font-extrabold flex items-center justify-center tabular-nums shadow">
                      {num}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {current.options.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleAnswer(num)}
            disabled={solved}
            className="min-w-[84px] min-h-[64px] px-6 py-3 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#CBD5E1] hover:border-[#10B981] font-display text-3xl font-bold text-[#1E2B2A] tabular-nums shadow-sm transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0D9488]"
          >
            {num}
          </button>
        ))}
      </div>

      <HelperBar
        character="athenas"
        buttonLabel="Contar com a Athenas"
        hintsUsed={hintsUsed}
        currentHint={currentHint}
        dogBehaviorNote={dogNote}
        feedbackText={feedback?.text ?? null}
        feedbackTone={feedback?.tone}
        explanationText={explanation}
        onRequestHint={handleHint}
        onShowCalmSolution={handleCalmSolution}
        disabled={solved}
      />
    </div>
  );
};
