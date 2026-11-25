import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Castle,
  Check,
  Compass,
  HelpCircle,
  Map as MapIcon,
  Pause,
  Play,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CHAPTERS } from './data/chapters';
import { COMBINED_CHALLENGES, OPTIONAL_SCENES } from './data/optionalContent';
import { ADVANCED_LEVELS } from './data/advancedLevels';
import { DEFAULT_CASTLE_STATE } from './data/castleData';
import { AgeGroup, CastleState, SavedProgress, ScreenState } from './types/game';
import { sound } from './utils/sound';
import { TitleScreen } from './components/TitleScreen';
import { MapHubScreen } from './components/MapHubScreen';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { PauseModal } from './components/PauseModal';
import { InstructionsModal } from './components/InstructionsModal';
import { JourneyStrip } from './components/JourneyStrip';
import { OptionalSceneView } from './components/OptionalSceneView';
import { DollhouseCastleView } from './components/DollhouseCastleView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CharacterAvatar, StickerBadgeArt } from './components/CharacterArt';
import { StoryImage } from './components/StoryImage';
import { ObservationPuzzle } from './components/puzzles/ObservationPuzzle';
import { PatternPuzzle } from './components/puzzles/PatternPuzzle';
import { MazePuzzle } from './components/puzzles/MazePuzzle';
import { CountingPuzzle } from './components/puzzles/CountingPuzzle';
import { MemoryPuzzle } from './components/puzzles/MemoryPuzzle';
import { LogicPuzzle } from './components/puzzles/LogicPuzzle';
import { WordPuzzle } from './components/puzzles/WordPuzzle';
import { OddOneOutPuzzle } from './components/puzzles/OddOneOutPuzzle';
import { ChestFinalePuzzle } from './components/puzzles/ChestFinalePuzzle';
import { CombinedExtraPuzzle } from './components/puzzles/CombinedExtraPuzzle';
import { AdvancedLevelPuzzle } from './components/puzzles/AdvancedLevelPuzzle';

const STORAGE_KEY = 'esmeralda_larissa_aventura_v4';

const DEFAULT_PROGRESS: SavedProgress = {
  ageGroup: '5-7',
  completedChapters: [],
  unlockedStickers: [],
  chapterChoices: {},
  exploredScenes: [],
  completedExtras: [],
  completedAdvanced: [],
  discoveriesLog: [],
  medals: {
    effort: 0,
    curiosity: 0,
    cooperation: 0,
  },
  stars: 0,
  muted: false,
  volume: 0.65,
  autoReadAloud: false,
  castle: DEFAULT_CASTLE_STATE,
};

function loadProgress(): SavedProgress {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('esmeralda_larissa_aventura_v3');
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      ageGroup: parsed.ageGroup === '8-10' ? '8-10' : '5-7',
      completedChapters: Array.isArray(parsed.completedChapters)
        ? parsed.completedChapters
        : [],
      unlockedStickers: Array.isArray(parsed.unlockedStickers)
        ? parsed.unlockedStickers
        : [],
      chapterChoices:
        parsed.chapterChoices && typeof parsed.chapterChoices === 'object'
          ? parsed.chapterChoices
          : {},
      exploredScenes: Array.isArray(parsed.exploredScenes)
        ? parsed.exploredScenes
        : [],
      completedExtras: Array.isArray(parsed.completedExtras)
        ? parsed.completedExtras
        : [],
      completedAdvanced: Array.isArray(parsed.completedAdvanced)
        ? parsed.completedAdvanced
        : [],
      discoveriesLog: Array.isArray(parsed.discoveriesLog)
        ? parsed.discoveriesLog
        : [],
      medals: parsed.medals
        ? {
            effort: Number(parsed.medals.effort) || 0,
            curiosity: Number(parsed.medals.curiosity) || 0,
            cooperation: Number(parsed.medals.cooperation) || 0,
          }
        : { effort: 0, curiosity: 0, cooperation: 0 },
      stars: typeof parsed.stars === 'number' ? parsed.stars : 0,
      muted: Boolean(parsed.muted),
      volume: typeof parsed.volume === 'number' ? parsed.volume : 0.65,
      autoReadAloud: Boolean(parsed.autoReadAloud),
      castle: parsed.castle
        ? {
            ...DEFAULT_CASTLE_STATE,
            ...parsed.castle,
            placedStickers: {
              ...DEFAULT_CASTLE_STATE.placedStickers,
              ...(parsed.castle.placedStickers ?? {}),
            },
          }
        : DEFAULT_CASTLE_STATE,
      lastResume: parsed.lastResume,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [progress, setProgress] = useState<SavedProgress>(() => loadProgress());
  const [screen, setScreen] = useState<ScreenState>('TITLE_MENU');
  const [activeChapterId, setActiveChapterId] = useState<number>(
    () => loadProgress().lastResume?.chapterId ?? 1
  );
  const [puzzleIndex, setPuzzleIndex] = useState<number>(
    () => loadProgress().lastResume?.puzzleIndex ?? 0
  );
  const [showAlbum, setShowAlbum] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [chapterRetries, setChapterRetries] = useState(0);
  const [dismissAdaptiveBanner, setDismissAdaptiveBanner] = useState(false);

  useEffect(() => {
    sound.subscribeSpeaking(setSpeaking);
    return () => sound.subscribeSpeaking(() => {});
  }, []);

  useEffect(() => {
    sound.muted = progress.muted;
    sound.volumeLevel = progress.volume;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage errors
    }
  }, [progress]);

  useEffect(() => {
    if (screen !== 'TITLE_MENU') {
      setProgress((prev) => ({
        ...prev,
        lastResume: {
          screen,
          chapterId: activeChapterId,
          puzzleIndex,
        },
      }));
    }
  }, [screen, activeChapterId, puzzleIndex]);

  const activeChapter =
    CHAPTERS.find((c) => c.id === activeChapterId) ?? CHAPTERS[0];
  const activePuzzle = activeChapter.puzzles[puzzleIndex];
  const activeOptionalScene =
    OPTIONAL_SCENES.find((s) => s.chapterId === activeChapterId) ??
    OPTIONAL_SCENES[0];
  const activeCombinedMeta =
    COMBINED_CHALLENGES.find((c) => c.chapterId === activeChapterId) ??
    COMBINED_CHALLENGES[0];
  const activeAdvancedMeta =
    ADVANCED_LEVELS.find((l) => l.chapterId === activeChapterId) ??
    ADVANCED_LEVELS[0];

  const chosenOptionId = progress.chapterChoices[activeChapter.id];
  const chosenOption = activeChapter.choice.options.find(
    (o) => o.id === chosenOptionId
  );

  const toggleMute = useCallback(() => {
    setProgress((prev) => {
      const nextMuted = !prev.muted;
      if (nextMuted) sound.stopSpeech();
      return { ...prev, muted: nextMuted };
    });
  }, []);

  const handleStartFromTitle = useCallback(() => {
    sound.playTap();
    setScreen('MAP_HUB');
  }, []);

  const handleResumeLast = useCallback(() => {
    sound.playTap();
    if (progress.lastResume) {
      setActiveChapterId(progress.lastResume.chapterId);
      setPuzzleIndex(progress.lastResume.puzzleIndex);
      setScreen(progress.lastResume.screen);
    } else {
      setScreen('MAP_HUB');
    }
  }, [progress.lastResume]);

  const handleOpenCastle = useCallback(() => {
    sound.playTap();
    sound.stopSpeech();
    setScreen('DOLLHOUSE_CASTLE');
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'Escape' && screen !== 'TITLE_MENU') {
        if (showInstructions) {
          setShowInstructions(false);
        } else if (showAlbum) {
          setShowAlbum(false);
        } else {
          setShowPause((p) => !p);
        }
      } else if (
        (e.key === 'Enter' || e.key === ' ') &&
        screen === 'TITLE_MENU' &&
        !showAlbum &&
        !showInstructions
      ) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'BUTTON') {
          e.preventDefault();
          handleStartFromTitle();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    screen,
    showAlbum,
    showInstructions,
    toggleMute,
    handleStartFromTitle,
  ]);

  const handleSelectChapter = (chapterId: number) => {
    sound.playTap();
    sound.stopSpeech();
    setActiveChapterId(chapterId);
    setPuzzleIndex(0);
    setChapterRetries(0);
    setDismissAdaptiveBanner(false);
    setScreen('CHAPTER_STORY');
  };

  const handleSelectOptionalScene = (chapterId: number) => {
    sound.playTap();
    sound.stopSpeech();
    setActiveChapterId(chapterId);
    setScreen('OPTIONAL_SCENE');
  };

  const handleSelectExtraChallenge = (chapterId: number) => {
    sound.playTap();
    sound.stopSpeech();
    setActiveChapterId(chapterId);
    setScreen('EXTRA_CHALLENGE');
  };

  const handleSelectAdvancedLevel = (chapterId: number) => {
    sound.playTap();
    sound.stopSpeech();
    setActiveChapterId(chapterId);
    setScreen('ADVANCED_LEVEL');
  };

  const handleChooseStoryOption = (optionId: string) => {
    sound.playTap();
    const alreadyChosen = Boolean(progress.chapterChoices[activeChapter.id]);
    setProgress((prev) => ({
      ...prev,
      chapterChoices: {
        ...prev.chapterChoices,
        [activeChapter.id]: optionId,
      },
      medals: {
        ...prev.medals,
        cooperation: alreadyChosen
          ? prev.medals.cooperation
          : prev.medals.cooperation + 1,
      },
    }));
  };

  const handleGentleRetry = useCallback(() => {
    setChapterRetries((r) => r + 1);
  }, []);

  const handlePuzzleComplete = () => {
    sound.stopSpeech();
    setProgress((prev) => ({
      ...prev,
      medals: {
        ...prev.medals,
        effort: prev.medals.effort + 1,
      },
    }));

    if (puzzleIndex + 1 < activeChapter.puzzles.length) {
      setPuzzleIndex((i) => i + 1);
    } else {
      sound.playChapterComplete();
      setProgress((prev) => {
        const alreadyDone = prev.completedChapters.includes(activeChapter.id);
        const nextChapters = alreadyDone
          ? prev.completedChapters
          : [...prev.completedChapters, activeChapter.id];
        const nextStickers = prev.unlockedStickers.includes(
          activeChapter.sticker.id
        )
          ? prev.unlockedStickers
          : [...prev.unlockedStickers, activeChapter.sticker.id];
        const nextStars = alreadyDone ? prev.stars : prev.stars + 1;
        const nextDiscoveries = prev.discoveriesLog.includes(
          activeChapter.discoveryText
        )
          ? prev.discoveriesLog
          : [...prev.discoveriesLog, activeChapter.discoveryText];
        return {
          ...prev,
          completedChapters: nextChapters,
          unlockedStickers: nextStickers,
          stars: nextStars,
          discoveriesLog: nextDiscoveries,
        };
      });
      setScreen('CHAPTER_REWARD');
    }
  };

  const handleCompleteOptionalScene = (
    chapterId: number,
    discoveryNote: string,
    coopUsed: boolean
  ) => {
    setProgress((prev) => {
      const alreadyExplored = prev.exploredScenes.includes(chapterId);
      return {
        ...prev,
        exploredScenes: alreadyExplored
          ? prev.exploredScenes
          : [...prev.exploredScenes, chapterId],
        discoveriesLog: prev.discoveriesLog.includes(discoveryNote)
          ? prev.discoveriesLog
          : [...prev.discoveriesLog, discoveryNote],
        medals: {
          ...prev.medals,
          curiosity: alreadyExplored
            ? prev.medals.curiosity
            : prev.medals.curiosity + 1,
          cooperation:
            coopUsed && !alreadyExplored
              ? prev.medals.cooperation + 1
              : prev.medals.cooperation,
        },
      };
    });
  };

  const handleCompleteExtraChallenge = () => {
    sound.playChapterComplete();
    setProgress((prev) => {
      const alreadyDone = prev.completedExtras.includes(activeChapter.id);
      const extraNote = `Desafio Extra do Capítulo ${activeChapter.id}: ${activeCombinedMeta.title}.`;
      return {
        ...prev,
        completedExtras: alreadyDone
          ? prev.completedExtras
          : [...prev.completedExtras, activeChapter.id],
        discoveriesLog: prev.discoveriesLog.includes(extraNote)
          ? prev.discoveriesLog
          : [...prev.discoveriesLog, extraNote],
        medals: {
          ...prev.medals,
          effort: prev.medals.effort + 1,
          curiosity: alreadyDone
            ? prev.medals.curiosity
            : prev.medals.curiosity + 1,
        },
      };
    });
    setScreen('CHAPTER_REWARD');
  };

  const handleCompleteAdvancedLevel = () => {
    sound.playChapterComplete();
    setProgress((prev) => {
      const alreadyDone = prev.completedAdvanced.includes(activeChapter.id);
      const advNote = `${activeAdvancedMeta.title} concluído no modo ${prev.ageGroup} anos!`;
      return {
        ...prev,
        completedAdvanced: alreadyDone
          ? prev.completedAdvanced
          : [...prev.completedAdvanced, activeChapter.id],
        discoveriesLog: prev.discoveriesLog.includes(advNote)
          ? prev.discoveriesLog
          : [...prev.discoveriesLog, advNote],
        medals: {
          ...prev.medals,
          effort: prev.medals.effort + 1,
          curiosity: alreadyDone
            ? prev.medals.curiosity
            : prev.medals.curiosity + 1,
        },
      };
    });
    setScreen('CHAPTER_REWARD');
  };

  const handleUpdateCastle = useCallback(
    (updater: (prev: CastleState) => CastleState) => {
      setProgress((prev) => ({
        ...prev,
        castle: updater(prev.castle),
      }));
    },
    []
  );

  const handleRewardMedal = useCallback(
    (type: 'effort' | 'curiosity' | 'cooperation') => {
      setProgress((prev) => ({
        ...prev,
        medals: {
          ...prev.medals,
          [type]: prev.medals[type] + 1,
        },
      }));
    },
    []
  );

  const handleResetAdventure = () => {
    sound.stopSpeech();
    setProgress((prev) => ({
      ...DEFAULT_PROGRESS,
      ageGroup: prev.ageGroup,
      muted: prev.muted,
      volume: prev.volume,
    }));
    setShowPause(false);
    setActiveChapterId(1);
    setPuzzleIndex(0);
    setChapterRetries(0);
    setScreen('TITLE_MENU');
  };

  const handleReadChapterStory = () => {
    if (speaking) {
      sound.stopSpeech();
      return;
    }
    const dialogueText = activeChapter.dialogues
      .map(
        (d) =>
          `${d.speaker === 'esmeralda' ? 'Esmeralda' : 'Larissa'} diz: ${d.text}`
      )
      .join(' ');
    sound.speak(
      `${activeChapter.title}. ${activeChapter.storyLead} ${dialogueText}`
    );
  };

  const getCurrentInstructionText = (): string => {
    if (screen === 'CHAPTER_STORY') {
      return `${activeChapter.title}. Objetivo: ${activeChapter.objective} Lê os diálogos, faz uma escolha e clica em Começar Desafios.`;
    }
    if (screen === 'OPTIONAL_SCENE') {
      return `${activeOptionalScene.title}. Toca nos desenhos para descobrir detalhes do ambiente e escolhe como cooperar.`;
    }
    if (screen === 'PLAYING' && activePuzzle) {
      return `${activePuzzle.title}. ${activePuzzle.goal}`;
    }
    if (screen === 'EXTRA_CHALLENGE') {
      return `${activeCombinedMeta.title}. ${activeCombinedMeta.goal}`;
    }
    if (screen === 'ADVANCED_LEVEL') {
      return `${activeAdvancedMeta.title}. ${activeAdvancedMeta.goal}`;
    }
    if (screen === 'DOLLHOUSE_CASTLE') {
      return 'Castelo das Bonecas: toca em qualquer divisão para brincar com rotinas diárias, resolver os desafios das rotinas ou colar os teus autocolantes nas paredes.';
    }
    return 'Escolhe um capítulo no mapa, ouve ou lê a história, visita o Castelo das Bonecas e resolve os desafios com a Esmeralda, a Larissa, a Athenas e o Lucky.';
  };

  const discoveredShort = `${progress.completedChapters.length}/5 páginas · ${progress.completedAdvanced.length}/5 avançados · ${progress.medals.effort + progress.medals.curiosity + progress.medals.cooperation} medalhas`;

  if (screen === 'TITLE_MENU') {
    return (
      <>
        <TitleScreen
          ageGroup={progress.ageGroup}
          onSelectAge={(ageGroup: AgeGroup) => {
            sound.playTap();
            setProgress((prev) => ({ ...prev, ageGroup }));
          }}
          onStart={handleStartFromTitle}
          onResumeLast={handleResumeLast}
          onOpenCastle={handleOpenCastle}
          onOpenAlbum={() => {
            sound.playTap();
            setShowAlbum(true);
          }}
          onOpenInstructions={() => {
            sound.playTap();
            setShowInstructions(true);
          }}
          hasProgress={
            progress.completedChapters.length > 0 ||
            progress.exploredScenes.length > 0 ||
            progress.completedAdvanced.length > 0
          }
          resumePoint={progress.lastResume}
          muted={progress.muted}
          onToggleMute={toggleMute}
        />
        {showAlbum && (
          <StickerAlbumModal
            unlockedStickers={progress.unlockedStickers}
            completedChapters={progress.completedChapters}
            medals={progress.medals}
            discoveriesLog={progress.discoveriesLog}
            onClose={() => setShowAlbum(false)}
          />
        )}
        {showInstructions && (
          <InstructionsModal
            ageGroup={progress.ageGroup}
            muted={progress.muted}
            volume={progress.volume}
            currentInstructionText={getCurrentInstructionText()}
            onChangeAge={(ageGroup) =>
              setProgress((prev) => ({ ...prev, ageGroup }))
            }
            onSetVolume={(volume, muted) => {
              if (muted) sound.stopSpeech();
              setProgress((prev) => ({ ...prev, volume, muted }));
            }}
            onClose={() => setShowInstructions(false)}
          />
        )}
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8EE] text-[#1E2B2A]">
      <header className="sticky top-0 z-30 bg-[#FFFDF7]/95 border-b border-[#E2DAC3] px-3 sm:px-6 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {screen !== 'MAP_HUB' && screen !== 'VICTORY' ? (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  sound.stopSpeech();
                  setScreen('MAP_HUB');
                }}
                aria-label="Voltar ao Mapa"
                title="Voltar ao Mapa"
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[42px] rounded-xl bg-[#F4EFE2] hover:bg-[#E8E0CB] text-[#1E2B2A] font-bold text-sm cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Mapa</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  sound.stopSpeech();
                  setScreen('MAP_HUB');
                }}
                className="inline-flex items-center gap-2 font-display text-lg font-bold text-[#0F766E] truncate cursor-pointer"
              >
                <MapIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">Esmeralda &amp; Larissa</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#92400E] font-display font-bold text-sm tabular-nums"
              title="Estrelas conquistadas"
            >
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#D97706]" />
              <span>{progress.stars}/5</span>
            </div>

            <button
              type="button"
              onClick={handleOpenCastle}
              aria-label="Abrir Castelo das Bonecas"
              className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[40px] min-w-[40px] rounded-xl font-bold text-xs cursor-pointer whitespace-nowrap ${
                screen === 'DOLLHOUSE_CASTLE'
                  ? 'bg-[#DB2777] text-white'
                  : 'bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#9D174D]'
              }`}
              title="Abrir Castelo das Bonecas"
            >
              <Castle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Castelo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setProgress((prev) => ({
                  ...prev,
                  ageGroup: prev.ageGroup === '5-7' ? '8-10' : '5-7',
                }));
              }}
              className="hidden md:inline-flex items-center px-3 py-1.5 min-h-[38px] rounded-xl bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E] font-bold text-xs cursor-pointer whitespace-nowrap"
              title="Alternar entre 5–7 anos e 8–10 anos"
            >
              Modo {progress.ageGroup} anos
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setShowInstructions(true);
              }}
              aria-label="Rever instruções e som"
              className="w-10 h-10 rounded-xl bg-[#F4EFE2] hover:bg-[#E8E0CB] flex items-center justify-center text-[#0F766E] cursor-pointer"
              title="Instruções e som"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setShowAlbum(true);
              }}
              aria-label="Abrir álbum de autocolantes e medalhas"
              className="w-10 h-10 rounded-xl bg-[#F4EFE2] hover:bg-[#E8E0CB] flex items-center justify-center text-[#92400E] cursor-pointer"
              title="Álbum e Medalhas"
            >
              <BookOpen className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={progress.muted ? 'Ligar som' : 'Desligar som'}
              className="w-10 h-10 rounded-xl bg-[#F4EFE2] hover:bg-[#E8E0CB] flex items-center justify-center text-[#0F766E] cursor-pointer"
            >
              {progress.muted ? (
                <VolumeX className="w-5 h-5 text-[#64748B]" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setShowPause(true);
              }}
              aria-label="Pausa e opções"
              className="w-10 h-10 rounded-xl bg-[#F4EFE2] hover:bg-[#E8E0CB] flex items-center justify-center text-[#1E2B2A] cursor-pointer"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {screen === 'MAP_HUB' && (
          <MapHubScreen
            completedChapters={progress.completedChapters}
            unlockedStickers={progress.unlockedStickers}
            exploredScenes={progress.exploredScenes}
            completedExtras={progress.completedExtras}
            completedAdvanced={progress.completedAdvanced}
            medals={progress.medals}
            onSelectChapter={handleSelectChapter}
            onSelectOptionalScene={handleSelectOptionalScene}
            onSelectExtraChallenge={handleSelectExtraChallenge}
            onSelectAdvancedLevel={handleSelectAdvancedLevel}
            onOpenCastle={handleOpenCastle}
            onOpenAlbum={() => {
              sound.playTap();
              setShowAlbum(true);
            }}
          />
        )}

        {screen === 'DOLLHOUSE_CASTLE' && (
          <DollhouseCastleView
            castle={progress.castle}
            ageGroup={progress.ageGroup}
            unlockedStickers={progress.unlockedStickers}
            onUpdateCastle={handleUpdateCastle}
            onRewardMedal={handleRewardMedal}
            onBackToMap={() => {
              sound.playTap();
              sound.stopSpeech();
              setScreen('MAP_HUB');
            }}
          />
        )}

        {screen === 'CHAPTER_STORY' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-pop">
            <JourneyStrip
              currentGoal={activeChapter.objective}
              discoveredSummary={discoveredShort}
              nextStep="Ler a história e iniciar os desafios (ou explorar cena opcional / nível avançado)."
            />

            <div className="rounded-3xl overflow-hidden bg-white border-2 border-[#E2DAC3] shadow-sm">
              <div className="relative aspect-[16/9] w-full bg-[#E2DAC3]">
                <StoryImage
                  src={activeChapter.illustration}
                  alt={activeChapter.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-[#0F766E]">
                      Capítulo {activeChapter.id} · {activeChapter.placeName}
                    </p>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E2B2A]">
                      {activeChapter.title}
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={handleReadChapterStory}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl font-bold text-sm cursor-pointer ${
                      speaking
                        ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]'
                        : 'bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E]'
                    }`}
                  >
                    {speaking ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                    <span>{speaking ? 'Parar voz' : 'Ouvir História'}</span>
                  </button>
                </div>

                <p className="text-base sm:text-lg font-semibold text-[#334155] leading-relaxed">
                  {activeChapter.storyLead}
                </p>

                <div className="space-y-3">
                  {activeChapter.dialogues.map((line, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF6EC] border border-[#E7DFC8]"
                    >
                      <CharacterAvatar
                        character={line.speaker}
                        size={54}
                        className="shrink-0"
                      />
                      <div className="space-y-1.5">
                        <p className="text-base font-bold text-[#1E2B2A]">
                          <span className="text-[#0F766E]">
                            {line.speaker === 'esmeralda' ? 'Esmeralda' : 'Larissa'}:
                          </span>{' '}
                          “{line.text}”
                        </p>
                        {line.dogAction && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5B21B6]">
                            <CharacterAvatar
                              character={line.dogAction.dog}
                              size={26}
                              className="shrink-0"
                            />
                            <span>{line.dogAction.action}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FDF9] border-2 border-[#99F6E4] space-y-3">
                  <p className="font-display text-lg font-bold text-[#0F766E]">
                    {activeChapter.choice.prompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeChapter.choice.options.map((opt) => {
                      const isPicked = chosenOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleChooseStoryOption(opt.id)}
                          className={`p-3.5 min-h-[54px] rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-2 transition-transform duration-150 cursor-pointer active:scale-95 ${
                            isPicked
                              ? 'bg-[#0D9488] border-[#0F766E] text-white shadow-sm'
                              : 'bg-white hover:bg-[#CCFBF1]/50 border-[#CBD5E1] text-[#1E2B2A]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isPicked && <Check className="w-5 h-5 shrink-0 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  {chosenOption && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#99F6E4] animate-pop space-y-1">
                      <p className="text-sm sm:text-base font-bold text-[#1E2B2A]">
                        {chosenOption.reactionSpeaker === 'esmeralda'
                          ? 'Esmeralda'
                          : 'Larissa'}
                        : “{chosenOption.reactionText}”
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#4B5E5B]">
                        {chosenOption.dogNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectOptionalScene(activeChapter.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Cena Opcional</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectExtraChallenge(activeChapter.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Desafio Extra</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectAdvancedLevel(activeChapter.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Nível Avançado</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      sound.stopSpeech();
                      setPuzzleIndex(0);
                      setScreen('PLAYING');
                    }}
                    className="inline-flex items-center gap-2.5 px-7 py-4 min-h-[54px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display text-xl font-bold shadow-md transition-transform duration-150 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Começar Desafios!</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'OPTIONAL_SCENE' && (
          <>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
              <JourneyStrip
                currentGoal={`Observar os detalhes seguros de ${activeChapter.placeName}.`}
                discoveredSummary={discoveredShort}
                nextStep="Avançar para os desafios do capítulo quando quiseres."
              />
            </div>
            <OptionalSceneView
              key={`opt-${activeChapter.id}-${progress.ageGroup}`}
              scene={activeOptionalScene}
              ageGroup={progress.ageGroup}
              alreadyExplored={progress.exploredScenes.includes(activeChapter.id)}
              onCompleteExploration={handleCompleteOptionalScene}
              onSkipOrContinue={() => setScreen('CHAPTER_STORY')}
            />
          </>
        )}

        {screen === 'PLAYING' && activePuzzle && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 animate-pop">
            <JourneyStrip
              currentGoal={activePuzzle.goal}
              discoveredSummary={discoveredShort}
              nextStep={
                puzzleIndex + 1 < activeChapter.puzzles.length
                  ? `Seguir para o desafio ${puzzleIndex + 2} de ${activeChapter.puzzles.length}.`
                  : `Concluir o Capítulo ${activeChapter.id} e ganhar o autocolante ${activeChapter.sticker.name}!`
              }
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-[#0F766E]">
                  Capítulo {activeChapter.id}: {activeChapter.title}
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E2B2A]">
                  {activePuzzle.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {activeChapter.puzzles.map((p, idx) => (
                  <span
                    key={p.id}
                    className={`h-3 rounded-full transition-all ${
                      idx < puzzleIndex
                        ? 'w-8 bg-[#10B981]'
                        : idx === puzzleIndex
                        ? 'w-10 bg-[#F59E0B]'
                        : 'w-6 bg-[#E2DAC3]'
                    }`}
                    aria-label={`Desafio ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm font-bold text-[#4B5E5B] mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0D9488] shrink-0" />
              <span>{activePuzzle.storyConnection}</span>
            </p>

            {progress.ageGroup === '8-10' &&
              chapterRetries >= 4 &&
              !dismissAdaptiveBanner && (
                <div className="mb-4 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-wrap items-center justify-between gap-3 animate-pop">
                  <p className="text-sm font-bold text-[#92400E]">
                    Queres experimentar este desafio no modo 5–7 anos com passos mais curtos?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setChapterRetries(0);
                        setProgress((prev) => ({ ...prev, ageGroup: '5-7' }));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#0D9488] text-white font-bold text-xs cursor-pointer"
                    >
                      Mudar para 5–7 anos
                    </button>
                    <button
                      type="button"
                      onClick={() => setDismissAdaptiveBanner(true)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#E2DAC3] text-[#475569] font-bold text-xs cursor-pointer"
                    >
                      Continuar em 8–10
                    </button>
                  </div>
                </div>
              )}

            <div className="p-5 sm:p-7 rounded-3xl bg-white border-2 border-[#E2DAC3] shadow-sm">
              {activePuzzle.type === 'observation' && (
                <ObservationPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'pattern' && (
                <PatternPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'maze' && (
                <MazePuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'counting' && (
                <CountingPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'memory' && (
                <MemoryPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'logic' && (
                <LogicPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'word' && (
                <WordPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'odd_one_out' && (
                <OddOneOutPuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
              {activePuzzle.type === 'chest_finale' && (
                <ChestFinalePuzzle
                  key={`${activePuzzle.id}-${progress.ageGroup}`}
                  ageGroup={progress.ageGroup}
                  onComplete={handlePuzzleComplete}
                  onGentleRetry={handleGentleRetry}
                />
              )}
            </div>
          </div>
        )}

        {screen === 'EXTRA_CHALLENGE' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 animate-pop">
            <JourneyStrip
              currentGoal={activeCombinedMeta.goal}
              discoveredSummary={discoveredShort}
              nextStep="Este desafio extra combina dois enigmas para ganhar medalhas de Esforço e Curiosidade!"
            />

            <div className="p-5 sm:p-7 rounded-3xl bg-white border-2 border-[#F59E0B]/60 shadow-sm">
              <CombinedExtraPuzzle
                key={`extra-${activeChapter.id}-${progress.ageGroup}`}
                chapterId={activeChapter.id}
                ageGroup={progress.ageGroup}
                onComplete={handleCompleteExtraChallenge}
                onGentleRetry={handleGentleRetry}
              />
            </div>
          </div>
        )}

        {screen === 'ADVANCED_LEVEL' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 animate-pop">
            <JourneyStrip
              currentGoal={activeAdvancedMeta.goal}
              discoveredSummary={discoveredShort}
              nextStep="Completa as duas etapas do Nível Avançado sem perder estrelas!"
            />

            <div className="p-5 sm:p-7 rounded-3xl bg-white border-2 border-[#38BDF8] shadow-sm">
              <AdvancedLevelPuzzle
                key={`adv-${activeChapter.id}-${progress.ageGroup}`}
                chapterId={activeChapter.id}
                ageGroup={progress.ageGroup}
                onComplete={handleCompleteAdvancedLevel}
                onGentleRetry={handleGentleRetry}
              />
            </div>
          </div>
        )}

        {screen === 'CHAPTER_REWARD' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-pop">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#F59E0B] shadow-lg text-center space-y-5">
              <div className="flex justify-center gap-3">
                <CharacterAvatar character="esmeralda" size={64} className="animate-float" />
                <CharacterAvatar character="larissa" size={64} className="animate-float" />
                <CharacterAvatar character="athenas" size={64} className="animate-float" />
                <CharacterAvatar character="lucky" size={64} className="animate-float" />
              </div>

              <div>
                <p className="text-sm font-extrabold text-[#D97706] mb-1">
                  Capítulo {activeChapter.id} · Esforço e Cooperação!
                </p>
                <h2 className="font-display text-3xl font-bold text-[#1E2B2A] mb-2">
                  Descoberta no {activeChapter.placeName}!
                </h2>
                <p className="text-base sm:text-lg font-semibold text-[#334155]">
                  {activeChapter.discoveryText}
                </p>
                <p className="text-sm font-bold text-[#0F766E] mt-2">
                  {activeChapter.nextChapterHook}
                </p>
              </div>

              {chosenOption && (
                <div className="p-3 rounded-2xl bg-[#F4EFE2] text-sm font-bold text-[#4B5E5B]">
                  A tua escolha neste capítulo: {chosenOption.label}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-3">
                  <StickerBadgeArt
                    stickerId={activeChapter.sticker.id}
                    size={64}
                    unlocked
                  />
                  <div>
                    <p className="text-xs font-extrabold text-[#B45309]">
                      Autocolante do Capítulo!
                    </p>
                    <p className="font-display text-lg font-bold text-[#1E2B2A]">
                      {activeChapter.sticker.name}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E6F4F1] border border-[#99F6E4] flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0">
                    <Award className="w-8 h-8 text-[#0D9488]" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#0F766E]">
                      Página do Mapa &amp; Medalha!
                    </p>
                    <p className="font-display text-base font-bold text-[#1E2B2A]">
                      {activeChapter.mapPieceLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional bonuses & Advanced Level invitations */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {!progress.exploredScenes.includes(activeChapter.id) && (
                  <button
                    type="button"
                    onClick={() => handleSelectOptionalScene(activeChapter.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] font-bold text-xs cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Cena Opcional</span>
                  </button>
                )}
                {!progress.completedExtras.includes(activeChapter.id) && (
                  <button
                    type="button"
                    onClick={() => handleSelectExtraChallenge(activeChapter.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-bold text-xs cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Desafio Extra</span>
                  </button>
                )}
                {!progress.completedAdvanced.includes(activeChapter.id) && (
                  <button
                    type="button"
                    onClick={() => handleSelectAdvancedLevel(activeChapter.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] font-bold text-xs cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Nível Avançado</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleOpenCastle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#9D174D] font-bold text-xs cursor-pointer"
                >
                  <Castle className="w-4 h-4" />
                  <span>Colar no Castelo</span>
                </button>
              </div>

              {progress.ageGroup === '5-7' &&
                chapterRetries === 0 &&
                activeChapter.id < CHAPTERS.length && (
                  <div className="p-3.5 rounded-2xl bg-[#E0F2FE] border border-[#7DD3FC] flex flex-wrap items-center justify-between gap-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-[#0369A1]">
                      Resolveste tudo à primeira! Queres experimentar o próximo capítulo no modo 8–10 anos?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setProgress((prev) => ({ ...prev, ageGroup: '8-10' }));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#0284C7] text-white font-bold text-xs cursor-pointer shrink-0"
                    >
                      Experimentar 8–10 anos
                    </button>
                  </div>
                )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {activeChapter.id === CHAPTERS.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playChapterComplete();
                      setScreen('VICTORY');
                    }}
                    className="px-7 py-4 min-h-[54px] rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-[#1E2B2A] font-display text-xl font-bold shadow-md cursor-pointer"
                  >
                    Ver Grande Final!
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setScreen('MAP_HUB');
                    }}
                    className="px-7 py-4 min-h-[54px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display text-xl font-bold shadow-md cursor-pointer"
                  >
                    Continuar no Mapa
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {screen === 'VICTORY' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pop">
            <div className="rounded-3xl overflow-hidden bg-white border-2 border-[#F59E0B] shadow-xl">
              <div className="aspect-[16/9] w-full">
                <StoryImage
                  src={CHAPTERS[4].illustration}
                  alt="Grande celebração na Árvore das Estrelas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 text-center space-y-5">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E2B2A]">
                  Aventura Completa!
                </h1>
                <p className="text-base sm:text-lg font-semibold text-[#334155] max-w-2xl mx-auto">
                  Ajudaste a Esmeralda, a Larissa, a Athenas e o Lucky com esforço, curiosidade e
                  cooperação! Todas as páginas do caderno-mapa da avó estão reunidas.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                  {CHAPTERS.map((c) => (
                    <div key={c.id} className="flex flex-col items-center gap-1">
                      <StickerBadgeArt
                        stickerId={c.sticker.id}
                        size={68}
                        unlocked={progress.unlockedStickers.includes(c.sticker.id)}
                      />
                      <span className="text-xs font-bold text-[#4B5E5B]">
                        {c.sticker.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenCastle}
                    className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[50px] rounded-2xl bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#9D174D] font-display font-bold text-lg cursor-pointer"
                  >
                    <Castle className="w-5 h-5" />
                    <span>Castelo das Bonecas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setShowAlbum(true);
                    }}
                    className="px-6 py-3.5 min-h-[50px] rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] font-display font-bold text-lg cursor-pointer"
                  >
                    Ver Álbum &amp; Medalhas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setScreen('MAP_HUB');
                    }}
                    className="px-6 py-3.5 min-h-[50px] rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-bold text-lg cursor-pointer"
                  >
                    Voltar ao Mapa
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAdventure}
                    className="px-6 py-3.5 min-h-[50px] rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-2 border-[#F59E0B]/40 font-display font-bold text-lg cursor-pointer"
                  >
                    Jogar Outra Vez
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAlbum && (
        <StickerAlbumModal
          unlockedStickers={progress.unlockedStickers}
          completedChapters={progress.completedChapters}
          medals={progress.medals}
          discoveriesLog={progress.discoveriesLog}
          onClose={() => setShowAlbum(false)}
        />
      )}

      {showInstructions && (
        <InstructionsModal
          ageGroup={progress.ageGroup}
          muted={progress.muted}
          volume={progress.volume}
          currentInstructionText={getCurrentInstructionText()}
          onChangeAge={(ageGroup) =>
            setProgress((prev) => ({ ...prev, ageGroup }))
          }
          onSetVolume={(volume, muted) => {
            if (muted) sound.stopSpeech();
            setProgress((prev) => ({ ...prev, volume, muted }));
          }}
          onClose={() => setShowInstructions(false)}
        />
      )}

      {showPause && (
        <PauseModal
          ageGroup={progress.ageGroup}
          muted={progress.muted}
          volume={progress.volume}
          onChangeAge={(ageGroup) =>
            setProgress((prev) => ({ ...prev, ageGroup }))
          }
          onSetVolume={(volume, muted) => {
            if (muted) sound.stopSpeech();
            setProgress((prev) => ({ ...prev, volume, muted }));
          }}
          onResume={() => setShowPause(false)}
          onGoMap={() => {
            setShowPause(false);
            sound.stopSpeech();
            setScreen('MAP_HUB');
          }}
          onGoTitle={() => {
            setShowPause(false);
            sound.stopSpeech();
            setScreen('TITLE_MENU');
          }}
          onResetAdventure={handleResetAdventure}
        />
      )}
      <OfflineIndicator />
    </div>
  );
}
