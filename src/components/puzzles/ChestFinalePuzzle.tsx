import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { AgeGroup } from '../../types/game';
import { NatureIconId, NatureItemIcon } from '../CharacterArt';
import { HelperBar, PuzzleInstruction } from './PuzzleShared';
import { sound } from '../../utils/sound';

interface ChestFinalePuzzleProps {
  ageGroup: AgeGroup;
  onComplete: () => void;
  onGentleRetry?: () => void;
}

export const ChestFinalePuzzle: React.FC<ChestFinalePuzzleProps> = ({
  ageGroup,
  onComplete,
  onGentleRetry,
}) => {
  const isEasy = ageGroup === '5-7';
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [dogNote, setDogNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'gentle' | 'success' } | null>(
    null
  );
  const [finished, setFinished] = useState(false);

  const targetWord = isEasy ? 'AMIGOS' : 'AVENTURA';
  const wordLetters = isEasy
    ? ['G', 'A', 'S', 'M', 'O', 'I', 'L']
    : ['R', 'A', 'E', 'T', 'V', 'N', 'A', 'U', 'P'];
  const [typedWord, setTypedWord] = useState<string>('');

  const advanceStep = (next: 1 | 2) => {
    setTimeout(() => {
      setStep(next);
      setHintsUsed(0);
      setCurrentHint(null);
      setDogNote(null);
      setExplanation(null);
      setFeedback(null);
    }, 1050);
  };

  const patternSeq: (NatureIconId | null)[] = isEasy
    ? ['star', 'lantern', 'star', 'lantern', null]
    : ['star', 'lantern', 'rainbow', 'star', 'lantern', null];
  const patternAnswer: NatureIconId = isEasy ? 'star' : 'rainbow';

  const lanternCount = isEasy ? 6 : 9;
  const countOptions = isEasy ? [4, 6, 8] : [7, 8, 9, 10];

  const handleHint = () => {
    const nextNum = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextNum);
    setFeedback(null);

    if (step === 0) {
      setDogNote('Athenas senta-se junto ao cadeado do padrão e olha para as luzes.');
      const hints = isEasy
        ? [
            'Os dois desenhos alternam sempre um depois do outro!',
            'Estrela, Lanterna, Estrela, Lanterna...',
            'Depois da Lanterna vem outra Estrela!',
          ]
        : [
            'Há um grupo de 3 símbolos que se repete igual.',
            'O trio é: Estrela -> Lanterna -> Arco-Íris.',
            'Já tens Estrela e Lanterna no fim; falta o Arco-Íris!',
          ];
      setCurrentHint(hints[nextNum - 1]);
    } else if (step === 1) {
      setDogNote('Athenas observa todas as lanternas de papel penduradas.');
      const hints = [
        'Conta as lanternas da esquerda para a direita sem saltar nenhuma.',
        isEasy ? 'Na primeira fila já há 6 lanternas!' : 'Há mais de 7 lanternas e menos de 10!',
        `Contando todas uma a uma, são ${lanternCount} lanternas!`,
      ];
      setCurrentHint(hints[nextNum - 1]);
    } else {
      setDogNote('Athenas abana a cauda feliz enquanto olhas para as letras.');
      const nextChar = targetWord[typedWord.length];
      const hints = [
        `A palavra final tem ${targetWord.length} letras e lembra a nossa equipa!`,
        `A palavra completa é ${targetWord}. Olha para a letra seguinte.`,
        nextChar
          ? `Toca agora na letra "${nextChar}"!`
          : 'A palavra está quase completa!',
      ];
      setCurrentHint(hints[nextNum - 1]);
    }
  };

  const handleCalmSolution = () => {
    if (step === 0) {
      setFeedback({
        text: `A Esmeralda explica: escolhe "${
          patternAnswer === 'star' ? 'Estrela' : 'Arco-Íris'
        }" para completar o ritmo!`,
        tone: 'gentle',
      });
    } else if (step === 1) {
      setFeedback({
        text: `A Esmeralda conta contigo: são ${lanternCount} lanternas ao todo. Toca no ${lanternCount}!`,
        tone: 'gentle',
      });
    } else {
      const nextChar = targetWord[typedWord.length];
      if (nextChar) {
        const nextWord = typedWord + nextChar;
        setTypedWord(nextWord);
        setFeedback({
          text: `A Esmeralda colocou a letra "${nextChar}" por ti!`,
          tone: 'gentle',
        });
        if (nextWord === targetWord) {
          sound.playSuccess();
          setFinished(true);
          setTimeout(() => onComplete(), 1000);
        }
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5">
        {[0, 1, 2].map((idx) => {
          const unlocked = idx < step || finished;
          const active = idx === step && !finished;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-bold text-sm tabular-nums ${
                unlocked
                  ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                  : active
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                  : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#64748B]'
              }`}
            >
              {unlocked ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Cadeado {idx + 1}</span>
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <div className="animate-pop">
          <PuzzleInstruction
            goal="Abrir os três cadeados do Baú da Amizade na Árvore das Estrelas."
            roundLabel="Cadeado 1 de 3 · Padrão"
            instruction="Completa a sequência das lanternas e estrelas!"
          />
          <div className="flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] mb-5">
            {patternSeq.map((item, i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                  item
                    ? 'bg-white border-[#F59E0B]/40'
                    : 'bg-[#FEF3C7] border-dashed border-[#D97706]'
                }`}
              >
                {item ? (
                  <NatureItemIcon id={item} size={40} />
                ) : (
                  <span className="font-display text-2xl font-bold text-[#D97706]">?</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {(
              [
                { icon: 'star', label: 'Estrela' },
                { icon: 'lantern', label: 'Lanterna' },
                { icon: 'rainbow', label: 'Arco-Íris' },
              ] as { icon: NatureIconId; label: string }[]
            ).map((opt) => (
              <button
                key={opt.icon}
                type="button"
                onClick={() => {
                  if (opt.icon === patternAnswer) {
                    sound.playSuccess();
                    setExplanation('O padrão segue sempre o mesmo ritmo, por isso o cadeado 1 abriu!');
                    setFeedback({
                      text: 'Cadeado 1 aberto! Vamos ao segundo!',
                      tone: 'success',
                    });
                    advanceStep(1);
                  } else {
                    sound.playGentleTryAgain();
                    onGentleRetry?.();
                    setFeedback({
                      text: 'Quase! Tenta outro símbolo que continue o ritmo da fila.',
                      tone: 'gentle',
                    });
                  }
                }}
                className="min-w-[112px] min-h-[88px] px-4 py-2 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#CBD5E1] hover:border-[#10B981] flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                <NatureItemIcon id={opt.icon} size={44} />
                <span className="font-bold text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="animate-pop">
          <PuzzleInstruction
            goal="Abrir o segundo cadeado contando as lanternas de papel."
            roundLabel="Cadeado 2 de 3 · Contagem"
            instruction="Quantas lanternas de papel iluminam a árvore?"
          />
          <div className="flex flex-wrap items-center justify-center gap-3 p-5 rounded-3xl bg-[#FFF7ED] border-2 border-[#FDBA74] mb-5">
            {Array.from({ length: lanternCount }).map((_, i) => (
              <div
                key={i}
                className="w-13 h-13 rounded-2xl bg-white border border-[#FED7AA] flex items-center justify-center shadow-sm"
              >
                <NatureItemIcon id="lantern" size={38} />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {countOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  if (n === lanternCount) {
                    sound.playSuccess();
                    setExplanation(`São exatamente ${lanternCount} lanternas — o cadeado 2 abriu!`);
                    setFeedback({
                      text: 'Cadeado 2 aberto! Só falta a palavra final!',
                      tone: 'success',
                    });
                    advanceStep(2);
                  } else {
                    sound.playGentleTryAgain();
                    onGentleRetry?.();
                    setFeedback({
                      text: `Conta outra vez com calma — ${n} não é o total de lanternas.`,
                      tone: 'gentle',
                    });
                  }
                }}
                className="min-w-[80px] min-h-[60px] px-6 rounded-2xl bg-white hover:bg-[#ECFDF5] border-2 border-[#CBD5E1] hover:border-[#10B981] font-display text-3xl font-bold tabular-nums cursor-pointer active:scale-95"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-pop">
          <PuzzleInstruction
            goal="Abrir o último cadeado formando a palavra da nossa equipa."
            roundLabel="Cadeado 3 de 3 · Palavra Especial"
            instruction={`Forma a palavra "${targetWord}" tocando nas letras por ordem!`}
          />
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {targetWord.split('').map((ch, idx) => {
              const filled = typedWord[idx];
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 sm:w-14 sm:h-15 rounded-2xl border-2 font-display text-2xl sm:text-3xl font-bold flex items-center justify-center ${
                    filled
                      ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                      : 'bg-white border-dashed border-[#94A3B8] text-[#CBD5E1]'
                  }`}
                >
                  {filled || ch.replace(/./, '·')}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {wordLetters.map((letter, idx) => (
              <button
                key={`${letter}-${idx}`}
                type="button"
                disabled={finished}
                onClick={() => {
                  const expected = targetWord[typedWord.length];
                  if (letter === expected) {
                    sound.playTap();
                    const nextWord = typedWord + letter;
                    setTypedWord(nextWord);
                    setFeedback(null);
                    if (nextWord === targetWord) {
                      sound.playSuccess();
                      setFinished(true);
                      setExplanation(
                        'Todos os três cadeados abriram! O Baú da Amizade guarda o carimbo final do mapa!'
                      );
                      setFeedback({
                        text: 'O Baú da Amizade abriu-se!',
                        tone: 'success',
                      });
                      setTimeout(() => onComplete(), 1100);
                    }
                  } else {
                    sound.playGentleTryAgain();
                    onGentleRetry?.();
                    setFeedback({
                      text: `Agora procuramos a letra "${expected}" para continuar "${targetWord}". Tenta outra vez!`,
                      tone: 'gentle',
                    });
                  }
                }}
                className="w-13 h-14 rounded-2xl bg-white hover:bg-[#CCFBF1] border-2 border-[#0D9488] font-display text-2xl font-bold text-[#0F766E] shadow-sm cursor-pointer active:scale-95"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      <HelperBar
        character="athenas"
        buttonLabel="Pedir pista"
        hintsUsed={hintsUsed}
        currentHint={currentHint}
        dogBehaviorNote={dogNote}
        feedbackText={feedback?.text ?? null}
        feedbackTone={feedback?.tone}
        explanationText={explanation}
        onRequestHint={handleHint}
        onShowCalmSolution={handleCalmSolution}
        disabled={finished}
      />
    </div>
  );
};
