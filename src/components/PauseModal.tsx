import React from 'react';
import { Home, Map, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { AgeGroup } from '../types/game';
import { PWAInstallButton } from './PWAInstallButton';

interface PauseModalProps {
  ageGroup: AgeGroup;
  muted: boolean;
  volume: number;
  onChangeAge: (age: AgeGroup) => void;
  onSetVolume: (vol: number, muted: boolean) => void;
  onResume: () => void;
  onGoMap: () => void;
  onGoTitle: () => void;
  onResetAdventure: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  ageGroup,
  muted,
  volume,
  onChangeAge,
  onSetVolume,
  onResume,
  onGoMap,
  onGoTitle,
  onResetAdventure,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#1E2B2A]/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de Pausa"
    >
      <div className="bg-[#FDF8EE] border-2 border-[#E2DAC3] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-pop space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-[#1E2B2A]">
            Pausa na Aventura
          </h2>
          <p className="text-sm font-semibold text-[#4B5E5B]">
            Podes descansar, ajustar o som ou escolher o modo de idade.
          </p>
        </div>

        {/* Age toggle */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DAC3]">
          <p className="text-sm font-extrabold text-[#1E2B2A] mb-2">
            Dificuldade por idade:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeAge('5-7')}
              className={`py-2.5 px-3 min-h-[44px] rounded-xl font-display font-bold text-sm cursor-pointer ${
                ageGroup === '5-7'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#F4EFE2] text-[#334155]'
              }`}
            >
              5–7 anos
            </button>
            <button
              type="button"
              onClick={() => onChangeAge('8-10')}
              className={`py-2.5 px-3 min-h-[44px] rounded-xl font-display font-bold text-sm cursor-pointer ${
                ageGroup === '8-10'
                  ? 'bg-[#F59E0B] text-[#1E2B2A]'
                  : 'bg-[#F4EFE2] text-[#334155]'
              }`}
            >
              8–10 anos
            </button>
          </div>
        </div>

        {/* Volume & Sound Control */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DAC3]">
          <p className="text-sm font-extrabold text-[#1E2B2A] mb-2">
            Volume dos sons e voz:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSetVolume(volume, true)}
              className={`py-2.5 px-2 min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer ${
                muted
                  ? 'bg-[#334155] text-white'
                  : 'bg-[#F4EFE2] text-[#334155]'
              }`}
            >
              <VolumeX className="w-4 h-4" />
              <span>Desligado</span>
            </button>
            <button
              type="button"
              onClick={() => onSetVolume(0.35, false)}
              className={`py-2.5 px-2 min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer ${
                !muted && volume <= 0.45
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#F4EFE2] text-[#334155]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Suave</span>
            </button>
            <button
              type="button"
              onClick={() => onSetVolume(0.85, false)}
              className={`py-2.5 px-2 min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer ${
                !muted && volume > 0.45
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#F4EFE2] text-[#334155]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Médio</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3.5 min-h-[50px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-bold text-lg cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Continuar a Jogar</span>
          </button>

          <button
            type="button"
            onClick={onGoMap}
            className="w-full flex items-center justify-center gap-2 py-3 min-h-[48px] rounded-2xl bg-white hover:bg-[#F8FAFC] border-2 border-[#E2DAC3] text-[#1E2B2A] font-display font-bold text-base cursor-pointer"
          >
            <Map className="w-5 h-5 text-[#0D9488]" />
            <span>Ir para o Mapa</span>
          </button>

          <button
            type="button"
            onClick={onGoTitle}
            className="w-full flex items-center justify-center gap-2 py-3 min-h-[48px] rounded-2xl bg-white hover:bg-[#F8FAFC] border-2 border-[#E2DAC3] text-[#1E2B2A] font-display font-bold text-base cursor-pointer"
          >
            <Home className="w-5 h-5 text-[#64748B]" />
            <span>Ecrã Inicial</span>
          </button>

          <div className="flex justify-center">
            <PWAInstallButton compact />
          </div>

          <button
            type="button"
            onClick={onResetAdventure}
            className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-bold text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recomeçar Aventura do Zero</span>
          </button>
        </div>
      </div>
    </div>
  );
};
