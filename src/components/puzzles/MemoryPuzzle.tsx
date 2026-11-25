import React, { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { AgeGroup, CharacterId } from '../../types/game';
import { CharacterAvatar, NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface MemoryPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface MemoryCard {
  uid: number;
  pairId: string;
  label: string;
  character?: CharacterId;
  icon?: NatureIconId;
}

const PAIRS_EASY: Omit<MemoryCard, 'uid'>[] = [
  { pairId: 'esmeralda', label: 'Esmeralda', character: 'esmeralda' },
  { pairId: 'larissa', label: 'Larissa', character: 'larissa' },
  { pairId: 'athenas', label: 'Athenas', character: 'athenas' },
  { pairId: 'lucky', label: 'Lucky', character: 'lucky' },
];

const PAIRS_HARD: Omit<MemoryCard, 'uid'>[] = [
  ...PAIRS_EASY,
  { pairId: 'butterfly', label: 'Borboleta', icon: 'butterfly' },
  { pairId: 'flower_sun', label: 'Girassol', icon: 'flower_sun' },
];

function buildDeck(isEasy: boolean): MemoryCard[] {
  const base = isEasy ? PAIRS_EASY : PAIRS_HARD;
  const doubled = [...base, ...base].map((item, idx) => ({
    ...item,
    uid: idx,
  }));
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export const MemoryPuzzle: React.FC<MemoryPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const isEasy = ageGroup === '5-7';
  const [cards, setCards] = useState<MemoryCard[]>(() => buildDeck(isEasy));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [peeked, setPeeked] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );

  useEffect(() => {
    setCards(buildDeck(isEasy));
    setFlipped([]);
    setMatched([]);
    setPeeked([]);
    setLocked(false);
    setHintsUsed(0);
    setCurrentHint(null);
    setDogNote(null);
    setExplanation(null);
    setFeedback(null);
  }, [isEasy]);

  const totalPairs = isEasy ? PAIRS_EASY.length : PAIRS_HARD.length;

  const handleCardClick = (card: MemoryCard) => {
    if (locked) return;
    if (flipped.includes(card.uid) || matched.includes(card.pairId)) return;

    sound.playTap();
    const nextFlipped = [...flipped, card.uid];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      const first = cards.find((c) => c.uid === nextFlipped[0])!;
      const second = cards.find((c) => c.uid === nextFlipped[1])!;

      if (first.pairId === second.pairId) {
        setTimeout(() => {
          sound.playSuccess();
          const nextMatched = [...matched, first.pairId];
          setMatched(nextMatched);
          setFlipped([]);
          setLocked(false);
          setCurrentHint(null);
          setDogNote(null);
          setFeedback({
            text: `Par encontrado: ${first.label}!`,
            tone: 'success',
          });
          if (nextMatched.length === totalPairs) {
            setExplanation(
              'Todas as caixas de sementes têm agora a tampa certa, prontas para plantar no jardim!'
            );
            setTimeout(() => onComplete(), 1100);
          }
        }, 320);
      } else {
        setTimeout(() => {
          sound.playGentleTryAgain();
          onGentleRetry?.();
          setFlipped([]);
          setLocked(false);
          setFeedback({
            text: 'Quase! Tenta lembrar onde estava cada desenho e abre outro par com calma.',
            tone: 'gentle',
          });
        }, 850);
      }
    }
  };

  const handleHint = () => {
    if (locked) return;
    const unmatchedPairId = cards.find((c) => !matched.includes(c.pairId))?.pairId;
    if (!unmatchedPairId) return;
    const pairCards = cards.filter((c) => c.pairId === unmatchedPairId);
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);

    if (nextNum === 1) {
      const row1 = Math.floor(pairCards[0].uid / 4) + 1;
      setDogNote('Athenas cheira devagar uma das caixinhas.');
      setCurrentHint(
        `Uma das caixas de "${pairCards[0].label}" está na fila ${row1}!`
      );
    } else if (nextNum === 2) {
      setDogNote('Athenas encosta o focinho numa tampa pintada.');
      setPeeked([pairCards[0].uid]);
      setCurrentHint(`Espreitámos uma caixa de ${pairCards[0].label}! Procura a outra igual.`);
      setTimeout(() => setPeeked([]), 1600);
    } else {
      setDogNote('Athenas cheira as duas caixinhas do mesmo par.');
      setPeeked(pairCards.map((c) => c.uid));
      setCurrentHint(`Aqui está o par completo de ${pairCards[0].label}!`);
      setTimeout(() => setPeeked([]), 1900);
    }
  };

  const handleCalmSolution = () => {
    const unmatchedPairId = cards.find((c) => !matched.includes(c.pairId))?.pairId;
    if (!unmatchedPairId) return;
    const pairCards = cards.filter((c) => c.pairId === unmatchedPairId);
    setPeeked(pairCards.map((c) => c.uid));
    setFeedback({
      text: `A Esmeralda deixou aberto o par de ${pairCards[0].label} por um instante — toca nas duas!`,
      tone: 'gentle',
    });
    setTimeout(() => setPeeked([]), 2400);
  };

  return (
    <div>
      <PuzzleInstruction
        goal="Juntar os pares iguais para organizar as caixas de sementes."
        roundLabel={`Pares encontrados: ${matched.length} de ${totalPairs}`}
        instruction="Abre duas caixinhas de cada vez e encontra todos os pares com o mesmo desenho!"
      />

      <div
        className={`grid gap-3 max-w-2xl mx-auto ${
          isEasy ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const isOpen =
            flipped.includes(card.uid) ||
            matched.includes(card.pairId) ||
            peeked.includes(card.uid);
          const isMatched = matched.includes(card.pairId);

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardClick(card)}
              aria-label={isOpen ? card.label : 'Caixinha fechada'}
              className={`min-h-[88px] sm:min-h-[104px] rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-transform duration-200 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0D9488] ${
                isMatched
                  ? 'bg-[#D1FAE5] border-[#10B981]'
                  : isOpen
                  ? 'bg-white border-[#F59E0B] shadow-md scale-[1.02]'
                  : 'bg-[#FEF3C7] hover:bg-[#FDE68A] border-[#F59E0B]/60 shadow-sm'
              }`}
            >
              {isOpen ? (
                <div className="flex flex-col items-center gap-1 animate-pop">
                  {card.character ? (
                    <CharacterAvatar character={card.character} size={52} />
                  ) : card.icon ? (
                    <NatureItemIcon id={card.icon} size={46} />
                  ) : null}
                  <span className="text-xs font-extrabold text-[#1E2B2A]">
                    {card.label}
                  </span>
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-white/75 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-[#D97706]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <HelperBar
        character="athenas"
        buttonLabel="Ver a Athenas"
        hintsUsed={hintsUsed}
        currentHint={currentHint}
        dogBehaviorNote={dogNote}
        feedbackText={feedback?.text ?? null}
        feedbackTone={feedback?.tone}
        explanationText={explanation}
        onRequestHint={handleHint}
        onShowCalmSolution={handleCalmSolution}
        disabled={locked || matched.length === totalPairs}
      />
    </div>
  );
};
