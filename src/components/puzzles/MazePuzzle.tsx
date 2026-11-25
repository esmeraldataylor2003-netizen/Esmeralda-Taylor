import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Flag } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { CharacterAvatar, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface MazePuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

// 0 = stone path, 1 = deep water, 2 = duckling nest goal, 3 = checkpoint (8-10 mode)
const MAZE_EASY: number[][] = [
  [0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 1, 2],
];

const MAZE_HARD: number[][] = [
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 3, 1, 0],
  [0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 0, 0, 2],
];

interface Pos {
  r: number;
  c: number;
}

function findShortestPath(
  grid: number[][],
  start: Pos,
  targetVal: number
): Pos[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: Pos[][] = [[start]];
  const visited = new Set<string>([`${start.r},${start.c}`]);
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const curr = path[path.length - 1];
    if (grid[curr.r][curr.c] === targetVal) {
      return path;
    }
    for (const d of dirs) {
      const nr = curr.r + d.r;
      const nc = curr.c + d.c;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] !== 1 &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([...path, { r: nr, c: nc }]);
      }
    }
  }
  return [];
}

export const MazePuzzle: React.FC<MazePuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const isEasy = ageGroup === '5-7';
  const grid = isEasy ? MAZE_EASY : MAZE_HARD;
  const [pos, setPos] = useState<Pos>({ r: 0, c: 0 });
  const [gotCheckpoint, setGotCheckpoint] = useState(isEasy);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintPath, setHintPath] = useState<Pos[]>([]);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [won, setWon] = useState(false);

  useEffect(() => {
    setPos({ r: 0, c: 0 });
    setGotCheckpoint(isEasy);
    setHintsUsed(0);
    setHintPath([]);
    setCurrentHint(null);
    setDogNote(null);
    setExplanation(null);
    setFeedback(null);
    setWon(false);
  }, [isEasy]);

  const tryMove = useCallback(
    (nr: number, nc: number) => {
      if (won) return;
      if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;
      if (grid[nr][nc] === 1) {
        sound.playGentleTryAgain();
        onGentleRetry?.();
        setFeedback({
          text: 'Ali há água funda! O Lucky prefere caminhar pelas pedras secas e firmes ao lado.',
          tone: 'gentle',
        });
        return;
      }

      setPos({ r: nr, c: nc });
      setHintPath((prev) => prev.filter((p) => !(p.r === nr && p.c === nc)));
      setFeedback(null);

      if (grid[nr][nc] === 3 && !gotCheckpoint) {
        setGotCheckpoint(true);
        setHintsUsed(0);
        sound.playSuccess();
        setFeedback({
          text: 'Ótimo! Recolheste a corda guia da ponte! Agora segue até ao ninho do patinho!',
          tone: 'success',
        });
        return;
      }

      if (grid[nr][nc] === 2) {
        if (!gotCheckpoint) {
          sound.playGentleTryAgain();
          setFeedback({
            text: 'Quase! Primeiro passa pela pedra com o sino amarelo em cima para chamar os patinhos!',
            tone: 'gentle',
          });
          return;
        }
        setWon(true);
        sound.playSuccess();
        setExplanation(
          'Seguindo pedra a pedra sem pressa, o Lucky confirmou o caminho firme e todos atravessaram em segurança!'
        );
        setFeedback({
          text: 'Viva! Chegaste à outra margem com os patinhos em segurança!',
          tone: 'success',
        });
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        sound.playStep();
      }
    },
    [gotCheckpoint, grid, onComplete, onGentleRetry, won]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        tryMove(pos.r - 1, pos.c);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        tryMove(pos.r + 1, pos.c);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        tryMove(pos.r, pos.c - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        tryMove(pos.r, pos.c + 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pos, tryMove]);

  const handleHint = () => {
    const targetVal = gotCheckpoint ? 2 : 3;
    const full = findShortestPath(grid, pos, targetVal);
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);

    if (nextNum === 1) {
      setDogNote('Lucky olha para as pedras ao seu lado e abana a cauda.');
      if (full.length > 1) {
        const nextStep = full[1];
        const dir =
          nextStep.r < pos.r
            ? 'para cima'
            : nextStep.r > pos.r
            ? 'para baixo'
            : nextStep.c < pos.c
            ? 'para a esquerda'
            : 'para a direita';
        setCurrentHint(`O Lucky está a olhar ${dir}! Tenta dar um passo nessa direção.`);
      }
    } else if (nextNum === 2) {
      setDogNote('Lucky testa com a pata as próximas duas pedras secas.');
      setHintPath(full.slice(1, 3));
      setCurrentHint('Marcaámos as próximas 2 pedras firmes a amarelo!');
    } else {
      setDogNote('Lucky avança devagar pelo caminho mais curto.');
      setHintPath(full.slice(1, 5));
      setCurrentHint('Segue os pontos dourados nas pedras — são 4 passos certinhos!');
    }
  };

  const handleCalmSolution = () => {
    const targetVal = gotCheckpoint ? 2 : 3;
    const full = findShortestPath(grid, pos, targetVal);
    setHintPath(full.slice(1));
    setFeedback({
      text: 'A Larissa marcou todo o caminho seguro com pontos dourados para seguires com calma!',
      tone: 'gentle',
    });
  };

  const stoneColors = [
    'bg-[#FEF3C7] border-[#F59E0B]',
    'bg-[#FCE7F3] border-[#EC4899]',
    'bg-[#E0F2FE] border-[#38BDF8]',
    'bg-[#DCFCE7] border-[#22C55E]',
  ];

  return (
    <div>
      <PuzzleInstruction
        goal="Encontrar uma travessia segura pelas pedras secas sem pisar na água funda."
        roundLabel={
          isEasy
            ? 'Caminho direto até ao ninho'
            : gotCheckpoint
            ? 'Passo 2 de 2 · Guiar até ao ninho'
            : 'Passo 1 de 2 · Passar pelo sino amarelo'
        }
        instruction={
          isEasy
            ? 'Ajuda o Lucky a caminhar pelas pedras coloridas até ao ninho do patinho!'
            : !gotCheckpoint
            ? 'Primeiro vai até ao sino azul na pedra para reunir os patinhos, depois segue até ao ninho!'
            : 'Boa! Agora continua pelas pedras firmes até ao ninho do patinho!'
        }
      />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div
          className="p-3 sm:p-4 rounded-3xl bg-[#0EA5E9]/20 border-2 border-[#38BDF8]"
          role="grid"
          aria-label="Labirinto das pedras"
        >
          <div
            className="grid gap-1.5 sm:gap-2"
            style={{
              gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = pos.r === r && pos.c === c;
                const isAdjacent =
                  Math.abs(pos.r - r) + Math.abs(pos.c - c) === 1 && cell !== 1;
                const isHinted = hintPath.some((p) => p.r === r && p.c === c);
                const stoneStyle = stoneColors[(r + c) % stoneColors.length];

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => {
                      if (Math.abs(pos.r - r) + Math.abs(pos.c - c) === 1) {
                        tryMove(r, c);
                      } else if (cell !== 1 && !isPlayer) {
                        sound.playGentleTryAgain();
                        setFeedback({
                          text: 'Um passo de cada vez! Clica numa pedra mesmo ao lado do Lucky.',
                          tone: 'gentle',
                        });
                      }
                    }}
                    className={`relative rounded-2xl flex items-center justify-center border-2 transition-transform duration-150 ${
                      isEasy
                        ? 'w-13 h-13 sm:w-16 sm:h-16'
                        : 'w-11 h-11 sm:w-12 sm:h-12'
                    } ${
                      cell === 1
                        ? 'bg-[#38BDF8]/45 border-[#0284C7]/30 cursor-not-allowed'
                        : isPlayer
                        ? 'bg-white border-[#F97316] ring-4 ring-[#FED7AA] scale-105 z-10'
                        : isHinted
                        ? 'bg-[#FEF08A] border-[#EAB308] ring-2 ring-[#FACC15] cursor-pointer hover:scale-105'
                        : isAdjacent
                        ? `${stoneStyle} cursor-pointer hover:scale-105 shadow-sm`
                        : `${stoneStyle} opacity-90 cursor-pointer`
                    }`}
                    aria-label={
                      cell === 1
                        ? 'Água funda'
                        : cell === 2
                        ? 'Ninho do patinho'
                        : cell === 3
                        ? 'Sino de reunião'
                        : 'Pedra firme'
                    }
                  >
                    {isPlayer ? (
                      <CharacterAvatar
                        character="lucky"
                        size={isEasy ? 48 : 38}
                      />
                    ) : cell === 2 ? (
                      <NatureItemIcon
                        id="duckling"
                        size={isEasy ? 40 : 32}
                      />
                    ) : cell === 3 && !gotCheckpoint ? (
                      <NatureItemIcon id="bell" size={30} />
                    ) : cell === 1 ? (
                      <NatureItemIcon id="water_drop" size={22} className="opacity-65" />
                    ) : isHinted ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] animate-pulse" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 bg-[#F4EFE2] p-4 rounded-3xl border border-[#E2DAC3]">
          <p className="text-xs font-extrabold text-[#4B5E5B] mb-1">
            Guiar o Lucky
          </p>
          <button
            type="button"
            onClick={() => tryMove(pos.r - 1, pos.c)}
            aria-label="Mover para cima"
            className="w-14 h-14 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#CBD5E1] flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-7 h-7 text-[#0F766E]" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => tryMove(pos.r, pos.c - 1)}
              aria-label="Mover para a esquerda"
              className="w-14 h-14 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#CBD5E1] flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-7 h-7 text-[#0F766E]" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-[#E6F4F1] flex items-center justify-center">
              <Flag className="w-6 h-6 text-[#0D9488]" />
            </div>
            <button
              type="button"
              onClick={() => tryMove(pos.r, pos.c + 1)}
              aria-label="Mover para a direita"
              className="w-14 h-14 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#CBD5E1] flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-7 h-7 text-[#0F766E]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => tryMove(pos.r + 1, pos.c)}
            aria-label="Mover para baixo"
            className="w-14 h-14 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#CBD5E1] flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-7 h-7 text-[#0F766E]" />
          </button>
        </div>
      </div>

      <HelperBar
        character="lucky"
        buttonLabel="Seguir o Lucky"
        hintsUsed={hintsUsed}
        currentHint={currentHint}
        dogBehaviorNote={dogNote}
        feedbackText={feedback?.text ?? null}
        feedbackTone={feedback?.tone}
        explanationText={explanation}
        onRequestHint={handleHint}
        onShowCalmSolution={handleCalmSolution}
        disabled={won}
      />
    </div>
  );
};
