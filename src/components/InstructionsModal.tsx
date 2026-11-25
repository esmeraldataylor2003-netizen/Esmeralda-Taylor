import React from 'react';
import { HelpCircle, Volume2, VolumeX, X } from 'lucide-react';
import { AgeGroup } from '../types/game';
import { sound } from '../utils/sound';

interface InstructionsModalProps {
  ageGroup: AgeGroup;
  muted: boolean;
  volume: number;
  currentInstructionText: string;
  onChangeAge: (age: AgeGroup) => void;
  onSetVolume: (vol: number, muted: boolean) => void;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  ageGroup,
  muted,
  volume,
  currentInstructionText,
  onChangeAge,
  onSetVolume,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#1E2B2A]/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Instruções e Controlo de Áudio"
    >
      <div className="bg-[#FDF8EE] border-2 border-[#E2DAC3] rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-pop space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E2DAC3]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#0D9488]" />
            <h2 className="font-display text-2xl font-bold text-[#1E2B2A]">
              Como Jogar &amp; Som
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar instruções"
            className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5 text-[#334155]" />
          </button>
        </div>

        {/* Current instruction review */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DAC3] space-y-2.5">
          <p className="text-xs font-extrabold text-[#0F766E]">
            O que fazer agora:
          </p>
          <p className="text-base font-bold text-[#1E2B2A] leading-relaxed">
            {currentInstructionText}
          </p>
          <button
            type="button"
            onClick={() => sound.speak(currentInstructionText)}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-xl bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E] font-bold text-sm cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir em voz alta</span>
          </button>
        </div>

        {/* Friendly Rules */}
        <div className="space-y-2 text-sm font-semibold text-[#334155]">
          <p className="font-extrabold text-[#1E2B2A]">Regras da nossa aventura:</p>
          <p>· Toca ou clica nos desenhos e botões grandes para responder.</p>
          <p>· Podes tentar as vezes que precisares — nunca perdes estrelas nem recompensas!</p>
          <p>· A Esmeralda e a Larissa observam os sinais da Athenas e do Lucky para te dar até 3 pistas gentis.</p>
          <p>· O teu progresso fica guardado automaticamente para continuares quando quiseres.</p>
        </div>

        {/* Age mode & volume */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#E2DAC3]">
            <p className="text-xs font-extrabold text-[#1E2B2A] mb-2">Idade:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeAge('5-7')}
                className={`py-2 px-2 rounded-xl font-bold text-xs cursor-pointer ${
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
                className={`py-2 px-2 rounded-xl font-bold text-xs cursor-pointer ${
                  ageGroup === '8-10'
                    ? 'bg-[#F59E0B] text-[#1E2B2A]'
                    : 'bg-[#F4EFE2] text-[#334155]'
                }`}
              >
                8–10 anos
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2DAC3]">
            <p className="text-xs font-extrabold text-[#1E2B2A] mb-2">Som e Voz:</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onSetVolume(volume, true)}
                className={`py-2 px-1 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer ${
                  muted ? 'bg-[#334155] text-white' : 'bg-[#F4EFE2] text-[#334155]'
                }`}
                title="Som desligado"
              >
                <VolumeX className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSetVolume(0.35, false)}
                className={`py-2 px-1 rounded-xl font-bold text-xs cursor-pointer ${
                  !muted && volume <= 0.45
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-[#F4EFE2] text-[#334155]'
                }`}
              >
                Suave
              </button>
              <button
                type="button"
                onClick={() => onSetVolume(0.85, false)}
                className={`py-2 px-1 rounded-xl font-bold text-xs cursor-pointer ${
                  !muted && volume > 0.45
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-[#F4EFE2] text-[#334155]'
                }`}
              >
                Médio
              </button>
            </div>
          </div>
        </div>

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
