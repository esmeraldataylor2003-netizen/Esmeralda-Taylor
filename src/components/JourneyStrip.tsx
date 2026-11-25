import React from 'react';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface JourneyStripProps {
  currentGoal: string;
  discoveredSummary: string;
  nextStep: string;
}

export const JourneyStrip: React.FC<JourneyStripProps> = ({
  currentGoal,
  discoveredSummary,
  nextStep,
}) => {
  return (
    <section
      aria-label="Resumo da tua viagem"
      className="rounded-2xl bg-[#FFFDF7] border border-[#E2DAC3] px-4 py-3 mb-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm"
    >
      <div className="flex items-start gap-2.5">
        <Compass className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-extrabold text-[#0F766E]">Objetivo atual</p>
          <p className="font-bold text-[#1E2B2A] leading-snug">{currentGoal}</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 md:border-l md:border-[#EFE9D8] md:pl-3">
        <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-extrabold text-[#B45309]">Já descobrimos</p>
          <p className="font-bold text-[#1E2B2A] leading-snug">{discoveredSummary}</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 md:border-l md:border-[#EFE9D8] md:pl-3">
        <ArrowRight className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-extrabold text-[#6D28D9]">Próximo passo</p>
          <p className="font-bold text-[#1E2B2A] leading-snug">{nextStep}</p>
        </div>
      </div>
    </section>
  );
};
