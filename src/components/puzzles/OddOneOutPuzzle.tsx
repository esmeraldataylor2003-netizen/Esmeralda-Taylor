import React, { useState } from 'react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface OddOneOutPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface OddRound {
  question: string;
  items: { icon: NatureIconId; label: string; isOdd: boolean }[];
  hints: [string, string, string];
  explanation: string;
}

const ROUNDS_EASY: OddRound[] = [
  {
    question: 'Qual destes desenhos NÃO é uma fruta do cesto do lanche?',
    items: [
      { icon: 'apple', label: 'Maçã', isOdd: false },
      { icon: 'strawberry', label: 'Morango', isOdd: false },
      { icon: 'banana', label: 'Banana', isOdd: false },
      { icon: 'bell', label: 'Sino', isOdd: true },
    ],
    hints: [
      'Olha para o que podemos comer à hora do lanche!',
      'Maçã, Morango e Banana são frutas frescas.',
      'O Sino não se come — é o objeto diferente!',
    ],
    explanation: 'O Sino pertence ao trilho e os outros três são frutas do lanche!',
  },
];

const ROUNDS_HARD: OddRound[] = [
  {
    question: 'Qual destes elementos NÃO pertence ao ambiente do riacho?',
    items: [
      { icon: 'duckling', label: 'Patinho', isOdd: false },
      { icon: 'frog', label: 'Sapo', isOdd: false },
      { icon: 'water_drop', label: 'Gota de Água', isOdd: false },
      { icon: 'lantern', label: 'Lanterna', isOdd: true },
    ],
    hints: [
      'Pensa em qual lugar do mapa viste o Patinho e o Sapo.',
      'Três desenhos têm tudo a ver com água do riacho!',
      'A Lanterna é para iluminar a árvore ao entardecer!',
    ],
    explanation:
      'A Lanterna ilumina o caminho da Árvore das Estrelas, enquanto os outros três pertencem ao riacho!',
  },
  {
    question: 'Qual destes objetos foi feito por pessoas e NÃO nasce nas plantas?',
    items: [
      { icon: 'leaf_green', label: 'Folha', isOdd: false },
      { icon: 'acorn', label: 'Bolota', isOdd: false },
      { icon: 'flower_sun', label: 'Girassol', isOdd: false },
      { icon: 'compass', label: 'Bússola', isOdd: true },
    ],
    hints: [
      'Procura os três elementos que crescem em árvores ou flores.',
      'A Folha, a Bolota e o Girassol nascem na natureza.',
      'A Bússola é um instrumento da mochila da Esmeralda!',
    ],
    explanation:
      'A Bússola ajuda a orientar o passeio, enquanto os outros três nascem da natureza!',
  },
];

export const OddOneOutPuzzle: React.FC<OddOneOutPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const rounds = ageGroup === '5-7' ? ROUNDS_EASY : ROUNDS_HARD;
  const [roundIdx, setRoundIdx] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [solved, setSolved] = useState(false);

  const current = rounds[roundIdx];

  const handlePick = (item: { icon: NatureIconId; label: string; isOdd: boolean }) => {
    if (solved) return;
    if (item.isOdd) {
      sound.playSuccess();
      setSolved(true);
      setCurrentHint(null);
      setDogNote(null);
      setExplanation(current.explanation);
      setFeedback({
        text: `Acertaste! ${item.label} é o elemento diferente!`,
        tone: 'success',
      });
      setTimeout(() => {
        if (roundIdx + 1 < rounds.length) {
          setRoundIdx(roundIdx + 1);
          setSolved(false);
          setHintsUsed(0);
          setExplanation(null);
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1300);
    } else {
      sound.playGentleTryAgain();
      onGentleRetry?.();
      setFeedback({
        text: `Hmm, ${item.label} faz parte do grupo principal. Observa o que os outros têm em comum!`,
        tone: 'gentle',
      });
    }
  };

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);
    const notes = [
      'Athenas inclina a cabeça a olhar para os quatro cartões.',
      'Athenas cheira os três desenhos parecidos e afasta-se devagar.',
      'Athenas pára exatamente à frente do desenho diferente.',
    ];
    setDogNote(notes[nextNum - 1]);
    setCurrentHint(current.hints[nextNum - 1]);
  };

  const handleCalmSolution = () => {
    const odd = current.items.find((i) => i.isOdd);
    if (!odd) return;
    setExplanation(current.explanation);
    setFeedback({
      text: `A Esmeralda explica: "${odd.label}" é o diferente! Toca nele para continuar.`,
      tone: 'gentle',
    });
  };

  return (
    <div>
      <PuzzleInstruction
        goal="Separar os objetos dos cestos para manter tudo organizado no passeio."
        roundLabel={`Classificação ${roundIdx + 1} de ${rounds.length}`}
        instruction={current.question}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {current.items.map((item) => (
          <button
            key={item.icon}
            type="button"
            onClick={() => handlePick(item)}
            disabled={solved}
            className={`min-h-[120px] p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-transform duration-150 cursor-pointer active:scale-95 ${
              solved && item.isOdd
                ? 'bg-[#D1FAE5] border-[#10B981] scale-105'
                : 'bg-white hover:bg-[#FEF3C7] border-[#E2DAC3] hover:border-[#F59E0B] shadow-sm'
            }`}
          >
            <NatureItemIcon id={item.icon} size={56} />
            <span className="font-bold text-base text-[#1E2B2A]">{item.label}</span>
          </button>
        ))}
      </div>

      <HelperBar
        character="athenas"
        buttonLabel="Observar a Athenas"
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
