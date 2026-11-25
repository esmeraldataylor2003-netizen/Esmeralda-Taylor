import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/sound';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } =
    usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          sound.playTap();
          void install();
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-bold shadow-sm cursor-pointer transition-colors ${
          compact
            ? 'px-3.5 py-2.5 min-h-[44px] text-sm'
            : 'px-5 py-3.5 min-h-[52px] text-base'
        }`}
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Instalar no Telemóvel</span>
      </button>
    );
  }

  if (isIOS || isAndroid) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setShowGuide(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-white/95 hover:bg-white text-[#0F766E] border border-[#99F6E4] font-bold text-sm shadow-sm cursor-pointer"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Como instalar</span>
        </button>

        {showGuide && (
          <div
            className="fixed inset-0 z-50 bg-[#1E2B2A]/60 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Instalar no telemóvel"
          >
            <div className="bg-[#FDF8EE] border-2 border-[#E2DAC3] rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-pop space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl font-bold text-[#1E2B2A]">
                  Instalar no Telemóvel
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  aria-label="Fechar"
                  className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {isIOS ? (
                <ol className="space-y-2 text-sm font-semibold text-[#334155]">
                  <li>1. Toca no botão <strong>Partilhar</strong> na barra do Safari.</li>
                  <li>2. Escolhe <strong>Adicionar ao ecrã principal</strong>.</li>
                  <li>3. Depois podes abrir o jogo sem internet!</li>
                </ol>
              ) : (
                <ol className="space-y-2 text-sm font-semibold text-[#334155]">
                  <li>1. Abre o menu do navegador Android (os três pontinhos).</li>
                  <li>2. Toca em <strong>Instalar aplicação</strong> ou <strong>Adicionar ao ecrã principal</strong>.</li>
                  <li>3. O jogo fica guardado no telemóvel e funciona sem internet!</li>
                </ol>
              )}
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="w-full py-3 min-h-[46px] rounded-2xl bg-[#0D9488] text-white font-display font-bold cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
