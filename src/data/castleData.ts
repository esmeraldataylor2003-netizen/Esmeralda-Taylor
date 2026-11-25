import { CastleRoomId, CastleState, CastleWallColor } from '../types/game';

export const DEFAULT_CASTLE_STATE: CastleState = {
  wallColor: 'turquesa',
  furnitureTheme: 'estrelas',
  curtainsOpen: false,
  outfit: 'turquesa',
  teethBrushed: false,
  toysTidied: false,
  backpackReady: false,
  booksOrganized: false,
  plantWatered: false,
  tableSet: false,
  dogsWatered: false,
  bedtimeStory: null,
  placedStickers: {
    quarto: [],
    banho: [],
    biblioteca: [],
    sala_mesa: [],
  },
  completedCastleChallenges: [],
  routineOrderLog: [],
};

export interface CastleRoomInfo {
  id: CastleRoomId;
  name: string;
  subtitle: string;
  description: string;
}

export const CASTLE_ROOMS: CastleRoomInfo[] = [
  {
    id: 'quarto',
    name: 'Quarto das Torres',
    subtitle: 'Cortinas, Roupa, Brinquedos e Leitura',
    description:
      'Aqui a Esmeralda e a Larissa abrem as cortinas ao sol, escolhem roupas confortáveis, arrumam os brinquedos e escolhem uma história calma para dormir.',
  },
  {
    id: 'banho',
    name: 'Cantinho da Manhã & Mochila',
    subtitle: 'Escovar os Dentes e Preparar a Mochila',
    description:
      'Um espaço luminoso para escovar os dentes e preparar a mochila cor-de-rosa com garrafa de água, caderno-mapa e bússola.',
  },
  {
    id: 'biblioteca',
    name: 'Sala dos Livros & Janela',
    subtitle: 'Organizar Livros e Regar a Planta',
    description:
      'Estantes coloridas para organizar os livros favoritos e uma planta verdinha na janela para regar com o regador pequeno.',
  },
  {
    id: 'sala_mesa',
    name: 'Mesa de Lanche & Cantinho dos Cães',
    subtitle: 'Mesa Preparada e Água para Athenas e Lucky',
    description:
      'Põe a mesa com fruta lavada, pão e sumo já preparados, e enche as tigelas de água fresca para a Athenas e o Lucky!',
  },
];

export const WALL_COLOR_THEMES: Record<
  CastleWallColor,
  { label: string; bg: string; roomBg: string; border: string; roof: string }
> = {
  turquesa: {
    label: 'Turquesa Brisa',
    bg: 'bg-[#E0F7F4]',
    roomBg: '#F0FDFA',
    border: '#14B8A6',
    roof: '#0D9488',
  },
  amarelo: {
    label: 'Amarelo Sol',
    bg: 'bg-[#FEF9C3]',
    roomBg: '#FFFBEB',
    border: '#F59E0B',
    roof: '#D97706',
  },
  rosa: {
    label: 'Rosa Flor',
    bg: 'bg-[#FCE7F3]',
    roomBg: '#FDF2F8',
    border: '#EC4899',
    roof: '#DB2777',
  },
  lavanda: {
    label: 'Lavanda Calma',
    bg: 'bg-[#EDE9FE]',
    roomBg: '#F5F3FF',
    border: '#8B5CF6',
    roof: '#7C3AED',
  },
};

export const BEDTIME_STORIES = [
  {
    id: 'estrela',
    title: 'A Estrela que Guiava o Bosque',
    summary: 'Uma história calma sobre como os animais do bosque dormem tranquilos sob o céu estrelado.',
  },
  {
    id: 'riacho',
    title: 'O Sonho dos Patinhos no Riacho',
    summary: 'Uma leitura suave sobre a água calma do riacho e a amizade entre irmãos patinhos.',
  },
  {
    id: 'jardim',
    title: 'O Segredo do Girassol Sonolento',
    summary: 'Conta como as flores descansam à noite para acordar cheias de cor na manhã seguinte.',
  },
];
