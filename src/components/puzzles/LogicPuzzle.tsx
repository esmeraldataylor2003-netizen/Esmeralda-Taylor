import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface LogicPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface Animal {
  id: NatureIconId;
  name: string;
}

interface House {
  id: string;
  name: string;
  bg: string;
  border: string;
  correctAnimal: NatureIconId;
  reason: string;
}

const EASY_DATA: {
  animals: Animal[];
  houses: House[];
  clues: string[];
  hints: [string, string, string];
  explanation: string;
} = {
  animals: [
    { id: 'squirrel', name: 'Esquilo' },
    { id: 'rabbit', name: 'Coelho' },
    { id: 'hedgehog', name: 'Ouriço' },
  ],
  houses: [
    {
      id: 'verde',
      name: 'Casa Verde',
      bg: 'bg-[#DCFCE7]',
      border: 'border-[#22C55E]',
      correctAnimal: 'squirrel',
      reason: 'a pista 1 diz que o Esquilo mora na Casa Verde',
    },
    {
      id: 'azul',
      name: 'Casa Azul',
      bg: 'bg-[#E0F2FE]',
      border: 'border-[#38BDF8]',
      correctAnimal: 'rabbit',
      reason: 'se não é a Amarela nem a Verde (já ocupada), fica a Casa Azul para o Coelho',
    },
    {
      id: 'amarela',
      name: 'Casa Amarela',
      bg: 'bg-[#FEF9C3]',
      border: 'border-[#EAB308]',
      correctAnimal: 'hedgehog',
      reason: 'sobra a Casa Amarela para o Ouriço',
    },
  ],
  clues: [
    '1. O Esquilo mora na Casa Verde.',
    '2. O Coelho não mora na Casa Amarela.',
  ],
  hints: [
    'Começa pela pista 1, porque ela diz logo qual é a casa do Esquilo!',
    'Como o Esquilo fica na Casa Verde e o Coelho não vai para a Amarela, o Coelho só pode ir para a Casa Azul!',
    'E assim sobra a Casa Amarela para o Ouriço!',
  ],
  explanation:
    'Esquilo na Casa Verde, Coelho na Casa Azul e Ouriço na Casa Amarela — cada placa ficou no abrigo certo!',
};

const HARD_DATA: {
  animals: Animal[];
  houses: House[];
  clues: string[];
  hints: [string, string, string];
  explanation: string;
} = {
  animals: [
    { id: 'squirrel', name: 'Esquilo' },
    { id: 'rabbit', name: 'Coelho' },
    { id: 'hedgehog', name: 'Ouriço' },
    { id: 'fox', name: 'Raposa' },
  ],
  houses: [
    {
      id: 'verde',
      name: 'Casa Verde',
      bg: 'bg-[#DCFCE7]',
      border: 'border-[#22C55E]',
      correctAnimal: 'hedgehog',
      reason: 'sobra a Casa Verde para o Ouriço',
    },
    {
      id: 'azul',
      name: 'Casa Azul',
      bg: 'bg-[#E0F2FE]',
      border: 'border-[#38BDF8]',
      correctAnimal: 'rabbit',
      reason: 'a pista 1 diz que o Coelho mora na Casa Azul',
    },
    {
      id: 'amarela',
      name: 'Casa Amarela',
      bg: 'bg-[#FEF9C3]',
      border: 'border-[#EAB308]',
      correctAnimal: 'squirrel',
      reason: 'como o Esquilo não mora na Verde, só lhe resta a Casa Amarela',
    },
    {
      id: 'rosa',
      name: 'Casa Rosa',
      bg: 'bg-[#FCE7F3]',
      border: 'border-[#EC4899]',
      correctAnimal: 'fox',
      reason: 'a pista 2 diz que a Raposa gosta da Casa Rosa',
    },
  ],
  clues: [
    '1. O Coelho mora na Casa Azul.',
    '2. A Raposa gosta da Casa Rosa.',
    '3. O Esquilo não mora na Casa Verde.',
  ],
  hints: [
    'As pistas 1 e 2 são diretas: coloca primeiro o Coelho (Azul) e a Raposa (Rosa).',
    'Agora só ficam vazias a Casa Verde e a Casa Amarela! Lê a pista 3 sobre o Esquilo.',
    'Como o Esquilo não mora na Casa Verde, ele vai para a Amarela e o Ouriço fica na Verde!',
  ],
  explanation:
    'Coelho na Azul, Raposa na Rosa, Esquilo na Amarela e Ouriço na Verde — deduzimos tudo passo a passo!',
};

export const LogicPuzzle: React.FC<LogicPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const data = ageGroup === '5-7' ? EASY_DATA : HARD_DATA;
  const [selectedAnimal, setSelectedAnimal] = useState<NatureIconId | null>(null);
  const [placements, setPlacements] = useState<Record<string, NatureIconId | null>>({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [solved, setSolved] = useState(false);

  const placedAnimals = Object.values(placements).filter(Boolean) as NatureIconId[];

  const handleAnimalSelect = (id: NatureIconId) => {
    if (solved) return;
    sound.playTap();
    setSelectedAnimal((prev) => (prev === id ? null : id));
    setFeedback(null);
  };

  const handleHouseClick = (house: House) => {
    if (solved) return;
    if (!selectedAnimal) {
      if (placements[house.id]) {
        sound.playTap();
        setPlacements((prev) => ({ ...prev, [house.id]: null }));
      } else {
        setFeedback({
          text: 'Primeiro toca num animalzinho em baixo e depois escolhe a casinha dele!',
          tone: 'gentle',
        });
      }
      return;
    }

    sound.playTap();
    const updated: Record<string, NatureIconId | null> = { ...placements };
    for (const k of Object.keys(updated)) {
      if (updated[k] === selectedAnimal) {
        updated[k] = null;
      }
    }
    updated[house.id] = selectedAnimal;
    setPlacements(updated);
    setSelectedAnimal(null);

    const allFilled = data.houses.every((h) => updated[h.id]);
    if (allFilled) {
      const allCorrect = data.houses.every(
        (h) => updated[h.id] === h.correctAnimal
      );
      if (allCorrect) {
        sound.playSuccess();
        setSolved(true);
        setExplanation(data.explanation);
        setFeedback({
          text: 'Todos os bichinhos do jardim têm agora a placa certa na sua casa!',
          tone: 'success',
        });
        setTimeout(() => onComplete(), 1250);
      } else {
        sound.playGentleTryAgain();
        onGentleRetry?.();
        setFeedback({
          text: 'Quase! Relê as pistas da horta com calma — toca numa casinha para trocar o animal se precisares.',
          tone: 'gentle',
        });
      }
    }
  };

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);
    const notes = [
      'Lucky fareja as notas do caderno do jardim e abana a cauda.',
      'Lucky olha alternadamente para as duas casinhas que ainda faltam.',
      'Lucky senta-se junto à casinha certa e encosta a pata.',
    ];
    setDogNote(notes[nextNum - 1]);
    setCurrentHint(data.hints[nextNum - 1]);
  };

  const handleCalmSolution = () => {
    const missingHouse = data.houses.find(
      (h) => placements[h.id] !== h.correctAnimal
    );
    if (!missingHouse) return;
    const animalName = data.animals.find(
      (a) => a.id === missingHouse.correctAnimal
    )?.name;
    const updated = { ...placements };
    for (const k of Object.keys(updated)) {
      if (updated[k] === missingHouse.correctAnimal) {
        updated[k] = null;
      }
    }
    updated[missingHouse.id] = missingHouse.correctAnimal;
    setPlacements(updated);
    setSelectedAnimal(null);
    setFeedback({
      text: `A Larissa ajuda: ${animalName} vai para a ${missingHouse.name}, porque ${missingHouse.reason}!`,
      tone: 'gentle',
    });

    const allCorrect = data.houses.every(
      (h) => updated[h.id] === h.correctAnimal
    );
    if (allCorrect) {
      sound.playSuccess();
      setSolved(true);
      setExplanation(data.explanation);
      setTimeout(() => onComplete(), 1300);
    }
  };

  return (
    <div>
      <PuzzleInstruction
        goal="Colocar cada animal na sua casinha segundo as pistas do jardim."
        instruction="Toca num animal em baixo e depois na casinha que combina com as notas do caderno!"
      />

      <div className="p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A] mb-5 space-y-1.5">
        <p className="text-sm font-extrabold text-[#92400E]">
          Notas do Caderno do Jardim:
        </p>
        {data.clues.map((clue, idx) => (
          <p key={idx} className="text-base font-bold text-[#451A03]">
            {clue}
          </p>
        ))}
      </div>

      <div
        className={`grid gap-3 mb-5 ${
          data.houses.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {data.houses.map((house) => {
          const occupant = placements[house.id];
          const occupantData = data.animals.find((a) => a.id === occupant);
          return (
            <button
              key={house.id}
              type="button"
              onClick={() => handleHouseClick(house)}
              disabled={solved}
              className={`min-h-[124px] p-3 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-transform duration-150 cursor-pointer active:scale-95 ${
                house.bg
              } ${house.border} ${
                selectedAnimal ? 'ring-2 ring-[#0D9488]/40 hover:scale-[1.02]' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#1E2B2A]">
                <Home className="w-4 h-4" />
                <span>{house.name}</span>
              </div>
              {occupant && occupantData ? (
                <div className="flex flex-col items-center animate-pop">
                  <NatureItemIcon id={occupant} size={46} />
                  <span className="text-xs font-extrabold text-[#1E2B2A]">
                    {occupantData.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-[#4B5E5B] px-2 py-1 rounded-lg bg-white/70">
                  {selectedAnimal ? 'Tocar aqui' : 'Vazia'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {data.animals.map((animal) => {
          const isPlaced = placedAnimals.includes(animal.id);
          const isSelected = selectedAnimal === animal.id;
          return (
            <button
              key={animal.id}
              type="button"
              onClick={() => handleAnimalSelect(animal.id)}
              disabled={solved}
              className={`min-w-[104px] min-h-[76px] px-4 py-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-transform duration-150 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#CCFBF1] border-[#0D9488] ring-4 ring-[#99F6E4] -translate-y-1'
                  : isPlaced
                  ? 'bg-[#F1F5F9] border-[#CBD5E1] opacity-55'
                  : 'bg-white hover:bg-[#F8FAFC] border-[#CBD5E1] shadow-sm'
              }`}
            >
              <NatureItemIcon id={animal.id} size={40} />
              <span className="text-xs font-extrabold text-[#1E2B2A]">
                {animal.name}
              </span>
            </button>
          );
        })}
      </div>

      <HelperBar
        character="lucky"
        buttonLabel="Pedir pista com o Lucky"
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
