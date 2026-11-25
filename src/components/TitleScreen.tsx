import React from 'react';
import { Play, BookOpen, Volume2, VolumeX, Map as MapIcon, HelpCircle, Castle } from 'lucide-react';
import { AgeGroup, ResumePoint } from '../types/game';
import { COVER_ILLUSTRATION } from '../data/chapters';
import { CharacterAvatar } from './CharacterArt';
import { StoryImage } from './StoryImage';
import { PWAInstallButton } from './PWAInstallButton';

interface TitleScreenProps {
  ageGroup: AgeGroup;
  onSelectAge: (age: AgeGroup) => void;
  onStart: () => void;
  onResumeLast?: () => void;
  onOpenCastle: () => void;
  onOpenAlbum: () => void;
  onOpenInstructions: () => void;
  hasProgress: boolean;
  resumePoint?: ResumePoint;
  muted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  ageGroup,
  onSelectAge,
  onStart,
  onResumeLast,
  onOpenCastle,
  onOpenAlbum,
  onOpenInstructions,
  hasProgress,
  resumePoint,
  muted,
  onToggleMute,
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between bg-[#E0F4F1]">
      <div className="absolute inset-0">
        <StoryImage
          src={COVER_ILLUSTRATION}
          alt="Ilustração da Esmeralda, Larissa, Athenas e Lucky a descobrir o mapa encantado"
          className="w-full h-full object-cover object-center lg:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF7]/95 via-[#FFFDF7]/85 sm:via-[#FFFDF7]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF7]/85 via-transparent to-[#FFFDF7]/30 lg:hidden" />
      </div>

      <div className="relative z-10 flex flex-wrap justify-end gap-2 p-3 sm:p-6">
        <PWAInstallButton compact />

        <button
          type="button"
          onClick={onOpenInstructions}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-2xl bg-white/90 hover:bg-white text-[#1E2B2A] font-bold text-xs sm:text-sm shadow-sm border border-[#E2DAC3] cursor-pointer transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-[#0D9488] shrink-0" />
          <span>Como jogar</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Ativar som' : 'Silenciar som'}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-2xl bg-white/90 hover:bg-white text-[#1E2B2A] font-bold text-xs sm:text-sm shadow-sm border border-[#E2DAC3] cursor-pointer transition-colors"
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-[#64748B] shrink-0" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#0D9488] shrink-0" />
          )}
          <span>{muted ? 'Som desligado' : 'Som ligado'}</span>
        </button>
      </div>

      <main className="relative z-10 flex-1 flex items-center px-5 sm:px-10 lg:px-16 py-4">
        <div className="max-w-xl w-full">
          <svg
            viewBox="0 0 540 165"
            className="w-full max-w-[490px] h-auto mb-3 drop-shadow-sm"
            role="img"
            aria-label="Aventura da Esmeralda & Larissa"
          >
            <defs>
              <linearGradient id="titleRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#0891B2" />
              </linearGradient>
            </defs>
            <rect
              x="4"
              y="6"
              width="210"
              height="34"
              rx="17"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            <text
              x="109"
              y="28"
              textAnchor="middle"
              fill="#B45309"
              fontSize="16"
              fontWeight="700"
              fontFamily="Fredoka, sans-serif"
            >
              História &amp; Enigmas · 5–10 anos
            </text>

            <text
              x="4"
              y="92"
              fill="url(#titleRibbon)"
              fontSize="52"
              fontWeight="700"
              fontFamily="Fredoka, sans-serif"
            >
              Aventura da
            </text>
            <text
              x="4"
              y="146"
              fill="#1E2B2A"
              fontSize="47"
              fontWeight="700"
              fontFamily="Fredoka, sans-serif"
            >
              Esmeralda &amp; Larissa
            </text>
          </svg>

          <p className="text-base sm:text-lg font-semibold text-[#334155] leading-relaxed mb-5 max-w-md">
            Segue o caderno-mapa pelos cinco lugares da natureza, explora níveis avançados e
            brinca no <strong className="text-[#0F766E]">Castelo das Bonecas</strong>!
          </p>

          <div className="flex items-center gap-3 mb-6">
            {(
              [
                { id: 'esmeralda', name: 'Esmeralda' },
                { id: 'larissa', name: 'Larissa' },
                { id: 'athenas', name: 'Athenas' },
                { id: 'lucky', name: 'Lucky' },
              ] as const
            ).map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-1">
                <CharacterAvatar character={c.id} size={54} />
                <span className="text-xs font-extrabold text-[#1E2B2A]">{c.name}</span>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-sm font-extrabold text-[#334155] mb-2">
              Escolhe a tua idade para ajustar os desafios:
            </p>
            <div className="inline-flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#F4EFE2] border border-[#E2DAC3] max-w-full">
              <button
                type="button"
                onClick={() => onSelectAge('5-7')}
                className={`px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl font-display font-semibold text-sm sm:text-base transition-all cursor-pointer sm:whitespace-nowrap ${
                  ageGroup === '5-7'
                    ? 'bg-[#0D9488] text-white shadow-sm'
                    : 'text-[#334155] hover:bg-white/60'
                }`}
              >
                5–7 anos · Exploradores
              </button>
              <button
                type="button"
                onClick={() => onSelectAge('8-10')}
                className={`px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl font-display font-semibold text-sm sm:text-base transition-all cursor-pointer sm:whitespace-nowrap ${
                  ageGroup === '8-10'
                    ? 'bg-[#F59E0B] text-[#1E2B2A] shadow-sm'
                    : 'text-[#334155] hover:bg-white/60'
                }`}
              >
                8–10 anos · Detetives
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {resumePoint && onResumeLast ? (
              <button
                type="button"
                onClick={onResumeLast}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-4 min-h-[56px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display text-lg sm:text-xl font-bold shadow-lg shadow-[#0D9488]/25 transition-transform duration-150 active:scale-95 cursor-pointer max-w-full sm:whitespace-nowrap"
              >
                <Play className="w-6 h-6 fill-current shrink-0" />
                <span>Continuar de onde parei</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-4 min-h-[56px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display text-lg sm:text-xl font-bold shadow-lg shadow-[#0D9488]/25 transition-transform duration-150 active:scale-95 cursor-pointer max-w-full sm:whitespace-nowrap"
              >
                <Play className="w-6 h-6 fill-current shrink-0" />
                <span>Começar Aventura</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCastle}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 min-h-[56px] rounded-2xl bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#9D174D] border-2 border-[#F472B6]/60 font-display text-base sm:text-lg font-bold shadow-sm transition-transform duration-150 active:scale-95 cursor-pointer max-w-full sm:whitespace-nowrap"
            >
              <Castle className="w-5 h-5 shrink-0" />
              <span>Castelo das Bonecas</span>
            </button>

            {resumePoint && (
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 min-h-[56px] rounded-2xl bg-white/95 hover:bg-white text-[#1E2B2A] border-2 border-[#E2DAC3] font-display text-base sm:text-lg font-semibold shadow-sm transition-transform duration-150 active:scale-95 cursor-pointer max-w-full sm:whitespace-nowrap"
              >
                <MapIcon className="w-5 h-5 text-[#0D9488] shrink-0" />
                <span>Ver Mapa</span>
              </button>
            )}

            {hasProgress && (
              <button
                type="button"
                onClick={onOpenAlbum}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 min-h-[56px] rounded-2xl bg-white/95 hover:bg-white text-[#1E2B2A] border-2 border-[#E2DAC3] font-display text-base sm:text-lg font-semibold shadow-sm transition-transform duration-150 active:scale-95 cursor-pointer max-w-full sm:whitespace-nowrap"
              >
                <BookOpen className="w-5 h-5 text-[#D97706] shrink-0" />
                <span>Álbum &amp; Medalhas</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-3 text-center sm:text-left">
        <p className="text-xs sm:text-sm font-bold text-[#334155]/90">
          Clica ou toca para jogar · Enter para começar · Setas no labirinto · M para som
        </p>
      </footer>
    </div>
  );
};
