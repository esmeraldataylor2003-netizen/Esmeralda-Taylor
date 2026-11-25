import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { CharacterAvatar } from '../CharacterArt';
import { sound } from '../../utils/sound';

interface PuzzleInstructionProps {
  goal: string;
  instruction: string;
  roundLabel?: string;
}

export const PuzzleInstruction: React.FC<PuzzleInstructionProps> = ({
  goal,
  instruction,
  roundLabel,
}) => {
  const [speaking, setSpeaking] = useState(sound.isSpeaking);

  useEffect(() => {
    sound.subscribeSpeaking(setSpeaking);
    return () => sound.subscribeSpeaking(() => {});
  }, []);

  const handleToggleSpeech = () => {
    if (speaking) {
      sound.stopSpeech();
    } else {
      sound.speak(`${goal} ${instruction}`);
    }
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-[#EFE9D8]">
      <div className="flex-1 min-w-[220px]">
        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-[#0F766E] mb-1">
          {roundLabel && <span className="tabular-nums">{roundLabel}</span>}
          {roundLabel && <span aria-hidden="true">·</span>}
          <span>Objetivo: {goal}</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E2B2A] leading-snug">
          {instruction}
        </h3>
      </div>

      <button
        type="button"
        onClick={handleToggleSpeech}
        className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0D9488] ${
          speaking
            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]'
            : 'bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E]'
        }`}
        aria-label={speaking ? 'Parar leitura em voz alta' : 'Ouvir instrução'}
      >
        {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        <span>{speaking ? 'Parar voz' : 'Ouvir'}</span>
      </button>
    </div>
  );
};

interface HelperBarProps {
  character: 'athenas' | 'lucky';
  buttonLabel: string;
  hintsUsed: number; // 0..3
  maxHints?: number;
  currentHint: string | null;
  dogBehaviorNote?: string | null;
  feedbackText: string | null;
  feedbackTone?: 'gentle' | 'success';
  explanationText?: string | null;
  onRequestHint: () => void;
  onShowCalmSolution?: () => void;
  disabled?: boolean;
}

export const HelperBar: React.FC<HelperBarProps> = ({
  character,
  buttonLabel,
  hintsUsed,
  maxHints = 3,
  currentHint,
  dogBehaviorNote,
  feedbackText,
  feedbackTone = 'gentle',
  explanationText,
  onRequestHint,
  onShowCalmSolution,
  disabled = false,
}) => {
  const girlHelper = character === 'athenas' ? 'Esmeralda' : 'Larissa';

  return (
    <div className="mt-5 pt-4 border-t border-[#E5DEC9] space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-h-[58px]">
          <CharacterAvatar
            character={character}
            size={56}
            className={`shrink-0 ${currentHint ? 'animate-wiggle' : ''}`}
          />
          <div className="flex-1 space-y-1">
            {feedbackText ? (
              <p
                className={`font-bold text-base animate-pop flex items-start gap-1.5 ${
                  feedbackTone === 'success' ? 'text-[#0F766E]' : 'text-[#B45309]'
                }`}
              >
                {feedbackTone === 'success' && (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#10B981]" />
                )}
                <span>{feedbackText}</span>
              </p>
            ) : currentHint ? (
              <div className="animate-pop space-y-0.5">
                {dogBehaviorNote && (
                  <p className="text-xs font-extrabold text-[#6D28D9]">
                    {dogBehaviorNote}
                  </p>
                )}
                <p className="text-sm sm:text-base font-bold text-[#1E2B2A]">
                  {girlHelper}: “{currentHint}”
                </p>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-[#4B5E5B] font-semibold">
                {character === 'athenas'
                  ? 'A Athenas fareja com atenção ao lado da Esmeralda. Podes pedir até 3 pistas!'
                  : 'O Lucky observa o caminho ao lado da Larissa. Podes pedir até 3 pistas!'}
              </p>
            )}

            {explanationText && (
              <p className="text-sm font-semibold text-[#0F766E] bg-[#E6F4F1] px-3 py-2 rounded-xl animate-pop">
                {explanationText}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {hintsUsed < maxHints ? (
            <button
              type="button"
              onClick={() => {
                sound.playHint();
                onRequestHint();
              }}
              disabled={disabled}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-2xl font-display font-semibold text-sm sm:text-base text-center transition-transform duration-150 active:scale-95 cursor-pointer sm:whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${
                character === 'athenas'
                  ? 'bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] border-2 border-[#C4B5FD] focus-visible:outline-[#7C3AED]'
                  : 'bg-[#FFEDD5] hover:bg-[#FED7AA] text-[#9A3412] border-2 border-[#FDBA74] focus-visible:outline-[#EA580C]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Sparkles className="w-5 h-5" />
              <span>
                {buttonLabel} ({hintsUsed}/{maxHints})
              </span>
            </button>
          ) : (
            onShowCalmSolution &&
            !disabled && (
              <button
                type="button"
                onClick={() => {
                  sound.playHint();
                  onShowCalmSolution();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] border-2 border-[#7DD3FC] font-display font-semibold text-base cursor-pointer whitespace-nowrap"
              >
                <Eye className="w-5 h-5" />
                <span>Ver solução explicada</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
