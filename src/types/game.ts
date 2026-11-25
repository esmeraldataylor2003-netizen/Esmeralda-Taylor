import { NatureIconId } from '../components/CharacterArt';

export type AgeGroup = '5-7' | '8-10';

export type ScreenState =
  | 'TITLE_MENU'
  | 'MAP_HUB'
  | 'CHAPTER_STORY'
  | 'OPTIONAL_SCENE'
  | 'PLAYING'
  | 'EXTRA_CHALLENGE'
  | 'ADVANCED_LEVEL'
  | 'CHAPTER_REWARD'
  | 'DOLLHOUSE_CASTLE'
  | 'VICTORY';

export type CharacterId = 'esmeralda' | 'larissa' | 'athenas' | 'lucky';

export type PuzzleType =
  | 'observation'
  | 'pattern'
  | 'maze'
  | 'counting'
  | 'memory'
  | 'logic'
  | 'word'
  | 'odd_one_out'
  | 'chest_finale';

export interface StoryDialogueLine {
  speaker: 'esmeralda' | 'larissa';
  text: string;
  dogAction?: {
    dog: 'athenas' | 'lucky';
    action: string;
  };
}

export interface StoryChoiceOption {
  id: string;
  label: string;
  reactionSpeaker: 'esmeralda' | 'larissa';
  reactionText: string;
  dogNote: string;
}

export interface StoryChoice {
  prompt: string;
  options: [StoryChoiceOption, StoryChoiceOption];
}

export interface PuzzleStep {
  id: string;
  type: PuzzleType;
  title: string;
  goal: string;
  storyConnection: string;
  helperCharacter: 'athenas' | 'lucky';
  helperLabel: string;
}

export interface StickerReward {
  id: string;
  name: string;
  description: string;
  color: string;
  chapterId: number;
}

export interface ChapterData {
  id: number;
  title: string;
  placeName: string;
  objective: string;
  illustration: string;
  storyLead: string;
  dialogues: StoryDialogueLine[];
  choice: StoryChoice;
  discoveryText: string;
  nextChapterHook: string;
  puzzles: PuzzleStep[];
  rewardMessage: string;
  sticker: StickerReward;
  mapPieceLabel: string;
}

export interface OptionalDiscoverySpot {
  id: string;
  icon: NatureIconId;
  label: string;
  category: 'animal' | 'objeto' | 'natureza';
  detailText: string;
  dogBehavior: string;
  hardOnly?: boolean;
}

export interface OptionalSceneData {
  chapterId: number;
  title: string;
  intro: string;
  helperGirl: 'esmeralda' | 'larissa';
  helperDog: 'athenas' | 'lucky';
  spots: OptionalDiscoverySpot[];
  coopPrompt: string;
  coopOptions: {
    id: string;
    label: string;
    result: string;
  }[];
  summaryDiscovery: string;
}

export interface CombinedChallengeMeta {
  chapterId: number;
  title: string;
  combinedTypes: string;
  goal: string;
  storyContext: string;
  easySummary: string;
  hardSummary: string;
  helperDog: 'athenas' | 'lucky';
}

export interface AdvancedLevelMeta {
  chapterId: number;
  title: string;
  skillsLabel: string;
  goal: string;
  storyLink: string;
  easySummary: string;
  hardSummary: string;
  helperDog: 'athenas' | 'lucky';
}

export type CastleRoomId = 'quarto' | 'banho' | 'biblioteca' | 'sala_mesa';
export type CastleWallColor = 'turquesa' | 'amarelo' | 'rosa' | 'lavanda';
export type CastleFurnitureTheme = 'estrelas' | 'jardim';

export interface CastleState {
  wallColor: CastleWallColor;
  furnitureTheme: CastleFurnitureTheme;
  curtainsOpen: boolean;
  outfit: 'turquesa' | 'amarelo' | 'passeio';
  teethBrushed: boolean;
  toysTidied: boolean;
  backpackReady: boolean;
  booksOrganized: boolean;
  plantWatered: boolean;
  tableSet: boolean;
  dogsWatered: boolean;
  bedtimeStory: string | null;
  placedStickers: Record<CastleRoomId, string[]>;
  completedCastleChallenges: string[];
  routineOrderLog: string[];
}

export interface MedalCounts {
  effort: number;
  curiosity: number;
  cooperation: number;
}

export interface ResumePoint {
  screen: Exclude<ScreenState, 'TITLE_MENU'>;
  chapterId: number;
  puzzleIndex: number;
}

export interface SavedProgress {
  ageGroup: AgeGroup;
  completedChapters: number[];
  unlockedStickers: string[];
  chapterChoices: Record<number, string>;
  exploredScenes: number[];
  completedExtras: number[];
  completedAdvanced: number[];
  discoveriesLog: string[];
  medals: MedalCounts;
  stars: number;
  muted: boolean;
  volume: number;
  autoReadAloud: boolean;
  castle: CastleState;
  lastResume?: ResumePoint;
}
