import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface ObservationPuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

interface ObsCell {
  uid: number;
  icon: NatureIconId;
  label: string;
}

const ITEMS_EASY: { icon: NatureIconId; label: string }[] = [
  { icon: 'compass', label: 'Bússola' },
  { icon: 'acorn', label: 'Bolota' },
  { icon: 'mushroom_blue', label: 'Cogumelo Azul' },
  { icon: 'leaf_gold', label: 'Folha Dourada' },
  { icon: 'flower_pink', label: 'Flor Rosa' },
  { icon: 'ladybug', label: 'Joaninha' },
  { icon: 'pinecone', label: 'Pinha' },
  { icon: 'frog', label: 'Sapo' },
  { icon: 'butterfly', label: 'Borboleta' },
];

const ITEMS_HARD: { icon: NatureIconId; label: string }[] = [
  { icon: 'compass', label: 'Bússola' },
  { icon: 'acorn', label: 'Bolota' },
  { icon: 'mushroom_blue', label: 'Cogumelo Azul' },
  { icon: 'mushroom_red', label: 'Cogumelo Vermelho' },
  { icon: 'leaf_gold', label: 'Folha Dourada' },
  { icon: 'leaf_green', label: 'Folha Verde' },
  { icon: 'flower_pink', label: 'Flor Rosa' },
  { icon: 'flower_sun', label: 'Girassol' },
  { icon: 'ladybug', label: 'Joaninha' },
  { icon: 'pinecone', label: 'Pinha' },
  { icon: 'frog', label: 'Sapo' },
  { icon: 'butterfly', label: 'Borboleta' },
  { icon: 'apple', label: 'Maçã' },
  { icon: 'bell', label: 'Sino Azul' },
  { icon: 'duckling', label: 'Patinho' },
  { icon: 'water_drop', label: 'Gota de Orvalho' },
];

export const ObservationPuzzle: React.FC<ObservationPuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const isEasy = ageGroup === '5-7';

  const { grid, targets, cols } = useMemo(() => {
    const source = isEasy ? ITEMS_EASY : ITEMS_HARD;
    const sorted = [...source].sort((a, b) => a.label.localeCompare(b.label));
    const order = isEasy
      ? [2, 6, 0, 4, 8, 1, 5, 3, 7]
      : [4, 11, 0, 7, 14, 2, 9, 13, 1, 6, 15, 3, 10, 5, 12, 8];
    const cells: ObsCell[] = order.map((idx, uid) => ({
      uid,
      icon: sorted[idx].icon,
      label: sorted[idx].label,
    }));

    const targetIcons: NatureIconId[] = isEasy
      ? ['compass', 'acorn', 'leaf_gold']
      : ['compass', 'mushroom_blue', 'leaf_gold', 'bell'];

    const targetList = targetIcons.map((icon) => {
      const found = cells.find((c) => c.icon === icon)!;
      return { icon: found.icon, label: found.label };
    });

    return { grid: cells, targets: targetList, cols: isEasy ? 3 : 4 };
  }, [isEasy]);

  // Step 2 for 8-10 mode: spot 1 extra item by riddle clue after finding the 4 list items
  const [step, setStep] = useState<1 | 2>(1);
  const [foundIcons, setFoundIcons] = useState<NatureIconId[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintUid, setHintUid] = useState<number | null>(null);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );

  const bonusTarget: { icon: NatureIconId; label: string } = {
    icon: 'apple',
    label: 'Maçã',
  };

  const finishPuzzle = () => {
    setExplanation(
      'Com a bússola, a folha dourada e os objetos recuperados na mochila, a Esmeralda já consegue orientar o caminho pelo bosque!'
    );
    setTimeout(() => onComplete(), 1100);
  };

  const handleCellClick = (cell: ObsCell) => {
    if (step === 1) {
      const isTarget = targets.some((t) => t.icon === cell.icon);
      if (foundIcons.includes(cell.icon)) return;

      if (isTarget) {
        const next = [...foundIcons, cell.icon];
        setFoundIcons(next);
        setHintUid(null);
        setCurrentHint(null);
        setDogNote(null);
        sound.playSuccess();
        setFeedback({
          text: `Muito bem! Encontraste: ${cell.label}!`,
          tone: 'success',
        });

        if (next.length === targets.length) {
          if (isEasy) {
            finishPuzzle();
          } else {
            setTimeout(() => {
              setStep(2);
              setHintsUsed(0);
              setHintUid(null);
              setCurrentHint(null);
              setDogNote(null);
              setFeedback({
                text: 'Excelente! Agora falta só mais uma pista especial!',
                tone: 'success',
              });
            }, 850);
          }
        }
      } else {
        sound.playGentleTryAgain();
        onGentleRetry?.();
        setFeedback({
          text: `Isso é ${cell.label}. Observa com calma a lista de desenhos lá em cima e tenta outro!`,
          tone: 'gentle',
        });
      }
    } else {
      // Step 2 (8-10 bonus clue)
      if (cell.icon === bonusTarget.icon) {
        sound.playSuccess();
        setHintUid(null);
        setFeedback({
          text: 'Acertaste! A maçã vermelha do lanche também caiu junto às flores!',
          tone: 'success',
        });
        finishPuzzle();
      } else {
        sound.playGentleTryAgain();
        onGentleRetry?.();
        setFeedback({
          text: `Isso é ${cell.label}. Procura uma fruta vermelha redondinha para o lanche!`,
          tone: 'gentle',
        });
      }
    }
  };

  const getNextTargetCell = (): ObsCell | undefined => {
    if (step === 2) {
      return grid.find((c) => c.icon === bonusTarget.icon);
    }
    const remaining = targets.find((t) => !foundIcons.includes(t.icon));
    return remaining ? grid.find((c) => c.icon === remaining.icon) : undefined;
  };

  const handleHint = () => {
    const cell = getNextTargetCell();
    if (!cell) return;
    const nextHintNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextHintNum);
    setFeedback(null);

    const row = Math.floor(cell.uid / cols) + 1;
    const col = (cell.uid % cols) + 1;

    if (nextHintNum === 1) {
      setDogNote('Athenas ergue as orelhas e olha na direção da relva.');
      setCurrentHint(
        step === 1
          ? `Procura bem pelo objeto "${cell.label}". Repara nas cores da lista!`
          : 'É uma fruta vermelha que caiu da mochila do lanche!'
      );
    } else if (nextHintNum === 2) {
      setDogNote('Athenas caminha devagar até perto dessa fila.');
      setCurrentHint(
        `A Athenas parou junto à linha ${row} de cima para baixo!`
      );
    } else {
      setDogNote('Athenas cheira exatamente um quadradinho e abana a cauda.');
      setHintUid(cell.uid);
      setCurrentHint(
        `Olha para o quadrado iluminado na linha ${row}, coluna ${col}!`
      );
    }
  };

  const handleCalmSolution = () => {
    const cell = getNextTargetCell();
    if (!cell) return;
    setHintUid(cell.uid);
    setFeedback({
      text: `A Esmeralda aponta com calma: ${cell.label} está no quadrado dourado! Toca nele para continuar.`,
      tone: 'gentle',
    });
  };

  return (
    <div>
      <PuzzleInstruction
        goal="Recuperar os objetos caídos da mochila na clareira."
        roundLabel={
          isEasy
            ? `Encontrados: ${foundIcons.length} de ${targets.length}`
            : step === 1
            ? `Passo 1 de 2 · Encontrados: ${foundIcons.length} de ${targets.length}`
            : 'Passo 2 de 2 · Pista Extra'
        }
        instruction={
          step === 1
            ? 'Observa o relvado e toca nos objetos que estão na lista de procura!'
            : 'Encontra a fruta vermelha que caiu da lancheira para não deixar nada no bosque!'
        }
      />

      {step === 1 && (
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#F4EFE2] border border-[#E2DAC3] mb-5">
          <span className="text-sm font-extrabold text-[#4B5E5B] mr-1">
            Procurar:
          </span>
          {targets.map((target) => {
            const isFound = foundIcons.includes(target.icon);
            return (
              <div
                key={target.icon}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all duration-150 ${
                  isFound
                    ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                    : 'bg-white border-[#E5DEC9] text-[#1E2B2A]'
                }`}
              >
                <NatureItemIcon id={target.icon} size={30} />
                <span className="font-bold text-sm">{target.label}</span>
                {isFound && <Check className="w-4 h-4 text-[#059669] stroke-[3]" />}
              </div>
            );
          })}
        </div>
      )}

      <div
        className={`grid gap-3 max-w-xl mx-auto ${
          isEasy ? 'grid-cols-3' : 'grid-cols-4'
        }`}
      >
        {grid.map((cell) => {
          const isFound =
            step === 1
              ? foundIcons.includes(cell.icon)
              : targets.some((t) => t.icon === cell.icon);
          const isHinted = hintUid === cell.uid;
          return (
            <button
              key={cell.uid}
              type="button"
              onClick={() => handleCellClick(cell)}
              aria-label={cell.label}
              className={`relative min-h-[76px] sm:min-h-[88px] rounded-2xl flex flex-col items-center justify-center p-2 border-2 transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0D9488] ${
                isFound
                  ? 'bg-[#D1FAE5] border-[#10B981] scale-95 opacity-80'
                  : isHinted
                  ? 'bg-[#FEF3C7] border-[#F59E0B] ring-4 ring-[#FDE68A] scale-105'
                  : 'bg-white hover:bg-[#F0FDF4] border-[#DCE8DC] shadow-sm hover:scale-[1.03]'
              }`}
            >
              <NatureItemIcon id={cell.icon} size={isEasy ? 52 : 44} />
              {isFound && (
                <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
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
      />
    </div>
  );
};
