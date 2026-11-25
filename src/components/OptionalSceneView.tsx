import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Eye, Heart, Volume2, VolumeX } from 'lucide-react';
import { AgeGroup, OptionalDiscoverySpot, OptionalSceneData } from '../types/game';
import { CharacterAvatar, NatureItemIcon } from './CharacterArt';
import { sound } from '../utils/sound';

interface OptionalSceneViewProps {
  scene: OptionalSceneData;
  ageGroup: AgeGroup;
  alreadyExplored: boolean;
  onCompleteExploration: (chapterId: number, discoveryNote: string, coopUsed: boolean) => void;
  onSkipOrContinue: () => void;
}

export const OptionalSceneView: React.FC<OptionalSceneViewProps> = ({
  scene,
  ageGroup,
  alreadyExplored,
  onCompleteExploration,
  onSkipOrContinue,
}) => {
  const visibleSpots =
    ageGroup === '5-7'
      ? scene.spots.filter((s) => !s.hardOnly)
      : scene.spots;

  const [inspectedIds, setInspectedIds] = useState<string[]>([]);
  const [activeSpot, setActiveSpot] = useState<OptionalDiscoverySpot | null>(null);
  const [coopChoiceId, setCoopChoiceId] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(alreadyExplored);
  const [speaking, setSpeaking] = useState(sound.isSpeaking);

  useEffect(() => {
    sound.subscribeSpeaking(setSpeaking);
    return () => sound.subscribeSpeaking(() => {});
  }, []);

  const selectedCoop = scene.coopOptions.find((o) => o.id === coopChoiceId);

  const handleInspect = (spot: OptionalDiscoverySpot) => {
    sound.playTap();
    setActiveSpot(spot);
    if (!inspectedIds.includes(spot.id)) {
      const next = [...inspectedIds, spot.id];
      setInspectedIds(next);
      if (next.length === visibleSpots.length && !claimed) {
        sound.playSuccess();
        setClaimed(true);
        onCompleteExploration(scene.chapterId, scene.summaryDiscovery, Boolean(coopChoiceId));
      }
    }
  };

  const handleCoopPick = (optionId: string) => {
    sound.playSuccess();
    setCoopChoiceId(optionId);
    if (!claimed && inspectedIds.length >= 1) {
      setClaimed(true);
      onCompleteExploration(scene.chapterId, scene.summaryDiscovery, true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 animate-pop">
      <div className="rounded-3xl bg-white border-2 border-[#E2DAC3] shadow-sm p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#EFE9D8]">
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-[#7C3AED]">
              Cena Opcional de Exploração · Capítulo {scene.chapterId}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E2B2A]">
              {scene.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              speaking ? sound.stopSpeech() : sound.speak(`${scene.title}. ${scene.intro}`)
            }
            className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl font-bold text-sm cursor-pointer ${
              speaking
                ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]'
                : 'bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E]'
            }`}
          >
            {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{speaking ? 'Parar voz' : 'Ouvir'}</span>
          </button>
        </div>

        <p className="text-base font-semibold text-[#334155] leading-relaxed">
          {scene.intro}
        </p>

        {/* Interactive Discovery Spots */}
        <div>
          <p className="text-sm font-extrabold text-[#0F766E] mb-3 tabular-nums">
            Toca nos detalhes do lugar para observar ({inspectedIds.length} de {visibleSpots.length}):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visibleSpots.map((spot) => {
              const seen = inspectedIds.includes(spot.id);
              const isSelected = activeSpot?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleInspect(spot)}
                  className={`min-h-[116px] p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-transform duration-150 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#EDE9FE] border-[#7C3AED] ring-2 ring-[#C4B5FD]'
                      : seen
                      ? 'bg-[#D1FAE5]/60 border-[#10B981]'
                      : 'bg-[#FAF6EC] hover:bg-[#FEF3C7] border-[#E2DAC3]'
                  }`}
                >
                  <NatureItemIcon id={spot.icon} size={48} />
                  <span className="font-bold text-sm text-[#1E2B2A]">{spot.label}</span>
                  <span className="text-xs font-bold text-[#4B5E5B] inline-flex items-center gap-1">
                    {seen ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#059669] stroke-[3]" />
                        <span>Observado</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Observar</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovery Detail Box */}
        {activeSpot && (
          <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#E2DAC3] flex items-start gap-3.5 animate-pop">
            <div className="flex -space-x-2 shrink-0">
              <CharacterAvatar character={scene.helperGirl} size={48} />
              <CharacterAvatar character={scene.helperDog} size={48} />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-[#1E2B2A]">
                {scene.helperGirl === 'esmeralda' ? 'Esmeralda' : 'Larissa'}: “{activeSpot.detailText}”
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#5B21B6]">
                {activeSpot.dogBehavior}
              </p>
            </div>
          </div>
        )}

        {/* Optional Cooperation Choice */}
        <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-[#99F6E4] space-y-3">
          <p className="font-display text-lg font-bold text-[#0F766E] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#EC4899]" />
            <span>{scene.coopPrompt}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scene.coopOptions.map((opt) => {
              const picked = coopChoiceId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleCoopPick(opt.id)}
                  className={`p-3.5 min-h-[52px] rounded-2xl border-2 text-left text-sm font-bold cursor-pointer transition-transform active:scale-95 ${
                    picked
                      ? 'bg-[#0D9488] border-[#0F766E] text-white'
                      : 'bg-white hover:bg-[#CCFBF1]/40 border-[#CBD5E1] text-[#1E2B2A]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {selectedCoop && (
            <p className="text-sm font-bold text-[#0F766E] bg-white p-3 rounded-xl border border-[#99F6E4] animate-pop">
              {selectedCoop.result}
            </p>
          )}
        </div>

        {/* Footer actions - never blocks story */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-sm font-bold text-[#B45309]">
            {claimed
              ? 'Ganhaste reconhecimento de Curiosidade & Cooperação!'
              : 'Podes explorar tudo ou avançar quando quiseres.'}
          </p>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              sound.stopSpeech();
              onSkipOrContinue();
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[50px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-bold text-lg cursor-pointer"
          >
            <span>Seguir para a Aventura</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
