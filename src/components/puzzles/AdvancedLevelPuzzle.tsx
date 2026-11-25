import React, { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Check, HelpCircle, RotateCcw } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { ADVANCED_LEVELS } from '../../data/advancedLevels';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface AdvancedLevelPuzzleProps {
  chapterId: number;
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

export const AdvancedLevelPuzzle: React.FC<AdvancedLevelPuzzleProps> = ({
  chapterId,
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const isEasy = ageGroup === '5-7';
  const meta =
    ADVANCED_LEVELS.find((l) => l.chapterId === chapterId) ?? ADVANCED_LEVELS[0];

  const [stage, setStage] = useState<1 | 2>(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [done, setDone] = useState(false);

  // Level 1: Rule Discovery + Sequence Planning
  const [lvl1Plan, setLvl1Plan] = useState<NatureIconId[]>([]);

  // Level 2: Planned Maze Arrows + Comparative Counting
  const targetMoves = isEasy
    ? (['right', 'down', 'right'] as const)
    : (['right', 'right', 'down', 'right'] as const);
  const [plannedMoves, setPlannedMoves] = useState<('up' | 'down' | 'left' | 'right')[]>([]);

  // Level 3: Memory + Comparative Watering Plan
  const lvl3Cards: { uid: number; id: NatureIconId; label: string }[] = isEasy
    ? [
        { uid: 0, id: 'flower_sun', label: 'Girassol' },
        { uid: 1, id: 'flower_pink', label: 'Flor Rosa' },
        { uid: 2, id: 'flower_sun', label: 'Girassol' },
        { uid: 3, id: 'flower_pink', label: 'Flor Rosa' },
      ]
    : [
        { uid: 0, id: 'flower_sun', label: 'Girassol' },
        { uid: 1, id: 'flower_pink', label: 'Flor Rosa' },
        { uid: 2, id: 'strawberry', label: 'Morangueiro' },
        { uid: 3, id: 'flower_pink', label: 'Flor Rosa' },
        { uid: 4, id: 'flower_sun', label: 'Girassol' },
        { uid: 5, id: 'strawberry', label: 'Morangueiro' },
      ];
  const [lvl3Open, setLvl3Open] = useState<number[]>([]);
  const [lvl3Matched, setLvl3Matched] = useState<NatureIconId[]>([]);

  // Level 4: Symbol-Letter Rule + Word Planning
  const lvl4Word = isEasy ? 'PAZ' : 'VENTO';
  const lvl4Bank = isEasy ? ['Z', 'P', 'A', 'M'] : ['T', 'V', 'N', 'E', 'O', 'R'];
  const [lvl4Typed, setLvl4Typed] = useState('');

  // Level 5: Arrangement Comparison + Final Word
  const lvl5Word = isEasy ? 'FELIZ' : 'AMIZADE';
  const lvl5Bank = isEasy
    ? ['I', 'F', 'Z', 'E', 'L', 'A']
    : ['Z', 'A', 'D', 'M', 'E', 'I', 'A', 'O'];
  const [lvl5Typed, setLvl5Typed] = useState('');

  const finishLevel = (exp: string) => {
    sound.playSuccess();
    setDone(true);
    setExplanation(exp);
    setFeedback({
      text: 'Nível Avançado concluído! Planeaste e comparaste tudo com calma!',
      tone: 'success',
    });
    setTimeout(() => onComplete(), 1300);
  };

  const gentleRetry = (msg: string) => {
    sound.playGentleTryAgain();
    onGentleRetry?.();
    setFeedback({ text: msg, tone: 'gentle' });
  };

  const nextStage = (msg: string) => {
    sound.playSuccess();
    setStage(2);
    setHintsUsed(0);
    setCurrentHint(null);
    setDogNote(null);
    setFeedback({ text: msg, tone: 'success' });
  };

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);

    if (chapterId === 1) {
      setDogNote('Athenas cheira os cartões de exemplo e depois olha para a ponte.');
      if (stage === 1) {
        const hints = isEasy
          ? [
              'Procura o cartão que tem só desenhos do bosque (Folha e Bolota).',
              'O cartão certo começa com Folha Verde e termina com Bolota.',
              'Escolhe o botão: "Começa em Folha Verde e acaba em Bolota"!',
            ]
          : [
              'Compara os dois caminhos seguros lá em cima: repara na primeira e na última peça.',
              'Ambos começam em Folha Verde e terminam em Bolota!',
              'Escolhe a regra: "Começa sempre com Folha Verde e termina com Bolota"!',
            ];
        setCurrentHint(hints[nextNum - 1]);
      } else {
        const hints = [
          'Lembra-te da regra descoberta: a primeira peça tem de ser Folha Verde.',
          isEasy
            ? 'Coloca Folha Verde, depois Estrela, e acaba em Bolota!'
            : 'Para 4 passos: começa em Folha Verde e acaba em Bolota!',
          isEasy
            ? 'Sequência: Folha Verde → Estrela → Bolota.'
            : 'Sequência segura: Folha Verde → Flor Rosa → Estrela → Bolota.',
        ];
        setCurrentHint(hints[nextNum - 1]);
      }
    } else if (chapterId === 2) {
      setDogNote('Lucky olha do início até ao patinho no outro lado.');
      if (stage === 1) {
        const hints = isEasy
          ? [
              'Olha onde o Lucky está (topo esquerdo) e segue as bolinhas douradas até ao patinho.',
              'Primeiro anda 2 casas para a Direita, depois desce 1 para Baixo e vai 1 para a Direita!',
              'Escolhe o Plano A: Direita → Direita → Baixo → Direita.',
            ]
          : [
              'Conta quantas casas há para a Direita antes da curva.',
              'São 2 passos para a Direita, depois 1 para Baixo e 1 para a Direita!',
              `A próxima seta certa é "${
                targetMoves[plannedMoves.length] === 'right'
                  ? 'Direita'
                  : targetMoves[plannedMoves.length] === 'down'
                  ? 'Baixo'
                  : 'Cima'
              }".`,
            ];
        setCurrentHint(hints[nextNum - 1]);
      } else {
        setCurrentHint(
          isEasy
            ? 'Um cesto tem 4 e o outro tem 2. Quantas faltam ao 2 para chegar a 4? Faltam 2!'
            : 'Um lado tem 7 pedrinhas e o outro tem 4. Para ficarem iguais (7 = 7), faltam 3 pedrinhas!'
        );
      }
    } else if (chapterId === 3) {
      setDogNote('Athenas cheira os girassóis e volta para o banco do jardim.');
      if (stage === 1) {
        setCurrentHint(
          'Abre dois cartões por vez para lembrar onde está cada flor do jardim!'
        );
      } else {
        setCurrentHint(
          isEasy
            ? 'O Girassol precisa de sol primeiro, por isso regamos o Girassol antes da Flor Rosa!'
            : 'Pista 1: Girassol é o 1.º. Pista 2: Morangueiro fica no fim (3.º). Logo a ordem é Girassol → Flor Rosa → Morangueiro!'
        );
      }
    } else if (chapterId === 4) {
      setDogNote('Lucky encosta a pata à placa com os desenhos das letras iniciais.');
      if (stage === 1) {
        setCurrentHint(
          isEasy
            ? 'Pato começa com P! Escolhe a letra P.'
            : 'Usa a primeira letra de cada desenho: Sol = S, Flor = F, Lua = L → S-F-L!'
        );
      } else {
        const nextChar = lvl4Word[lvl4Typed.length];
        setCurrentHint(`Toca na letra "${nextChar}" para completar ${lvl4Word}!`);
      }
    } else {
      setDogNote('Athenas observa as três filas de lanternas junto à árvore.');
      if (stage === 1) {
        setCurrentHint(
          isEasy
            ? 'Procura a fila onde há exatamente 2 estrelas e 2 lanternas!'
            : 'O Plano B tem 6 luzes no total, alterna Estrela-Lanterna e não tem objetos fora do sítio!'
        );
      } else {
        const nextChar = lvl5Word[lvl5Typed.length];
        setCurrentHint(`A próxima letra da palavra "${lvl5Word}" é "${nextChar}"!`);
      }
    }
  };

  return (
    <div>
      <PuzzleInstruction
        goal={meta.goal}
        roundLabel={`${meta.title} · Etapa ${stage} de 2`}
        instruction={meta.storyLink}
      />

      {/* LEVEL 1: Rule Discovery + Sequence Planning */}
      {chapterId === 1 && (
        <div className="space-y-5">
          {stage === 1 ? (
            <>
              <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#E2DAC3] space-y-2">
                <p className="font-bold text-sm text-[#4B5E5B]">
                  {isEasy
                    ? 'Observa estes dois caminhos e escolhe o caminho do bosque:'
                    : 'Compara estes dois exemplos de caminhos seguros para descobrir a regra:'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#10B981]">
                    <span className="text-xs font-extrabold text-[#059669]">Seguro 1:</span>
                    <NatureItemIcon id="leaf_green" size={30} />
                    <NatureItemIcon id="flower_pink" size={30} />
                    <NatureItemIcon id="acorn" size={30} />
                  </div>
                  {!isEasy && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#10B981]">
                      <span className="text-xs font-extrabold text-[#059669]">Seguro 2:</span>
                      <NatureItemIcon id="leaf_green" size={30} />
                      <NatureItemIcon id="star" size={30} />
                      <NatureItemIcon id="acorn" size={30} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isEasy
                  ? [
                      { id: 'right', label: 'Começa em Folha Verde e acaba em Bolota', ok: true },
                      { id: 'wrong', label: 'Começa em Sapato e acaba em Sapo', ok: false },
                    ]
                  : [
                      {
                        id: 'r1',
                        label: 'Começa sempre com Folha Verde e termina com Bolota',
                        ok: true,
                      },
                      {
                        id: 'r2',
                        label: 'Tem de ter sempre dois Cogumelos no meio',
                        ok: false,
                      },
                      {
                        id: 'r3',
                        label: 'Começa sempre com Bolota e termina com Estrela',
                        ok: false,
                      },
                    ]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (opt.ok) {
                        nextStage('Regra descoberta! Agora planeia o próximo trilho seguindo essa regra.');
                      } else {
                        gentleRetry('Compara o primeiro e o último desenho dos exemplos seguros!');
                      }
                    }}
                    className="p-4 min-h-[60px] rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#CBD5E1] hover:border-[#0D9488] font-bold text-sm sm:text-base text-left cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <p className="font-bold text-center text-[#0F766E]">
                Etapa 2: Planeia uma sequência de {isEasy ? 3 : 4} marcas que comece em Folha Verde e acabe em Bolota!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {Array.from({ length: isEasy ? 3 : 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 sm:w-15 sm:h-15 rounded-2xl border-2 border-dashed border-[#0D9488] bg-[#F0FDFA] flex items-center justify-center"
                  >
                    {lvl1Plan[i] ? (
                      <NatureItemIcon id={lvl1Plan[i]} size={38} />
                    ) : (
                      <span className="text-xs font-extrabold text-[#0F766E]">
                        {i === 0 ? 'Início' : i === (isEasy ? 2 : 3) ? 'Fim' : i + 1}
                      </span>
                    )}
                  </div>
                ))}
                {lvl1Plan.length > 0 && !done && (
                  <button
                    type="button"
                    onClick={() => setLvl1Plan([])}
                    aria-label="Limpar plano"
                    className="px-3 h-12 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Limpar</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {(
                  [
                    { id: 'leaf_green', label: 'Folha Verde' },
                    { id: 'flower_pink', label: 'Flor Rosa' },
                    { id: 'star', label: 'Estrela' },
                    { id: 'acorn', label: 'Bolota' },
                  ] as { id: NatureIconId; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      const targetLen = isEasy ? 3 : 4;
                      if (lvl1Plan.length >= targetLen) return;
                      sound.playTap();
                      const next = [...lvl1Plan, item.id];
                      setLvl1Plan(next);
                      if (next.length === targetLen) {
                        if (next[0] === 'leaf_green' && next[targetLen - 1] === 'acorn') {
                          finishLevel(
                            'Excelente planeamento! A sequência começa com Folha Verde e termina em Bolota como a regra da avó!'
                          );
                        } else {
                          gentleRetry(
                            'Quase! Lembra-te da regra: a primeira peça tem de ser Folha Verde e a última Bolota. Limpa e tenta outra vez!'
                          );
                        }
                      }
                    }}
                    className="min-w-[104px] min-h-[82px] px-3 py-2 rounded-2xl bg-white hover:bg-[#FEF3C7] border-2 border-[#E2DAC3] flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <NatureItemIcon id={item.id} size={38} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEVEL 2: Planned Maze Arrows + Comparative Counting */}
      {chapterId === 2 && (
        <div className="space-y-5">
          {stage === 1 ? (
            <>
              <div className="p-4 rounded-2xl bg-[#E0F7FA] border border-[#67E8F9] max-w-sm mx-auto">
                <p className="text-xs font-extrabold text-[#0369A1] text-center mb-2">
                  Mapa do pequeno braço do riacho (Lucky no início → Patinho no fim):
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    'lucky', 'stone', 'stone', 'water',
                    'water', 'water', 'stone', 'duck',
                  ].map((cell, i) => (
                    <div
                      key={i}
                      className={`h-12 rounded-xl flex items-center justify-center border ${
                        cell === 'water'
                          ? 'bg-[#38BDF8]/40 border-[#0284C7]/30'
                          : 'bg-white border-[#CBD5E1]'
                      }`}
                    >
                      {cell === 'lucky' && <span className="text-xs font-extrabold text-[#C2410C]">Lucky</span>}
                      {cell === 'duck' && <NatureItemIcon id="duckling" size={30} />}
                      {cell === 'stone' && <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />}
                    </div>
                  ))}
                </div>
              </div>

              {isEasy ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      nextStage('Ótimo plano! Agora só falta equilibrar as pedras da margem.')
                    }
                    className="p-4 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#0D9488] font-bold text-base cursor-pointer"
                  >
                    Plano A: Direita → Direita → Baixo → Direita
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      gentleRetry('No Plano B o Lucky ia entrar na água! Observa onde estão as pedras.')
                    }
                    className="p-4 rounded-2xl bg-white hover:bg-[#FEF3C7] border-2 border-[#CBD5E1] font-bold text-base cursor-pointer"
                  >
                    Plano B: Baixo → Baixo → Direita
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center font-bold text-[#0F766E]">
                    Planeia os 4 passos seguidos para o Lucky chegar ao Patinho:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {targetMoves.map((_, i) => (
                      <div
                        key={i}
                        className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border-2 border-dashed border-[#0D9488] bg-[#F0FDFA] flex items-center justify-center"
                      >
                        {plannedMoves[i] === 'right' && <ArrowRight className="w-6 h-6 text-[#0F766E]" />}
                        {plannedMoves[i] === 'down' && <ArrowDown className="w-6 h-6 text-[#0F766E]" />}
                        {plannedMoves[i] === 'up' && <ArrowUp className="w-6 h-6 text-[#0F766E]" />}
                      </div>
                    ))}
                    {plannedMoves.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPlannedMoves([])}
                        className="px-3 h-13 sm:h-14 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        aria-label="Limpar setas"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Limpar</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                    {(
                      [
                        { dir: 'right', icon: ArrowRight, label: 'Direita' },
                        { dir: 'down', icon: ArrowDown, label: 'Baixo' },
                        { dir: 'up', icon: ArrowUp, label: 'Cima' },
                      ] as const
                    ).map((btn) => {
                      const Icon = btn.icon;
                      return (
                        <button
                          key={btn.dir}
                          type="button"
                          onClick={() => {
                            if (plannedMoves.length >= targetMoves.length) return;
                            sound.playTap();
                            const next = [...plannedMoves, btn.dir];
                            setPlannedMoves(next);
                            if (next.length === targetMoves.length) {
                              const ok = targetMoves.every((m, idx) => next[idx] === m);
                              if (ok) {
                                nextStage('Plano perfeito! O Lucky atravessou todas as pedras certas!');
                              } else {
                                gentleRetry('Essa sequência leva à água! Limpa e observa quantos passos são para a direita antes de descer.');
                              }
                            }
                          }}
                          className="px-4 sm:px-5 py-3 min-h-[50px] rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#CBD5E1] font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <Icon className="w-5 h-5 text-[#0F766E]" />
                          <span>{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <p className="text-center font-bold text-[#0F766E]">
                {isEasy
                  ? 'A margem esquerda tem 4 pedrinhas e a direita tem 2. Quantas faltam para ficarem iguais?'
                  : 'A margem esquerda tem 7 pedrinhas e a direita tem 4. Quantas faltam na direita para igualar 7 = 7?'}
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-[#F4EFE2] text-center">
                  <p className="text-xs font-extrabold mb-2">Margem Esquerda ({isEasy ? 4 : 7})</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: isEasy ? 4 : 7 }).map((_, i) => (
                      <span key={i} className="w-5 h-5 rounded-full bg-[#0D9488]" />
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F4EFE2] text-center">
                  <p className="text-xs font-extrabold mb-2">Margem Direita ({isEasy ? 2 : 4})</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: isEasy ? 2 : 4 }).map((_, i) => (
                      <span key={i} className="w-5 h-5 rounded-full bg-[#F59E0B]" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                {(isEasy ? [1, 2, 3] : [2, 3, 4, 5]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      const expected = isEasy ? 2 : 3;
                      if (n === expected) {
                        finishLevel(
                          isEasy
                            ? '2 + 2 = 4! Agora as duas margens têm exatamente 4 pedrinhas!'
                            : '4 + 3 = 7! Equilibraste as duas margens com 7 pedrinhas cada!'
                        );
                      } else {
                        gentleRetry('Conta quantas bolinhas amarelas faltam para igualar as verdes!');
                      }
                    }}
                    className="min-w-[80px] min-h-[58px] rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#0D9488] font-display text-2xl font-bold tabular-nums cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEVEL 3: Memory + Comparative Watering Plan */}
      {chapterId === 3 && (
        <div className="space-y-5">
          {stage === 1 ? (
            <>
              <p className="text-center font-bold text-[#0F766E]">
                Etapa 1: Lembra-te dos pares de plantas do jardim ({lvl3Matched.length} de {isEasy ? 2 : 3}):
              </p>
              <div className={`grid gap-3 max-w-md mx-auto ${isEasy ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {lvl3Cards.map((card) => {
                  const isOpen = lvl3Open.includes(card.uid) || lvl3Matched.includes(card.id);
                  return (
                    <button
                      key={card.uid}
                      type="button"
                      onClick={() => {
                        if (lvl3Open.length >= 2 || isOpen) return;
                        sound.playTap();
                        const nextOpen = [...lvl3Open, card.uid];
                        setLvl3Open(nextOpen);
                        if (nextOpen.length === 2) {
                          const c1 = lvl3Cards.find((c) => c.uid === nextOpen[0])!;
                          const c2 = lvl3Cards.find((c) => c.uid === nextOpen[1])!;
                          if (c1.id === c2.id) {
                            setTimeout(() => {
                              sound.playSuccess();
                              const nextMatched = [...lvl3Matched, c1.id];
                              setLvl3Matched(nextMatched);
                              setLvl3Open([]);
                              if (nextMatched.length === (isEasy ? 2 : 3)) {
                                nextStage('Plantas memorizadas! Agora compara os planos de rega.');
                              }
                            }, 320);
                          } else {
                            setTimeout(() => {
                              gentleRetry('Ainda não é igual! Guarda os sítios na memória.');
                              setLvl3Open([]);
                            }, 650);
                          }
                        }
                      }}
                      className={`min-h-[86px] rounded-2xl border-2 flex items-center justify-center cursor-pointer ${
                        lvl3Matched.includes(card.id)
                          ? 'bg-[#D1FAE5] border-[#10B981]'
                          : isOpen
                          ? 'bg-white border-[#F59E0B]'
                          : 'bg-[#FEF3C7] border-[#F59E0B]/60'
                      }`}
                    >
                      {isOpen ? (
                        <NatureItemIcon id={card.id} size={42} />
                      ) : (
                        <HelpCircle className="w-6 h-6 text-[#D97706]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1 text-sm sm:text-base font-bold text-[#78350F]">
                <p>Etapa 2 · Regras de rega:</p>
                <p>1. O Girassol é regado primeiro (1.º).</p>
                {!isEasy && <p>2. O Morangueiro fica para o fim (3.º).</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isEasy
                  ? [
                      { id: 'ok', label: 'Plano A: 1.º Girassol → 2.º Flor Rosa', ok: true },
                      { id: 'no', label: 'Plano B: 1.º Flor Rosa → 2.º Girassol', ok: false },
                    ]
                  : [
                      {
                        id: 'no1',
                        label: 'Plano A: Flor Rosa → Girassol → Morangueiro',
                        ok: false,
                      },
                      {
                        id: 'ok',
                        label: 'Plano B: Girassol → Flor Rosa → Morangueiro',
                        ok: true,
                      },
                      {
                        id: 'no2',
                        label: 'Plano C: Girassol → Morangueiro → Flor Rosa',
                        ok: false,
                      },
                    ]
                ).map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      if (plan.ok) {
                        finishLevel('Plano de rega perfeito! Todas as regras foram cumpridas pela ordem certa.');
                      } else {
                        gentleRetry('Compara o plano escolhido com as duas regras da lista em cima!');
                      }
                    }}
                    className="p-4 min-h-[60px] rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#CBD5E1] hover:border-[#0D9488] font-bold text-left cursor-pointer"
                  >
                    {plan.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEVEL 4: Symbol-Letter Code + Word Planning */}
      {chapterId === 4 && (
        <div className="space-y-5">
          {stage === 1 ? (
            <>
              <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#E2DAC3] flex flex-wrap justify-center gap-5">
                <div className="flex items-center gap-2 font-bold">
                  <NatureItemIcon id="flower_sun" size={34} />
                  <span>= S (Sol)</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <NatureItemIcon id="flower_pink" size={34} />
                  <span>= F (Flor)</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <NatureItemIcon id="leaf_gold" size={34} />
                  <span>= L (Folha)</span>
                </div>
              </div>

              <p className="text-center font-bold text-[#0F766E]">
                {isEasy
                  ? 'Qual é a primeira letra de "Flor"?'
                  : 'Descobre a regra da letra inicial: qual sequência representa Sol → Flor → Folha?'}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {(isEasy
                  ? [
                      { label: 'F', ok: true },
                      { label: 'M', ok: false },
                      { label: 'B', ok: false },
                    ]
                  : [
                      { label: 'S - F - L', ok: true },
                      { label: 'F - L - S', ok: false },
                      { label: 'L - S - F', ok: false },
                    ]
                ).map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      if (opt.ok) {
                        nextStage('Código decifrado! Agora forma a palavra final da colina.');
                      } else {
                        gentleRetry('Olha para a primeira letra do nome de cada desenho!');
                      }
                    }}
                    className="min-w-[110px] min-h-[58px] px-5 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#0D9488] font-display text-xl font-bold cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <p className="text-center font-bold text-[#0F766E]">
                Etapa 2: Forma a palavra &ldquo;{lvl4Word}&rdquo; para a placa do miradouro!
              </p>
              <div className="flex justify-center gap-2">
                {lvl4Word.split('').map((ch, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl border-2 font-display text-2xl font-bold flex items-center justify-center ${
                      lvl4Typed[idx]
                        ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                        : 'bg-white border-dashed border-[#94A3B8] text-[#CBD5E1]'
                    }`}
                  >
                    {lvl4Typed[idx] || ch.replace(/./, '·')}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {lvl4Bank.map((l, i) => (
                  <button
                    key={`${l}-${i}`}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      const expected = lvl4Word[lvl4Typed.length];
                      if (l === expected) {
                        sound.playTap();
                        const next = lvl4Typed + l;
                        setLvl4Typed(next);
                        if (next === lvl4Word) {
                          finishLevel(`Decifraste a regra das iniciais e formaste "${lvl4Word}"!`);
                        }
                      } else {
                        gentleRetry(`Agora procuramos a letra "${expected}".`);
                      }
                    }}
                    className="w-13 h-14 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#0D9488] font-display text-2xl font-bold text-[#0F766E] cursor-pointer"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEVEL 5: Arrangement Comparison + Final Word */}
      {chapterId === 5 && (
        <div className="space-y-5">
          {stage === 1 ? (
            <>
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-sm font-bold text-[#78350F] space-y-1">
                <p>
                  {isEasy
                    ? 'Escolhe o arranjo que tem 2 Estrelas e 2 Lanternas alternadas:'
                    : 'Compara os planos e escolhe o único que cumpre TODAS as 3 regras: (1) Total de 6 luzes · (2) Alterna Estrela e Lanterna · (3) Sem objetos fora do lugar.'}
                </p>
              </div>

              <div className="space-y-3">
                {(isEasy
                  ? [
                      {
                        id: 'a',
                        icons: ['star', 'lantern', 'star', 'lantern'] as NatureIconId[],
                        ok: true,
                      },
                      {
                        id: 'b',
                        icons: ['star', 'star', 'star', 'lantern'] as NatureIconId[],
                        ok: false,
                      },
                    ]
                  : [
                      {
                        id: 'a',
                        icons: ['star', 'star', 'lantern', 'lantern', 'star', 'lantern'] as NatureIconId[],
                        ok: false,
                      },
                      {
                        id: 'b',
                        icons: ['star', 'lantern', 'star', 'lantern', 'star', 'lantern'] as NatureIconId[],
                        ok: true,
                      },
                      {
                        id: 'c',
                        icons: ['star', 'lantern', 'bell', 'star', 'lantern', 'star'] as NatureIconId[],
                        ok: false,
                      },
                    ]
                ).map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      if (plan.ok) {
                        nextStage('Arranjo equilibrado! Agora forma a palavra final da festa.');
                      } else {
                        gentleRetry('Verifica se alterna Estrela e Lanterna do princípio ao fim sem intrusos!');
                      }
                    }}
                    className="w-full p-3.5 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#E2DAC3] hover:border-[#0D9488] flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 cursor-pointer"
                  >
                    {plan.icons.map((ic, idx) => (
                      <NatureItemIcon key={idx} id={ic} size={34} />
                    ))}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <p className="text-center font-bold text-[#0F766E]">
                Etapa 2: Forma a palavra &ldquo;{lvl5Word}&rdquo; para celebrar o passeio!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {lvl5Word.split('').map((ch, idx) => (
                  <div
                    key={idx}
                    className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl border-2 font-display text-2xl font-bold flex items-center justify-center ${
                      lvl5Typed[idx]
                        ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                        : 'bg-white border-dashed border-[#94A3B8] text-[#CBD5E1]'
                    }`}
                  >
                    {lvl5Typed[idx] || ch.replace(/./, '·')}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {lvl5Bank.map((l, i) => (
                  <button
                    key={`${l}-${i}`}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      const expected = lvl5Word[lvl5Typed.length];
                      if (l === expected) {
                        sound.playTap();
                        const next = lvl5Typed + l;
                        setLvl5Typed(next);
                        if (next === lvl5Word) {
                          finishLevel(
                            `Completaste todos os Níveis Avançados com "${lvl5Word}"!`
                          );
                        }
                      } else {
                        gentleRetry(`Agora procuramos a letra "${expected}".`);
                      }
                    }}
                    className="w-12 h-13 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#0D9488] font-display text-2xl font-bold text-[#0F766E] cursor-pointer"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <HelperBar
        character={meta.helperDog}
        buttonLabel={meta.helperDog === 'athenas' ? 'Observar a Athenas' : 'Ver o Lucky'}
        hintsUsed={hintsUsed}
        currentHint={currentHint}
        dogBehaviorNote={dogNote}
        feedbackText={feedback?.text ?? null}
        feedbackTone={feedback?.tone}
        explanationText={explanation}
        onRequestHint={handleHint}
        disabled={done}
      />

      {done && (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#059669]">
            <Check className="w-4 h-4 stroke-[3]" /> Nível Avançado completo!
          </span>
        </div>
      )}
    </div>
  );
};
