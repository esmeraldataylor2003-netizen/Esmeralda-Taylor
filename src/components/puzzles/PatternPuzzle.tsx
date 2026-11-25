import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface PatternPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface PatternRound {
  sequence: (NatureIconId | null)[];
  answers: NatureIconId[];
  options: { icon: NatureIconId; label: string }[];
  hints: [string, string, string];
  explanation: string;
}

const ROUNDS_EASY: PatternRound[] = [
  {
    sequence: ['flower_pink', 'leaf_green', 'flower_pink', 'leaf_green', 'flower_pink', null],
    answers: ['leaf_green'],
    options: [
      { icon: 'leaf_green', label: 'Folha Verde' },
      { icon: 'mushroom_red', label: 'Cogumelo' },
      { icon: 'acorn', label: 'Bolota' },
    ],
    hints: [
      'Repara nos dois desenhos que vão alternando um a seguir ao outro.',
      'A sequência faz sempre: Flor Rosa, Folha Verde, Flor Rosa, Folha Verde...',
      'Depois da última Flor Rosa falta a Folha Verde!',
    ],
    explanation:
      'O trilho alterna sempre Flor e Folha (ABAB), por isso depois da Flor vem a Folha Verde.',
  },
  {
    sequence: ['mushroom_red', 'mushroom_red', 'leaf_gold', 'mushroom_red', 'mushroom_red', null],
    answers: ['leaf_gold'],
    options: [
      { icon: 'mushroom_red', label: 'Cogumelo' },
      { icon: 'leaf_gold', label: 'Folha Dourada' },
      { icon: 'flower_sun', label: 'Girassol' },
    ],
    hints: [
      'Conta quantos cogumelos aparecem juntos antes de mudar de desenho.',
      'São dois cogumelos vermelhos seguidos de uma folha dourada!',
      'Já temos os dois cogumelos vermelhos no fim — falta a Folha Dourada!',
    ],
    explanation:
      'Cada grupo tem dois Cogumelos e depois uma Folha Dourada, mantendo o caminho organizado.',
  },
];

const ROUNDS_HARD: PatternRound[] = [
  {
    sequence: ['flower_pink', 'leaf_gold', 'acorn', 'flower_pink', 'leaf_gold', null],
    answers: ['acorn'],
    options: [
      { icon: 'flower_pink', label: 'Flor Rosa' },
      { icon: 'leaf_gold', label: 'Folha Dourada' },
      { icon: 'acorn', label: 'Bolota' },
      { icon: 'mushroom_blue', label: 'Cogumelo Azul' },
    ],
    hints: [
      'Procura um grupo de três desenhos diferentes que se repete igual.',
      'O trio é: Flor Rosa -> Folha Dourada -> Bolota.',
      'Já temos Flor Rosa e Folha Dourada no fim; falta a Bolota!',
    ],
    explanation:
      'O ritmo repete o trio Flor, Folha Dourada e Bolota (ABC), completando as pedras até à ponte.',
  },
  {
    sequence: ['star', 'leaf_green', 'leaf_green', 'star', null, null],
    answers: ['leaf_green', 'leaf_green'],
    options: [
      { icon: 'star', label: 'Estrela' },
      { icon: 'leaf_green', label: 'Folha Verde' },
      { icon: 'butterfly', label: 'Borboleta' },
      { icon: 'acorn', label: 'Bolota' },
    ],
    hints: [
      'Neste último trecho faltam duas pedras! Observa o que vem depois da primeira estrela.',
      'Depois de cada estrela há sempre duas folhas iguais seguidas.',
      'Escolhe Folha Verde duas vezes para preencher os dois espaços!',
    ],
    explanation:
      'Depois de cada Estrela vêm sempre duas Folhas Verdes (ABB), abrindo a passagem para a ponte!',
  },
];

export const PatternPuzzle: React.FC<PatternPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const rounds = ageGroup === '5-7' ? ROUNDS_EASY : ROUNDS_HARD;
  const [roundIdx, setRoundIdx] = useState(0);
  const [filledAnswers, setFilledAnswers] = useState<NatureIconId[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [explanation, setExplanation] = useState<string | null>(null);
  const [solvedCurrent, setSolvedCurrent] = useState(false);

  const current = rounds[roundIdx];

  const handlePick = (icon: NatureIconId, label: string) => {
    if (solvedCurrent) return;
    const expected = current.answers[filledAnswers.length];

    if (icon === expected) {
      sound.playSuccess();
      const nextFilled = [...filledAnswers, icon];
      setFilledAnswers(nextFilled);
      setCurrentHint(null);
      setDogNote(null);

      if (nextFilled.length === current.answers.length) {
        setSolvedCurrent(true);
        setExplanation(current.explanation);
        setFeedback({
          text: `Certo! ${label} completa o trilho até à ponte!`,
          tone: 'success',
        });
        setTimeout(() => {
          if (roundIdx + 1 < rounds.length) {
            setRoundIdx(roundIdx + 1);
            setFilledAnswers([]);
            setHintsUsed(0);
            setSolvedCurrent(false);
            setExplanation(null);
            setFeedback(null);
          } else {
            onComplete();
          }
        }, 1250);
      } else {
        setFeedback({
          text: `Boa! ${label} está certo. Agora escolhe o último espaço!`,
          tone: 'success',
        });
      }
    } else {
      sound.playGentleTryAgain();
      onGentleRetry?.();
      setFeedback({
        text: `Quase! ${label} quebra o ritmo das pedras. Observa o grupo inicial e tenta outro!`,
        tone: 'gentle',
      });
    }
  };

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);
    const notes = [
      'Lucky olha para as pedras do início do trilho e abana a cauda.',
      'Lucky trota devagar ao lado do ritmo das marcas.',
      'Lucky senta-se junto ao espaço vazio e encosta a pata no chão.',
    ];
    setDogNote(notes[nextNum - 1]);
    setCurrentHint(current.hints[nextNum - 1]);
  };

  const handleCalmSolution = () => {
    const expected = current.answers[filledAnswers.length];
    const opt = current.options.find((o) => o.icon === expected);
    if (!opt) return;
    setExplanation(current.explanation);
    setFeedback({
      text: `A Larissa explica: a peça certa aqui é "${opt.label}". Toca nela para avançar!`,
      tone: 'gentle',
    });
  };

  let missingCursor = 0;

  return (
    <div>
      <PuzzleInstruction
        goal="Alinhar as marcas das pedras para seguir pelo trilho certo."
        roundLabel={`Sequência ${roundIdx + 1} de ${rounds.length}`}
        instruction={
          current.answers.length > 1
            ? 'Completa os dois espaços vazios seguindo o ritmo dos desenhos!'
            : 'Qual desenho completa a sequência do caminho?'
        }
      />

      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-4 sm:p-5 rounded-2xl bg-[#F4EFE2] border border-[#E2DAC3] mb-6">
        {current.sequence.map((item, idx) => {
          const isMissing = item === null;
          let displayIcon = item;
          let filledNow = false;
          if (isMissing) {
            const filledVal = filledAnswers[missingCursor];
            missingCursor += 1;
            if (filledVal) {
              displayIcon = filledVal;
              filledNow = true;
            }
          }

          return (
            <div
              key={idx}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                isMissing
                  ? filledNow
                    ? 'bg-[#D1FAE5] border-[#10B981] scale-105'
                    : 'bg-[#FFFBEB] border-dashed border-[#F59E0B]'
                  : 'bg-white border-[#E5DEC9]'
              }`}
            >
              {displayIcon ? (
                <NatureItemIcon id={displayIcon} size={42} />
              ) : (
                <HelpCircle className="w-8 h-8 text-[#D97706]" />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center font-bold text-[#4B5E5B] mb-3">
        Escolhe a peça certa:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {current.options.map((opt) => (
          <button
            key={opt.icon}
            type="button"
            onClick={() => handlePick(opt.icon, opt.label)}
            disabled={solvedCurrent}
            className="min-w-[120px] min-h-[96px] px-4 py-3 rounded-2xl border-2 bg-white hover:bg-[#ECFDF5] border-[#D1D5DB] hover:border-[#10B981] shadow-sm hover:-translate-y-0.5 flex flex-col items-center justify-center gap-1.5 transition-transform duration-150 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0D9488]"
          >
            <NatureItemIcon id={opt.icon} size={46} />
            <span className="font-bold text-sm text-[#1E2B2A]">{opt.label}</span>
          </button>
        ))}
      </div>

      <HelperBar
        character="lucky"
        buttonLabel="Ver o Lucky"
        hintsUsed={hintsUsed}
        currentHint={currentHint}
        dogBehaviorNote={dogNote}
        feedbackText={feedback?.text ?? null}
        feedbackTone={feedback?.tone}
        explanationText={explanation}
        onRequestHint={handleHint}
        onShowCalmSolution={handleCalmSolution}
        disabled={solvedCurrent}
      />
    </div>
  );
};
