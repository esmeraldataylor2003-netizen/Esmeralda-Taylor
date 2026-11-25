import React, { useState } from 'react';
import { Check, HelpCircle, Home } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { COMBINED_CHALLENGES } from '../../data/optionalContent';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface CombinedExtraPuzzleProps {
  chapterId: number;
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

export const CombinedExtraPuzzle: React.FC<CombinedExtraPuzzleProps> = ({
  chapterId,
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const isEasy = ageGroup === '5-7';
  const meta =
    COMBINED_CHALLENGES.find((c) => c.chapterId === chapterId) ??
    COMBINED_CHALLENGES[0];

  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [done, setDone] = useState(false);

  // Chapter 1 state: Observation + Counting
  const ch1Items: NatureIconId[] = isEasy
    ? ['leaf_gold', 'pinecone', 'leaf_gold', 'mushroom_red', 'leaf_gold', 'flower_pink']
    : [
        'leaf_gold',
        'acorn',
        'pinecone',
        'leaf_gold',
        'acorn',
        'mushroom_blue',
        'leaf_gold',
        'acorn',
        'leaf_green',
      ];
  const [ch1FoundIdxs, setCh1FoundIdxs] = useState<number[]>([]);
  const [ch1Step, setCh1Step] = useState<1 | 2>(1);

  // Chapter 2 state: Maze + Pattern (choose stones matching sequence)
  const ch2Pattern: NatureIconId[] = isEasy
    ? ['flower_sun', 'leaf_green', 'flower_sun']
    : ['water_drop', 'leaf_green', 'flower_pink', 'water_drop'];
  const ch2ChoicesPerStep: { icon: NatureIconId; label: string }[][] = isEasy
    ? [
        [
          { icon: 'flower_sun', label: 'Girassol' },
          { icon: 'acorn', label: 'Bolota' },
        ],
        [
          { icon: 'mushroom_red', label: 'Cogumelo' },
          { icon: 'leaf_green', label: 'Folha' },
        ],
        [
          { icon: 'flower_sun', label: 'Girassol' },
          { icon: 'water_drop', label: 'Água' },
        ],
      ]
    : [
        [
          { icon: 'water_drop', label: 'Gota' },
          { icon: 'bell', label: 'Sino' },
        ],
        [
          { icon: 'leaf_green', label: 'Folha' },
          { icon: 'acorn', label: 'Bolota' },
        ],
        [
          { icon: 'flower_pink', label: 'Flor' },
          { icon: 'pinecone', label: 'Pinha' },
        ],
        [
          { icon: 'water_drop', label: 'Gota' },
          { icon: 'star', label: 'Estrela' },
        ],
      ];
  const [ch2StepIdx, setCh2StepIdx] = useState(0);

  // Chapter 3 state: Memory + Logic
  const ch3Cards: { uid: number; id: NatureIconId; label: string }[] = isEasy
    ? [
        { uid: 0, id: 'rabbit', label: 'Coelho' },
        { uid: 1, id: 'squirrel', label: 'Esquilo' },
        { uid: 2, id: 'rabbit', label: 'Coelho' },
        { uid: 3, id: 'squirrel', label: 'Esquilo' },
      ]
    : [
        { uid: 0, id: 'rabbit', label: 'Coelho' },
        { uid: 1, id: 'fox', label: 'Raposa' },
        { uid: 2, id: 'hedgehog', label: 'Ouriço' },
        { uid: 3, id: 'fox', label: 'Raposa' },
        { uid: 4, id: 'rabbit', label: 'Coelho' },
        { uid: 5, id: 'hedgehog', label: 'Ouriço' },
      ];
  const [ch3Open, setCh3Open] = useState<number[]>([]);
  const [ch3Matched, setCh3Matched] = useState<NatureIconId[]>([]);
  const [ch3Phase, setCh3Phase] = useState<'memory' | 'logic'>('memory');
  const [ch3LogicIndex, setCh3LogicIndex] = useState(0);

  // Chapter 4 state: Classification + Word
  const [ch4Phase, setCh4Phase] = useState<'classify' | 'word'>('classify');
  const ch4TargetWord = isEasy ? 'UVA' : 'ARVORE';
  const ch4Letters = isEasy
    ? ['A', 'U', 'M', 'V']
    : ['R', 'A', 'V', 'E', 'O', 'R', 'L'];
  const [ch4Typed, setCh4Typed] = useState('');

  // Chapter 5 state: Counting + Word + Pattern
  const [ch5Phase, setCh5Phase] = useState<'count' | 'word'>('count');
  const ch5TargetWord = isEasy ? 'LUZ' : 'EQUIPA';
  const ch5Letters = isEasy
    ? ['Z', 'L', 'U', 'A']
    : ['Q', 'E', 'I', 'U', 'A', 'P', 'S'];
  const [ch5Typed, setCh5Typed] = useState('');

  const finishExtra = (exp: string) => {
    sound.playSuccess();
    setDone(true);
    setExplanation(exp);
    setFeedback({
      text: 'Desafio extra completo! Excelente cooperação e atenção!',
      tone: 'success',
    });
    setTimeout(() => onComplete(), 1250);
  };

  const triggerGentleRetry = (msg: string) => {
    sound.playGentleTryAgain();
    onGentleRetry?.();
    setFeedback({ text: msg, tone: 'gentle' });
  };

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);

    if (chapterId === 1) {
      setDogNote('Athenas cheira devagar os desenhos espalhados.');
      if (ch1Step === 1) {
        const hints = isEasy
          ? [
              'Procura apenas as Folhas Douradas brilhantes.',
              'Toca em cada Folha Dourada para as marcar a verde!',
              'Há 3 Folhas Douradas escondidas entre os outros desenhos!',
            ]
          : [
              'Marca todas as Folhas Douradas e também todas as Bolotas castanhas!',
              'Olha bem para cada fila: há 3 Folhas Douradas e 3 Bolotas.',
              'Depois de marcar as 6 peças certas, soma 3 + 3!',
            ];
        setCurrentHint(hints[nextNum - 1]);
      } else {
        const ans = isEasy ? 3 : 6;
        setCurrentHint(`Conta todas as peças marcadas a verde: são ${ans}!`);
      }
    } else if (chapterId === 2) {
      setDogNote('Lucky olha para a placa da ordem das pedras e depois para a próxima fila.');
      const needed = ch2Pattern[ch2StepIdx];
      const hints = [
        'Segue o desenho que está marcado no passo atual lá em cima.',
        `Estamos no passo ${ch2StepIdx + 1} da travessia do riacho!`,
        `A pedra certa deste passo tem o desenho de ${
          ch2ChoicesPerStep[ch2StepIdx].find((c) => c.icon === needed)?.label ?? 'desenho certo'
        }!`,
      ];
      setCurrentHint(hints[nextNum - 1]);
    } else if (chapterId === 3) {
      setDogNote('Athenas cheira com calma os cartões do jardim.');
      if (ch3Phase === 'memory') {
        setCurrentHint(
          nextNum === 1
            ? 'Abre dois cartões por vez e guarda onde fica cada animal!'
            : 'Repara nas posições dos cartões que já abriste antes.'
        );
      } else {
        setCurrentHint(
          isEasy
            ? 'A pista diz que o Coelho gosta da Casa Azul!'
            : ch3LogicIndex === 0
            ? 'O Coelho vai para a Casa Azul.'
            : 'A Raposa gosta da Casa Rosa, sobrando a Verde para o Ouriço!'
        );
      }
    } else if (chapterId === 4) {
      setDogNote('Lucky aproxima-se do cesto certo e abana a cauda.');
      if (ch4Phase === 'classify') {
        setCurrentHint(
          isEasy
            ? 'Três desenhos são frutas doces — o Sino é o diferente!'
            : 'A Bússola é um objeto da mochila; os outros nascem na natureza!'
        );
      } else {
        const nextChar = ch4TargetWord[ch4Typed.length];
        setCurrentHint(`Toca agora na letra "${nextChar}" para formar ${ch4TargetWord}!`);
      }
    } else {
      setDogNote('Athenas senta-se contente junto às luzes do tapete.');
      if (ch5Phase === 'count') {
        const total = isEasy ? 4 : 8;
        setCurrentHint(`Conta todas as luzes uma a uma: são ${total}!`);
      } else {
        const nextChar = ch5TargetWord[ch5Typed.length];
        setCurrentHint(`A próxima letra da palavra "${ch5TargetWord}" é "${nextChar}"!`);
      }
    }
  };

  return (
    <div>
      <PuzzleInstruction
        goal={meta.goal}
        roundLabel={`Desafio Extra Combinado · ${meta.combinedTypes}`}
        instruction={meta.storyContext}
      />

      {/* CHAPTER 1: OBSERVATION + COUNTING */}
      {chapterId === 1 && (
        <div className="space-y-5">
          <p className="font-bold text-center text-[#0F766E]">
            {ch1Step === 1
              ? isEasy
                ? 'Passo 1: Toca em todas as Folhas Douradas que encontrares!'
                : 'Passo 1: Toca em todas as Folhas Douradas e em todas as Bolotas!'
              : isEasy
              ? 'Passo 2: Quantas Folhas Douradas encontraste ao todo?'
              : 'Passo 2: Quantas peças marcadas (Folhas + Bolotas) encontraste ao todo?'}
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {ch1Items.map((icon, idx) => {
              const isSelected = ch1FoundIdxs.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={ch1Step === 2 || done}
                  onClick={() => {
                    const isValid = isEasy
                      ? icon === 'leaf_gold'
                      : icon === 'leaf_gold' || icon === 'acorn';
                    if (!isValid) {
                      triggerGentleRetry('Esse desenho não faz parte da contagem agora. Procura só os pedidos!');
                      return;
                    }
                    if (isSelected) return;
                    sound.playTap();
                    const next = [...ch1FoundIdxs, idx];
                    setCh1FoundIdxs(next);
                    const targetLen = isEasy ? 3 : 6;
                    if (next.length === targetLen) {
                      sound.playSuccess();
                      setCh1Step(2);
                      setFeedback({
                        text: 'Boa observação! Agora escolhe o número total em baixo!',
                        tone: 'success',
                      });
                    }
                  }}
                  className={`min-h-[78px] rounded-2xl border-2 flex items-center justify-center relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#D1FAE5] border-[#10B981]'
                      : 'bg-white hover:bg-[#FEF3C7] border-[#E2DAC3]'
                  }`}
                >
                  <NatureItemIcon id={icon} size={46} />
                  {isSelected && (
                    <Check className="w-5 h-5 text-[#059669] absolute top-1.5 right-1.5 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {ch1Step === 2 && (
            <div className="flex justify-center gap-4 pt-2 animate-pop">
              {(isEasy ? [2, 3, 4] : [5, 6, 7]).map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={done}
                  onClick={() => {
                    const expected = isEasy ? 3 : 6;
                    if (n === expected) {
                      finishExtra(
                        isEasy
                          ? 'Encontrámos e contámos 3 Folhas Douradas no relvado!'
                          : 'Observámos 3 Folhas Douradas + 3 Bolotas = 6 tesouros guardados!'
                      );
                    } else {
                      triggerGentleRetry(`Conta os quadrados verdes outra vez — ${n} não é o total.`);
                    }
                  }}
                  className="min-w-[80px] min-h-[58px] rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#0D9488] font-display text-2xl font-bold tabular-nums cursor-pointer"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CHAPTER 2: MAZE + PATTERN */}
      {chapterId === 2 && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-[#E0F7FA] border border-[#67E8F9]">
            <span className="text-sm font-extrabold text-[#0369A1] mr-1">
              Ordem das pedras:
            </span>
            {ch2Pattern.map((icon, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${
                  i < ch2StepIdx
                    ? 'bg-[#D1FAE5] border-[#10B981]'
                    : i === ch2StepIdx
                    ? 'bg-[#FEF3C7] border-[#F59E0B] scale-110'
                    : 'bg-white border-[#CBD5E1] opacity-70'
                }`}
              >
                <NatureItemIcon id={icon} size={32} />
              </div>
            ))}
          </div>

          <p className="text-center font-bold text-[#1E2B2A]">
            Passo {Math.min(ch2StepIdx + 1, ch2Pattern.length)} de {ch2Pattern.length}: Escolhe a pedra firme seguinte!
          </p>

          <div className="flex justify-center gap-4">
            {ch2ChoicesPerStep[Math.min(ch2StepIdx, ch2ChoicesPerStep.length - 1)].map((opt) => (
              <button
                key={opt.icon}
                type="button"
                disabled={done}
                onClick={() => {
                  if (opt.icon === ch2Pattern[ch2StepIdx]) {
                    sound.playSuccess();
                    const next = ch2StepIdx + 1;
                    if (next === ch2Pattern.length) {
                      finishExtra('Seguiste toda a ordem das pedras e atravessaste o riacho sem escorregar!');
                    } else {
                      setCh2StepIdx(next);
                      setFeedback({
                        text: `Certo! ${opt.label} abre a próxima pedra!`,
                        tone: 'success',
                      });
                    }
                  } else {
                    triggerGentleRetry('Essa pedra não segue o desenho da fila lá em cima. Tenta a outra!');
                  }
                }}
                className="min-w-[130px] min-h-[100px] p-4 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#CBD5E1] hover:border-[#10B981] flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <NatureItemIcon id={opt.icon} size={48} />
                <span className="font-bold text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAPTER 3: MEMORY + LOGIC */}
      {chapterId === 3 && (
        <div className="space-y-5">
          {ch3Phase === 'memory' ? (
            <>
              <p className="text-center font-bold text-[#0F766E]">
                Passo 1: Encontra os pares dos animais do jardim ({ch3Matched.length} de {isEasy ? 2 : 3})!
              </p>
              <div className={`grid gap-3 max-w-md mx-auto ${isEasy ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {ch3Cards.map((card) => {
                  const isOpen = ch3Open.includes(card.uid) || ch3Matched.includes(card.id);
                  return (
                    <button
                      key={card.uid}
                      type="button"
                      onClick={() => {
                        if (ch3Open.length >= 2 || isOpen) return;
                        sound.playTap();
                        const nextOpen = [...ch3Open, card.uid];
                        setCh3Open(nextOpen);
                        if (nextOpen.length === 2) {
                          const c1 = ch3Cards.find((c) => c.uid === nextOpen[0])!;
                          const c2 = ch3Cards.find((c) => c.uid === nextOpen[1])!;
                          if (c1.id === c2.id) {
                            setTimeout(() => {
                              sound.playSuccess();
                              const nextMatched = [...ch3Matched, c1.id];
                              setCh3Matched(nextMatched);
                              setCh3Open([]);
                              if (nextMatched.length === (isEasy ? 2 : 3)) {
                                setCh3Phase('logic');
                                setFeedback({
                                  text: 'Pares encontrados! Agora vamos confirmar onde mora cada um!',
                                  tone: 'success',
                                });
                              }
                            }, 350);
                          } else {
                            setTimeout(() => {
                              triggerGentleRetry('Ainda não é par! Tenta outro par de cartões.');
                              setCh3Open([]);
                            }, 700);
                          }
                        }
                      }}
                      className={`min-h-[88px] rounded-2xl border-2 flex flex-col items-center justify-center p-2 cursor-pointer ${
                        ch3Matched.includes(card.id)
                          ? 'bg-[#D1FAE5] border-[#10B981]'
                          : isOpen
                          ? 'bg-white border-[#F59E0B]'
                          : 'bg-[#FEF3C7] border-[#F59E0B]/60'
                      }`}
                    >
                      {isOpen ? (
                        <NatureItemIcon id={card.id} size={44} />
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
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-center">
                <p className="font-bold text-[#78350F]">
                  {isEasy
                    ? 'Passo 2: O Coelho adora flores azuis. Em que casa mora o Coelho?'
                    : ch3LogicIndex === 0
                    ? 'Passo 2A: O Coelho mora na Casa Azul. Escolhe a casa do Coelho!'
                    : 'Passo 2B: A Raposa gosta da Casa Rosa e não da Verde. Onde mora a Raposa?'}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { id: 'azul', label: 'Casa Azul', bg: 'bg-[#E0F2FE] border-[#38BDF8]' },
                  { id: 'rosa', label: 'Casa Rosa', bg: 'bg-[#FCE7F3] border-[#EC4899]' },
                  { id: 'verde', label: 'Casa Verde', bg: 'bg-[#DCFCE7] border-[#22C55E]' },
                ].map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      if (isEasy) {
                        if (h.id === 'azul') {
                          finishExtra('Juntaste a memória dos pares com a pista da Casa Azul!');
                        } else {
                          triggerGentleRetry('Lê a pista outra vez: o Coelho gosta de flores azuis!');
                        }
                      } else if (ch3LogicIndex === 0) {
                        if (h.id === 'azul') {
                          sound.playSuccess();
                          setCh3LogicIndex(1);
                          setFeedback({ text: 'Boa! Falta confirmar a casa da Raposa!', tone: 'success' });
                        } else {
                          triggerGentleRetry('A pista diz Casa Azul para o Coelho!');
                        }
                      } else {
                        if (h.id === 'rosa') {
                          finishExtra('Excelente! Combinaste memória e lógica para arrumar todas as casas!');
                        } else {
                          triggerGentleRetry('Relê com calma: a Raposa gosta da Casa Rosa!');
                        }
                      }
                    }}
                    className={`min-w-[130px] min-h-[86px] rounded-2xl border-2 ${h.bg} flex flex-col items-center justify-center gap-1.5 font-bold cursor-pointer`}
                  >
                    <Home className="w-5 h-5" />
                    <span>{h.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHAPTER 4: CLASSIFICATION + WORD */}
      {chapterId === 4 && (
        <div className="space-y-5">
          {ch4Phase === 'classify' ? (
            <>
              <p className="text-center font-bold text-[#0F766E]">
                {isEasy
                  ? 'Passo 1: Toca no objeto que NÃO é fruta!'
                  : 'Passo 1: Toca no objeto feito por pessoas (que não nasce nas plantas)!'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                {(isEasy
                  ? [
                      { icon: 'apple' as NatureIconId, label: 'Maçã', odd: false },
                      { icon: 'banana' as NatureIconId, label: 'Banana', odd: false },
                      { icon: 'strawberry' as NatureIconId, label: 'Morango', odd: false },
                      { icon: 'bell' as NatureIconId, label: 'Sino', odd: true },
                    ]
                  : [
                      { icon: 'leaf_green' as NatureIconId, label: 'Folha', odd: false },
                      { icon: 'acorn' as NatureIconId, label: 'Bolota', odd: false },
                      { icon: 'flower_sun' as NatureIconId, label: 'Girassol', odd: false },
                      { icon: 'compass' as NatureIconId, label: 'Bússola', odd: true },
                    ]
                ).map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    onClick={() => {
                      if (item.odd) {
                        sound.playSuccess();
                        setCh4Phase('word');
                        setFeedback({
                          text: 'Muito bem! Agora escreve a etiqueta do cesto!',
                          tone: 'success',
                        });
                      } else {
                        triggerGentleRetry('Esse combina com o resto do grupo. Procura o diferente!');
                      }
                    }}
                    className="min-h-[104px] p-3 rounded-2xl bg-white hover:bg-[#FEF3C7] border-2 border-[#E2DAC3] flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <NatureItemIcon id={item.icon} size={44} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <p className="text-center font-bold text-[#0F766E]">
                Passo 2: Forma a palavra &ldquo;{ch4TargetWord}&rdquo; para a etiqueta!
              </p>
              <div className="flex justify-center gap-2">
                {ch4TargetWord.split('').map((ch, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl border-2 font-display text-2xl font-bold flex items-center justify-center ${
                      ch4Typed[idx]
                        ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                        : 'bg-white border-dashed border-[#94A3B8] text-[#CBD5E1]'
                    }`}
                  >
                    {ch4Typed[idx] || ch.replace(/./, '·')}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {ch4Letters.map((l, i) => (
                  <button
                    key={`${l}-${i}`}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      const expected = ch4TargetWord[ch4Typed.length];
                      if (l === expected) {
                        sound.playTap();
                        const next = ch4Typed + l;
                        setCh4Typed(next);
                        if (next === ch4TargetWord) {
                          finishExtra(`Etiqueta "${ch4TargetWord}" pronta e cestos organizados!`);
                        }
                      } else {
                        triggerGentleRetry(`Procuramos agora a letra "${expected}".`);
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

      {/* CHAPTER 5: COUNTING + WORD + PATTERN */}
      {chapterId === 5 && (
        <div className="space-y-5">
          {ch5Phase === 'count' ? (
            <>
              <p className="text-center font-bold text-[#0F766E]">
                Passo 1: Conta todas as luzes do piquenique!
              </p>
              <div className="flex flex-wrap justify-center gap-3 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
                {Array.from({ length: isEasy ? 4 : 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl bg-white border border-[#FDE68A] flex items-center justify-center"
                  >
                    <NatureItemIcon id={i % 2 === 0 ? 'star' : 'lantern'} size={34} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                {(isEasy ? [3, 4, 5] : [6, 8, 9]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      const target = isEasy ? 4 : 8;
                      if (n === target) {
                        sound.playSuccess();
                        setCh5Phase('word');
                        setFeedback({
                          text: 'Contagem certa! Agora forma a palavra final!',
                          tone: 'success',
                        });
                      } else {
                        triggerGentleRetry('Conta outra vez devagarinho todas as estrelas e lanternas.');
                      }
                    }}
                    className="min-w-[80px] min-h-[58px] rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#0D9488] font-display text-2xl font-bold tabular-nums cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-pop">
              <p className="text-center font-bold text-[#0F766E]">
                Passo 2: Forma a palavra &ldquo;{ch5TargetWord}&rdquo; no caderno-mapa!
              </p>
              <div className="flex justify-center gap-2">
                {ch5TargetWord.split('').map((ch, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl border-2 font-display text-2xl font-bold flex items-center justify-center ${
                      ch5Typed[idx]
                        ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                        : 'bg-white border-dashed border-[#94A3B8] text-[#CBD5E1]'
                    }`}
                  >
                    {ch5Typed[idx] || ch.replace(/./, '·')}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {ch5Letters.map((l, i) => (
                  <button
                    key={`${l}-${i}`}
                    type="button"
                    disabled={done}
                    onClick={() => {
                      const expected = ch5TargetWord[ch5Typed.length];
                      if (l === expected) {
                        sound.playTap();
                        const next = ch5Typed + l;
                        setCh5Typed(next);
                        if (next === ch5TargetWord) {
                          finishExtra(
                            `Página de recordação fechada com "${ch5TargetWord}" e todas as luzes contadas!`
                          );
                        }
                      } else {
                        triggerGentleRetry(`A próxima letra é "${expected}". Tenta outra vez!`);
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
    </div>
  );
};
