import React from 'react';
import { Award, Castle, Check, Compass, Lock, Play, Sparkles, Star } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { MedalCounts } from '../types/game';
import { CharacterAvatar, StickerBadgeArt } from './CharacterArt';
import { StoryImage } from './StoryImage';
import { JourneyStrip } from './JourneyStrip';

interface MapHubScreenProps {
  completedChapters: number[];
  unlockedStickers: string[];
  exploredScenes: number[];
  completedExtras: number[];
  completedAdvanced: number[];
  medals: MedalCounts;
  onSelectChapter: (chapterId: number) => void;
  onSelectOptionalScene: (chapterId: number) => void;
  onSelectExtraChallenge: (chapterId: number) => void;
  onSelectAdvancedLevel: (chapterId: number) => void;
  onOpenCastle: () => void;
  onOpenAlbum: () => void;
}

export const MapHubScreen: React.FC<MapHubScreenProps> = ({
  completedChapters,
  unlockedStickers,
  exploredScenes,
  completedExtras,
  completedAdvanced,
  medals,
  onSelectChapter,
  onSelectOptionalScene,
  onSelectExtraChallenge,
  onSelectAdvancedLevel,
  onOpenCastle,
  onOpenAlbum,
}) => {
  const nextChapter =
    CHAPTERS.find((c) => !completedChapters.includes(c.id)) ?? CHAPTERS[CHAPTERS.length - 1];
  const allComplete = completedChapters.length === CHAPTERS.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-pop">
      <JourneyStrip
        currentGoal={
          allComplete
            ? 'Passeio completo! Podes explorar os Níveis Avançados ou brincar no Castelo das Bonecas.'
            : `Capítulo ${nextChapter.id}: ${nextChapter.objective}`
        }
        discoveredSummary={`${completedChapters.length}/${CHAPTERS.length} páginas · ${completedAdvanced.length}/5 níveis avançados · ${medals.effort + medals.curiosity + medals.cooperation} medalhas`}
        nextStep={
          allComplete
            ? 'Abre os Níveis Avançados ou decora o Castelo das Bonecas!'
            : `Abrir Capítulo ${nextChapter.id} (${nextChapter.placeName})`
        }
      />

      {/* Welcome & Castelo das Bonecas Shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white border-2 border-[#E2DAC3] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 shrink-0">
              <CharacterAvatar character="esmeralda" size={54} />
              <CharacterAvatar character="larissa" size={54} />
              <CharacterAvatar character="athenas" size={54} />
              <CharacterAvatar character="lucky" size={54} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E2B2A]">
                Mapa dos Cinco Lugares
              </h2>
              <p className="text-sm font-semibold text-[#4B5E5B]">
                Explora os capítulos, cenas opcionais, desafios extra e níveis avançados!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAlbum}
            className="px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-2 border-[#F59E0B]/50 font-display font-bold text-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            Álbum ({unlockedStickers.length}/{CHAPTERS.length})
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenCastle}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#FCE7F3] to-[#EDE9FE] hover:from-[#FBCFE8] hover:to-[#DDD6FE] border-2 border-[#F472B6]/60 shadow-sm text-left flex items-center justify-between gap-3 cursor-pointer transition-transform hover:-translate-y-0.5"
        >
          <div>
            <p className="text-xs font-extrabold text-[#9D174D]">Espaço Interativo</p>
            <h3 className="font-display text-xl font-bold text-[#1E2B2A]">
              Castelo das Bonecas
            </h3>
            <p className="text-xs font-semibold text-[#4B5E5B]">
              Brincar, rotinas e colar autocolantes!
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shrink-0">
            <Castle className="w-7 h-7 text-[#DB2777]" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHAPTERS.map((chapter) => {
          const isCompleted = completedChapters.includes(chapter.id);
          const isUnlocked =
            chapter.id === 1 ||
            completedChapters.includes(chapter.id - 1) ||
            isCompleted;
          const isNext = chapter.id === nextChapter.id && !isCompleted;
          const sceneDone = exploredScenes.includes(chapter.id);
          const extraDone = completedExtras.includes(chapter.id);
          const advDone = completedAdvanced.includes(chapter.id);

          return (
            <div
              key={chapter.id}
              className={`rounded-3xl overflow-hidden border-2 transition-transform duration-150 flex flex-col ${
                isNext
                  ? 'bg-white border-[#0D9488] ring-4 ring-[#99F6E4]/60 shadow-md'
                  : isCompleted
                  ? 'bg-white border-[#10B981]/60 shadow-sm'
                  : isUnlocked
                  ? 'bg-white border-[#E2DAC3] shadow-sm'
                  : 'bg-[#F4EFE2] border-[#E2DAC3] opacity-75'
              }`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E2DAC3]">
                <StoryImage
                  src={chapter.illustration}
                  alt={chapter.title}
                  className={`w-full h-full object-cover ${!isUnlocked ? 'grayscale' : ''}`}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-[#1E2B2A]/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-[#475569]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-extrabold text-[#4B5E5B] mb-1">
                    <span>
                      Capítulo {chapter.id} · {chapter.placeName}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[#059669]">
                        <Check className="w-4 h-4 stroke-[3]" /> Completo
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1E2B2A] leading-snug mb-1">
                    {chapter.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#4B5E5B]">
                    {chapter.objective}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1ECE0]">
                  <div className="flex items-center gap-2">
                    <StickerBadgeArt
                      stickerId={chapter.sticker.id}
                      size={38}
                      unlocked={isCompleted}
                    />
                    <span className="text-xs font-bold text-[#4B5E5B]">
                      {isCompleted ? chapter.sticker.name : 'Autocolante'}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectChapter(chapter.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl font-display font-bold text-sm cursor-pointer ${
                        isNext
                          ? 'bg-[#0D9488] hover:bg-[#0F766E] text-white'
                          : 'bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          <span>Rejogar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Explorar</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#64748B]">Bloqueado</span>
                  )}
                </div>

                {isUnlocked && (
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#F1ECE0]">
                    <button
                      type="button"
                      onClick={() => onSelectOptionalScene(chapter.id)}
                      className={`px-2 py-2 min-h-[38px] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border ${
                        sceneDone
                          ? 'bg-[#EDE9FE] border-[#C4B5FD] text-[#5B21B6]'
                          : 'bg-[#FAF6EC] hover:bg-[#EDE9FE]/50 border-[#E2DAC3] text-[#334155]'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{sceneDone ? 'Cena ✓' : 'Cena'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectExtraChallenge(chapter.id)}
                      className={`px-2 py-2 min-h-[38px] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border ${
                        extraDone
                          ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                          : 'bg-[#FAF6EC] hover:bg-[#FEF3C7]/60 border-[#E2DAC3] text-[#334155]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{extraDone ? 'Extra ✓' : 'Extra'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectAdvancedLevel(chapter.id)}
                      className={`px-2 py-2 min-h-[38px] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border ${
                        advDone
                          ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                          : 'bg-[#E0F2FE] hover:bg-[#BAE6FD] border-[#7DD3FC] text-[#0369A1]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{advDone ? 'Avanç. ✓' : 'Avançado'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
