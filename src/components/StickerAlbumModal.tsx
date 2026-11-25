import React from 'react';
import { Award, Compass, Heart, Map, Sparkles, X } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { MedalCounts } from '../types/game';
import { StickerBadgeArt } from './CharacterArt';

interface StickerAlbumModalProps {
  unlockedStickers: string[];
  completedChapters: number[];
  medals: MedalCounts;
  discoveriesLog: string[];
  onClose: () => void;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  unlockedStickers,
  completedChapters,
  medals,
  discoveriesLog,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#1E2B2A]/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Álbum de Autocolantes, Medalhas e Mapa"
    >
      <div className="bg-[#FDF8EE] border-2 border-[#E2DAC3] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-pop space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E2DAC3]">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E2B2A]">
              Álbum de Autocolantes &amp; Medalhas
            </h2>
            <p className="text-sm font-bold text-[#4B5E5B] tabular-nums">
              {unlockedStickers.length} de {CHAPTERS.length} autocolantes · Caderno-Mapa da Avó
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar álbum"
            className="w-11 h-11 rounded-2xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center cursor-pointer"
          >
            <X className="w-6 h-6 text-[#334155]" />
          </button>
        </div>

        {/* Effort, Curiosity, Cooperation Medals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-3">
            <Award className="w-8 h-8 text-[#D97706] shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-[#B45309]">Esforço</p>
              <p className="font-display text-xl font-bold text-[#1E2B2A] tabular-nums">
                {medals.effort} {medals.effort === 1 ? 'reconhecimento' : 'reconhecimentos'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-[#C4B5FD] flex items-center gap-3">
            <Compass className="w-8 h-8 text-[#7C3AED] shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-[#5B21B6]">Curiosidade</p>
              <p className="font-display text-xl font-bold text-[#1E2B2A] tabular-nums">
                {medals.curiosity} {medals.curiosity === 1 ? 'descoberta' : 'descobertas'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCE7F3] border border-[#FBCFE8] flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#DB2777] shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-[#9D174D]">Cooperação</p>
              <p className="font-display text-xl font-bold text-[#1E2B2A] tabular-nums">
                {medals.cooperation} {medals.cooperation === 1 ? 'gesto' : 'gestos'}
              </p>
            </div>
          </div>
        </div>

        {/* Stickers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAPTERS.map((chap) => {
            const unlocked = unlockedStickers.includes(chap.sticker.id);
            return (
              <div
                key={chap.sticker.id}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2 ${
                  unlocked
                    ? 'bg-white border-[#F59E0B]/60 shadow-sm'
                    : 'bg-[#F4EFE2] border-[#E2DAC3]'
                }`}
              >
                <StickerBadgeArt
                  stickerId={chap.sticker.id}
                  size={74}
                  unlocked={unlocked}
                />
                <h3 className="font-display text-lg font-bold text-[#1E2B2A]">
                  {unlocked ? chap.sticker.name : 'Autocolante por descobrir'}
                </h3>
                <p className="text-xs font-semibold text-[#4B5E5B]">
                  {unlocked
                    ? chap.sticker.description
                    : `Completa o Capítulo ${chap.id} para ganhar!`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Map Pages */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DAC3]">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-[#0D9488]" />
            <h3 className="font-display text-lg font-bold text-[#1E2B2A]">
              Páginas do Caderno-Mapa
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CHAPTERS.map((chap) => {
              const hasPiece = completedChapters.includes(chap.id);
              return (
                <div
                  key={chap.id}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                    hasPiece
                      ? 'bg-[#CCFBF1] border-[#14B8A6] text-[#0F766E]'
                      : 'bg-[#F8FAFC] border-dashed border-[#CBD5E1] text-[#64748B]'
                  }`}
                >
                  {hasPiece ? chap.mapPieceLabel : `Página ${chap.id} · ?`}
                </div>
              );
            })}
          </div>
        </div>

        {/* Discoveries Log */}
        {discoveriesLog.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-[#E2DAC3] space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D97706]" />
              <h3 className="font-display text-lg font-bold text-[#1E2B2A]">
                Diário de Descobertas
              </h3>
            </div>
            <ul className="space-y-1 text-sm font-semibold text-[#334155]">
              {discoveriesLog.map((entry, idx) => (
                <li key={idx}>· {entry}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 min-h-[48px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-bold text-base cursor-pointer"
          >
            Voltar ao Jogo
          </button>
        </div>
      </div>
    </div>
  );
};
