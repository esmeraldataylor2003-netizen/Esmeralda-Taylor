import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface WordPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface WordRound {
  word: string;
  icon: NatureIconId;
  clue: string;
  extraLetters: string[];
  hints: [string, string, string];
  explanation: string;
}

const WORDS_EASY: WordRound[] = [
  {
    word: 'SOL',
    icon: 'flower_sun',
    clue: 'Brilha quentinho no céu durante o dia!',
    extraLetters: ['M', 'A'],
    hints: [
      'A palavra tem só 3 letras e começa com o som "Ssss" de Sol!',
      'A letra do meio é uma vogal redondinha: "O".',
      'Junta S + O + L para formar SOL!',
    ],
    explanation: 'SOL escreve-se S-O-L e indica o lado ensolarado da colina!',
  },
  {
    word: 'FLOR',
    icon: 'flower_pink',
    clue: 'Tem pétalas coloridas e cresce no jardim!',
    extraLetters: ['B', 'T'],
    hints: [
      'Começa com a letra "F", como em Foca e Folha!',
      'Depois do F vem o L, e no fim termina com O-R.',
      'As letras por ordem são F - L - O - R!',
    ],
    explanation: 'FLOR completa a placa do jardim das flores!',
  },
];

const WORDS_HARD: WordRound[] = [
  {
    word: 'BOSQUE',
    icon: 'leaf_gold',
    clue: 'Lugar cheio de árvores onde começou a aventura!',
    extraLetters: ['R', 'P'],
    hints: [
      'Começa com "B" e termina com "E" — foi o primeiro lugar do nosso mapa!',
      'As três primeiras letras formam "BOS...".',
      'Depois de BOS vem Q - U - E para formar BOSQUE!',
    ],
    explanation: 'BOSQUE escreve-se B-O-S-Q-U-E e marca a placa de regresso ao bosque!',
  },
  {
    word: 'ESTRELA',
    icon: 'star',
    clue: 'Dá nome à grande árvore do ponto final do passeio!',
    extraLetters: ['M', 'O'],
    hints: [
      'Começa com "E" e tem 7 letras no total.',
      'As quatro primeiras letras são E - S - T - R.',
      'Termina com "-ELA": E - S - T - R - E - L - A!',
    ],
    explanation: 'ESTRELA indica o caminho certo até à Árvore das Estrelas!',
  },
];

interface Tile {
  id: number;
  letter: string;
}

export const WordPuzzle: React.FC<WordPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const rounds = ageGroup === '5-7' ? WORDS_EASY : WORDS_HARD;
  const [roundIdx, setRoundIdx] = useState(0);
  const current = rounds[roundIdx];

  const tiles: Tile[] = useMemo(() => {
    const all = [...current.word.split(''), ...current.extraLetters];
    return all
      .map((letter, idx) => ({ letter, sort: (idx * 7 + 3) % all.length }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, id) => ({ id, letter: item.letter }));
  }, [current]);

  const [slots, setSlots] = useState<(Tile | null)[]>(() =>
    Array(current.word.length).fill(null)
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [solved, setSolved] = useState(false);

  const resetForRound = (nextIdx: number) => {
    setRoundIdx(nextIdx);
    setSlots(Array(rounds[nextIdx].word.length).fill(null));
    setHintsUsed(0);
    setCurrentHint(null);
    setDogNote(null);
    setExplanation(null);
    setFeedback(null);
    setSolved(false);
  };

  const usedIds = slots.filter(Boolean).map((t) => t!.id);

  const checkWord = (nextSlots: (Tile | null)[]) => {
    if (nextSlots.some((s) => s === null)) return;
    const formed = nextSlots.map((s) => s!.letter).join('');
    if (formed === current.word) {
      sound.playSuccess();
      setSolved(true);
      setCurrentHint(null);
      setDogNote(null);
      setExplanation(current.explanation);
      setFeedback({
        text: `Fantástico! Formaste a palavra ${current.word}!`,
        tone: 'success',
      });
      setTimeout(() => {
        if (roundIdx + 1 < rounds.length) {
          resetForRound(roundIdx + 1);
        } else {
          onComplete();
        }
      }, 1250);
    } else {
      sound.playGentleTryAgain();
      onGentleRetry?.();
      setFeedback({
        text: `Quase! "${formed}" não é a palavra da placa. Toca numa letra em cima para tirar e tentar outra.`,
        tone: 'gentle',
      });
    }
  };

  const handleTileClick = (tile: Tile) => {
    if (solved || usedIds.includes(tile.id)) return;
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    sound.playTap();
    const nextSlots = [...slots];
    nextSlots[emptyIdx] = tile;
    setSlots(nextSlots);
    setFeedback(null);
    checkWord(nextSlots);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (solved || !slots[slotIdx]) return;
    sound.playTap();
    const nextSlots = [...slots];
    nextSlots[slotIdx] = null;
    setSlots(nextSlots);
    setFeedback(null);
  };

  const handleHint = () => {
    if (solved) return;
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);
    const notes = [
      'Lucky olha curioso para os blocos de madeira no chão.',
      'Lucky cheira os blocos com vogais e abana a cauda.',
      'Lucky empurra com o focinho o próximo bloco certo.',
    ];
    setDogNote(notes[nextNum - 1]);
    setCurrentHint(current.hints[nextNum - 1]);
  };

  const handleCalmSolution = () => {
    const targetIdx = slots.findIndex(
      (s, i) => s === null || s.letter !== current.word[i]
    );
    if (targetIdx === -1) return;
    const neededLetter = current.word[targetIdx];
    const availableTile =
      tiles.find((t) => t.letter === neededLetter && !usedIds.includes(t.id)) ||
      tiles.find((t) => t.letter === neededLetter);
    if (!availableTile) return;

    const nextSlots = slots.map((s) =>
      s && s.id === availableTile.id ? null : s
    );
    nextSlots[targetIdx] = availableTile;
    setSlots(nextSlots);
    setFeedback({
      text: `A Larissa colocou a letra "${neededLetter}" na casa ${targetIdx + 1} para te ajudar!`,
      tone: 'gentle',
    });
    checkWord(nextSlots);
  };

  return (
    <div>
      <PuzzleInstruction
        goal="Restaurar as placas de madeira para indicar o caminho da colina."
        roundLabel={`Placa ${roundIdx + 1} de ${rounds.length}`}
        instruction="Toca nos blocos de letras para montar a palavra da placa!"
      />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl bg-[#F4EFE2] border border-[#E2DAC3] mb-5">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5DEC9] flex items-center justify-center shrink-0">
          <NatureItemIcon id={current.icon} size={46} />
        </div>
        <p className="text-base sm:text-lg font-bold text-[#1E2B2A] text-center sm:text-left">
          Pista da placa: {current.clue}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
        {slots.map((slot, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSlotClick(idx)}
            aria-label={slot ? `Tirar letra ${slot.letter}` : `Espaço ${idx + 1}`}
            className={`w-13 h-14 sm:w-15 sm:h-16 rounded-2xl border-2 font-display text-2xl sm:text-3xl font-bold flex items-center justify-center transition-transform duration-150 cursor-pointer ${
              slot
                ? solved
                  ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                  : 'bg-[#FEF3C7] border-[#D97706] text-[#78350F] hover:scale-95 shadow-sm'
                : 'bg-white border-dashed border-[#94A3B8] text-[#94A3B8]'
            }`}
          >
            {slot ? slot.letter : ''}
          </button>
        ))}

        {slots.some(Boolean) && !solved && (
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setSlots(Array(current.word.length).fill(null));
              setFeedback(null);
            }}
            aria-label="Limpar letras"
            className="w-12 h-12 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {tiles.map((tile) => {
          const isUsed = usedIds.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleTileClick(tile)}
              disabled={isUsed || solved}
              className={`w-13 h-14 sm:w-15 sm:h-16 rounded-2xl border-2 font-display text-2xl sm:text-3xl font-bold flex items-center justify-center transition-transform duration-150 cursor-pointer active:scale-95 ${
                isUsed
                  ? 'bg-[#F1F5F9] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'
                  : 'bg-white hover:bg-[#CCFBF1] border-[#0D9488] text-[#0F766E] shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      <HelperBar
        character="lucky"
        buttonLabel="Ver bloco do Lucky"
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
