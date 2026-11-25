import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  Clock,
  Droplets,
  Flower2,
  Moon,
  Palette,
  Shirt,
  Sparkles,
  Sun,
  Utensils,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  AgeGroup,
  CastleRoomId,
  CastleState,
  CastleWallColor,
} from '../types/game';
import { CHAPTERS } from '../data/chapters';
import {
  BEDTIME_STORIES,
  CASTLE_ROOMS,
  WALL_COLOR_THEMES,
} from '../data/castleData';
import { CharacterAvatar, StickerBadgeArt } from './CharacterArt';
import { sound } from '../utils/sound';

interface DollhouseCastleViewProps {
  castle: CastleState;
  ageGroup: AgeGroup;
  unlockedStickers: string[];
  onUpdateCastle: (updater: (prev: CastleState) => CastleState) => void;
  onRewardMedal: (type: 'effort' | 'curiosity' | 'cooperation') => void;
  onBackToMap: () => void;
}

export const DollhouseCastleView: React.FC<DollhouseCastleViewProps> = ({
  castle,
  ageGroup,
  unlockedStickers,
  onUpdateCastle,
  onRewardMedal,
  onBackToMap,
}) => {
  const isEasy = ageGroup === '5-7';
  const [activeRoom, setActiveRoom] = useState<CastleRoomId>('quarto');
  const [activeTab, setActiveTab] = useState<'brincar' | 'desafios' | 'decorar'>('brincar');
  const [message, setMessage] = useState<string>(
    'Escolhe uma divisão do Castelo das Bonecas para brincar, fazer rotinas ou decorar!'
  );
  const [speaking, setSpeaking] = useState(sound.isSpeaking);

  useEffect(() => {
    sound.subscribeSpeaking(setSpeaking);
    return () => sound.subscribeSpeaking(() => {});
  }, []);

  // Mini-challenges inside the castle
  const [selectedChallenge, setSelectedChallenge] = useState<
    'rotina_manha' | 'mochila' | 'mesa_livros' | 'noite'
  >('rotina_manha');

  // Challenge 1: Morning routine ordering
  const morningTarget = isEasy
    ? ['Abrir as cortinas', 'Escovar os dentes', 'Preparar a mochila']
    : [
        'Abrir as cortinas',
        'Escovar os dentes',
        'Vestir a roupa',
        'Dar água aos cães',
        'Preparar a mochila',
      ];
  const morningChoices = isEasy
    ? ['Preparar a mochila', 'Abrir as cortinas', 'Escovar os dentes']
    : [
        'Preparar a mochila',
        'Dar água aos cães',
        'Abrir as cortinas',
        'Vestir a roupa',
        'Escovar os dentes',
      ];
  const [morningPlan, setMorningPlan] = useState<string[]>([]);

  // Challenge 2: Safe backpack packing
  const [packedItems, setPackedItems] = useState<string[]>([]);

  // Challenge 3: Book Pattern + Table Count
  const [bookPatternAnswer, setBookPatternAnswer] = useState<string | null>(null);
  const [tableCountOk, setTableCountOk] = useState(false);

  // Challenge 4: Night missing check
  const [nightStepOk, setNightStepOk] = useState(false);

  const wallTheme = WALL_COLOR_THEMES[castle.wallColor];

  const markRoutine = (label: string, update: Partial<CastleState>, msg: string) => {
    sound.playSuccess();
    setMessage(msg);
    onUpdateCastle((prev) => ({
      ...prev,
      ...update,
      routineOrderLog: prev.routineOrderLog.includes(label)
        ? prev.routineOrderLog
        : [...prev.routineOrderLog, label],
    }));
    onRewardMedal('cooperation');
  };

  const completeCastleChallenge = (id: string, msg: string) => {
    sound.playSuccess();
    setMessage(msg);
    if (!castle.completedCastleChallenges.includes(id)) {
      onUpdateCastle((prev) => ({
        ...prev,
        completedCastleChallenges: [...prev.completedCastleChallenges, id],
      }));
      onRewardMedal('effort');
    }
  };

  const toggleStickerInRoom = (stickerId: string) => {
    if (!unlockedStickers.includes(stickerId)) {
      sound.playGentleTryAgain();
      setMessage('Conquista este autocolante num capítulo do mapa para o colar nas paredes do castelo!');
      return;
    }
    sound.playTap();
    onUpdateCastle((prev) => {
      const currentList = prev.placedStickers[activeRoom] ?? [];
      const exists = currentList.includes(stickerId);
      const nextList = exists
        ? currentList.filter((s) => s !== stickerId)
        : [...currentList, stickerId];
      return {
        ...prev,
        placedStickers: {
          ...prev.placedStickers,
          [activeRoom]: nextList,
        },
      };
    });
    onRewardMedal('curiosity');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 animate-pop space-y-5">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border-2 border-[#E2DAC3] p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 shrink-0">
            <CharacterAvatar character="esmeralda" size={50} />
            <CharacterAvatar character="larissa" size={50} />
            <CharacterAvatar character="athenas" size={46} />
            <CharacterAvatar character="lucky" size={46} />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E2B2A]">
              Castelo das Bonecas
            </h1>
            <p className="text-sm font-semibold text-[#4B5E5B]">
              Explora os quartos, escolhe a ordem das rotinas diárias e decora com os teus autocolantes!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (speaking ? sound.stopSpeech() : sound.speak(message))}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl font-bold text-sm cursor-pointer ${
              speaking
                ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]'
                : 'bg-[#E6F4F1] hover:bg-[#CCFBF1] text-[#0F766E]'
            }`}
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{speaking ? 'Parar voz' : 'Ouvir'}</span>
          </button>
          <button
            type="button"
            onClick={onBackToMap}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#F4EFE2] hover:bg-[#E8E0CB] font-bold text-sm text-[#1E2B2A] cursor-pointer"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>

      {/* Mode Tabs inside the Castle */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'brincar', label: '1. Explorar & Rotinas' },
            { id: 'desafios', label: '2. Desafios das Rotinas' },
            { id: 'decorar', label: '3. Decorar o Castelo' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab(tab.id);
            }}
            className={`px-5 py-3 min-h-[46px] rounded-2xl font-display font-bold text-base cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-[#0D9488] text-white shadow-sm'
                : 'bg-white border-2 border-[#E2DAC3] text-[#334155] hover:bg-[#FAF6EC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Castle Cross-Section Dollhouse */}
      <div
        className={`rounded-3xl border-4 p-4 sm:p-5 transition-colors ${wallTheme.bg}`}
        style={{ borderColor: wallTheme.border }}
      >
        {/* Castle Roof / Turrets */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div
            className="h-4 w-16 rounded-t-full"
            style={{ backgroundColor: wallTheme.roof }}
          />
          <div
            className="px-6 py-1.5 rounded-t-2xl text-white font-display font-bold text-sm sm:text-base shadow-sm"
            style={{ backgroundColor: wallTheme.roof }}
          >
            Castelo Acolhedor · Estilo{' '}
            {castle.furnitureTheme === 'estrelas' ? 'Estrelas' : 'Jardim'}
          </div>
          <div
            className="h-4 w-16 rounded-t-full"
            style={{ backgroundColor: wallTheme.roof }}
          />
        </div>

        {/* 4 Interactive Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {CASTLE_ROOMS.map((room) => {
            const isSelected = activeRoom === room.id;
            const roomStickers = castle.placedStickers[room.id] ?? [];

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setActiveRoom(room.id);
                  setMessage(`${room.name}: ${room.description}`);
                }}
                style={{ backgroundColor: wallTheme.roomBg }}
                className={`text-left p-4 rounded-2xl border-2 transition-transform duration-150 cursor-pointer flex flex-col justify-between min-h-[168px] ${
                  isSelected
                    ? 'border-[#0D9488] ring-4 ring-[#99F6E4]/60 shadow-md'
                    : 'border-[#E2DAC3] hover:border-[#0D9488]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#1E2B2A]">
                      {room.name}
                    </h3>
                    <p className="text-xs font-bold text-[#4B5E5B]">
                      {room.subtitle}
                    </p>
                  </div>

                  {/* Placed Stickers on Room Wall */}
                  <div className="flex -space-x-1">
                    {roomStickers.slice(0, 3).map((sid) => (
                      <StickerBadgeArt key={sid} stickerId={sid} size={30} unlocked />
                    ))}
                  </div>
                </div>

                {/* Live visual state inside each room */}
                <div className="mt-3 pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#334155]">
                  {room.id === 'quarto' && (
                    <>
                      <span>
                        {castle.curtainsOpen ? '☀️ Cortinas abertas' : '🌙 Cortinas fechadas'} ·{' '}
                        {castle.toysTidied ? '🧸 Brinquedos arrumados' : '🧸 Brinquedos por arrumar'}
                      </span>
                      <div className="flex items-center gap-1">
                        <CharacterAvatar character="esmeralda" size={34} />
                        <CharacterAvatar character="larissa" size={34} />
                      </div>
                    </>
                  )}

                  {room.id === 'banho' && (
                    <>
                      <span>
                        {castle.teethBrushed ? '🪥 Dentes escovados' : '🪥 Escovar dentes'} ·{' '}
                        {castle.backpackReady ? '🎒 Mochila pronta' : '🎒 Preparar mochila'}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-white/80">
                        Roupa:{' '}
                        {castle.outfit === 'turquesa'
                          ? 'Vestido Turquesa'
                          : castle.outfit === 'amarelo'
                          ? 'Jardineiras'
                          : 'Passeio'}
                      </span>
                    </>
                  )}

                  {room.id === 'biblioteca' && (
                    <>
                      <span>
                        {castle.booksOrganized ? '📚 Livros ordenados' : '📚 Arrumar livros'} ·{' '}
                        {castle.plantWatered ? '🌸 Planta regada' : '🌱 Regar planta'}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-white/80">
                        {castle.bedtimeStory ? '📖 História escolhida' : '📖 Escolher leitura'}
                      </span>
                    </>
                  )}

                  {room.id === 'sala_mesa' && (
                    <>
                      <span>
                        {castle.tableSet ? '🍎 Mesa posta (fruta e pão)' : '🍽️ Pôr mesa'} ·{' '}
                        {castle.dogsWatered ? '💧 Tigelas cheias' : '💧 Dar água aos cães'}
                      </span>
                      <div className="flex items-center gap-1">
                        <CharacterAvatar character="athenas" size={32} />
                        <CharacterAvatar character="lucky" size={32} />
                      </div>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Feedback Banner */}
      <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-sm sm:text-base font-bold text-[#78350F]">
        {message}
      </div>

      {/* TAB 1: FREE EXPLORATION & DAILY ROUTINES */}
      {activeTab === 'brincar' && (
        <div className="rounded-3xl bg-white border-2 border-[#E2DAC3] p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-display text-xl font-bold text-[#1E2B2A]">
              Atividades em: {CASTLE_ROOMS.find((r) => r.id === activeRoom)?.name}
            </h2>
            <span className="text-xs font-bold text-[#0F766E]">
              Podes escolher a ordem que preferires!
            </span>
          </div>

          {activeRoom === 'quarto' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'cortinas',
                    { curtainsOpen: !castle.curtainsOpen },
                    !castle.curtainsOpen
                      ? 'Abriste as cortinas e o sol iluminou o quarto!'
                      : 'Fechaste as cortinas para deixar o quarto calminho.'
                  )
                }
                className="p-4 min-h-[56px] rounded-2xl bg-[#FEF9C3] hover:bg-[#FEF08A] border-2 border-[#F59E0B]/40 font-bold flex items-center gap-3 cursor-pointer"
              >
                {castle.curtainsOpen ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>{castle.curtainsOpen ? 'Fechar as cortinas' : 'Abrir as cortinas ao sol'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'brinquedos',
                    { toysTidied: true },
                    'Todos os brinquedos foram guardados na caixa com a ajuda da Larissa!'
                  )
                }
                className="p-4 min-h-[56px] rounded-2xl bg-[#E6F4F1] hover:bg-[#CCFBF1] border-2 border-[#14B8A6]/40 font-bold flex items-center gap-3 cursor-pointer"
              >
                <Check className="w-5 h-5 text-[#0F766E]" />
                <span>
                  {castle.toysTidied ? 'Brinquedos arrumados ✓' : 'Arrumar os brinquedos'}
                </span>
              </button>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#FAF6EC] border border-[#E2DAC3] space-y-2">
                <p className="text-sm font-extrabold text-[#1E2B2A] flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-[#0D9488]" />
                  <span>Escolher a roupa confortável de hoje:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'turquesa', label: 'Vestido Turquesa' },
                      { id: 'amarelo', label: 'Jardineiras Amarelas' },
                      { id: 'passeio', label: 'Conjunto de Passeio' },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        markRoutine(
                          `roupa-${o.id}`,
                          { outfit: o.id },
                          `Escolheste "${o.label}"! Fica ótimo para brincar e explorar.`
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer border ${
                        castle.outfit === o.id
                          ? 'bg-[#0D9488] text-white border-[#0F766E]'
                          : 'bg-white border-[#CBD5E1] text-[#1E2B2A]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#EDE9FE]/50 border border-[#C4B5FD] space-y-2">
                <p className="text-sm font-extrabold text-[#5B21B6] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Escolher uma história para a hora de dormir:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {BEDTIME_STORIES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        markRoutine(
                          `historia-${st.id}`,
                          { bedtimeStory: st.id },
                          `História escolhida: "${st.title}". ${st.summary}`
                        )
                      }
                      className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                        castle.bedtimeStory === st.id
                          ? 'bg-[#7C3AED] text-white border-[#6D28D9]'
                          : 'bg-white border-[#DDD6FE] text-[#1E2B2A]'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeRoom === 'banho' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'dentes',
                    { teethBrushed: true },
                    'Dentes bem escovados! Sorriso limpo e saudável!'
                  )
                }
                className="p-4 min-h-[64px] rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] border-2 border-[#38BDF8]/50 font-bold flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#0284C7]" />
                <span>
                  {castle.teethBrushed ? 'Dentes escovados ✓' : 'Escovar os dentes'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'mochila',
                    { backpackReady: true },
                    'A mochila cor-de-rosa ficou pronta com água, caderno-mapa e bússola!'
                  )
                }
                className="p-4 min-h-[64px] rounded-2xl bg-[#FCE7F3] hover:bg-[#FBCFE8] border-2 border-[#EC4899]/50 font-bold flex items-center gap-3 cursor-pointer"
              >
                <Check className="w-5 h-5 text-[#DB2777]" />
                <span>
                  {castle.backpackReady ? 'Mochila preparada ✓' : 'Preparar a mochila rosa'}
                </span>
              </button>
            </div>
          )}

          {activeRoom === 'biblioteca' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'livros',
                    { booksOrganized: true },
                    'Organizaste os livros na estante por tamanho e cor!'
                  )
                }
                className="p-4 min-h-[64px] rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] border-2 border-[#F59E0B]/50 font-bold flex items-center gap-3 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-[#B45309]" />
                <span>
                  {castle.booksOrganized ? 'Livros organizados ✓' : 'Organizar os livros'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'planta',
                    { plantWatered: true },
                    'Regaste a planta da janela com o regador pequeno. As folhas brilharam!'
                  )
                }
                className="p-4 min-h-[64px] rounded-2xl bg-[#DCFCE7] hover:bg-[#BBF7D0] border-2 border-[#22C55E]/50 font-bold flex items-center gap-3 cursor-pointer"
              >
                <Flower2 className="w-5 h-5 text-[#15803D]" />
                <span>
                  {castle.plantWatered ? 'Planta regada ✓' : 'Regar a planta da janela'}
                </span>
              </button>
            </div>
          )}

          {activeRoom === 'sala_mesa' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'mesa',
                    { tableSet: true },
                    'Pusemos pratos, copos, fruta lavada e pão já preparados em cima da mesa!'
                  )
                }
                className="p-4 min-h-[64px] rounded-2xl bg-[#FFEDD5] hover:bg-[#FED7AA] border-2 border-[#FB923C]/50 font-bold flex items-center gap-3 cursor-pointer"
              >
                <Utensils className="w-5 h-5 text-[#C2410C]" />
                <span>
                  {castle.tableSet
                    ? 'Mesa posta com lanche seguro ✓'
                    : 'Pôr a mesa (alimentos já preparados)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  markRoutine(
                    'agua_caes',
                    { dogsWatered: true },
                    'A Athenas e o Lucky beberam água fresca da tigela limpa e abanaram a cauda!'
                  )
                }
                className="p-4 min-h-[64px] rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] border-2 border-[#38BDF8]/50 font-bold flex items-center gap-3 cursor-pointer"
              >
                <Droplets className="w-5 h-5 text-[#0284C7]" />
                <span>
                  {castle.dogsWatered
                    ? 'Água fresca dada aos cães ✓'
                    : 'Dar água fresca à Athenas e ao Lucky'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ROUTINE CHALLENGES */}
      {activeTab === 'desafios' && (
        <div className="rounded-3xl bg-white border-2 border-[#E2DAC3] p-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'rotina_manha', label: '1. Ordem da Manhã' },
                { id: 'mochila', label: '2. Mochila Segura' },
                { id: 'mesa_livros', label: '3. Livros & Mesa' },
                { id: 'noite', label: '4. Rotina da Noite' },
              ] as const
            ).map((ch) => {
              const isDone = castle.completedCastleChallenges.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setSelectedChallenge(ch.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm cursor-pointer border ${
                    selectedChallenge === ch.id
                      ? 'bg-[#F59E0B] text-[#1E2B2A] border-[#D97706]'
                      : isDone
                      ? 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                      : 'bg-[#FAF6EC] text-[#334155] border-[#E2DAC3]'
                  }`}
                >
                  {ch.label} {isDone ? '✓' : ''}
                </button>
              );
            })}
          </div>

          {selectedChallenge === 'rotina_manha' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0D9488]" />
                <h3 className="font-display text-xl font-bold">
                  {isEasy
                    ? 'Ordena os 3 passos da manhã pela ordem certa:'
                    : 'Organiza o horário completo da manhã (5 passos):'}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#FAF6EC] min-h-[56px]">
                {morningPlan.length === 0 ? (
                  <span className="text-sm font-semibold text-[#64748B]">
                    Toca nas ações em baixo pela ordem certa...
                  </span>
                ) : (
                  morningPlan.map((step, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-[#CCFBF1] text-[#0F766E] font-bold text-sm"
                    >
                      {i + 1}. {step}
                    </span>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {morningChoices.map((opt) => {
                  const used = morningPlan.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={used}
                      onClick={() => {
                        const expected = morningTarget[morningPlan.length];
                        if (opt === expected) {
                          sound.playTap();
                          const next = [...morningPlan, opt];
                          setMorningPlan(next);
                          if (next.length === morningTarget.length) {
                            completeCastleChallenge(
                              'rotina_manha',
                              'Horário da manhã organizado perfeitamente! Todos saem calmos e preparados.'
                            );
                          }
                        } else {
                          sound.playGentleTryAgain();
                          setMessage(
                            `Dica gentil: antes disso, costuma vir "${expected}"!`
                          );
                        }
                      }}
                      className={`px-4 py-3 rounded-2xl border-2 font-bold text-sm cursor-pointer ${
                        used
                          ? 'bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8]'
                          : 'bg-white hover:bg-[#FEF3C7] border-[#CBD5E1]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedChallenge === 'mochila' && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">
                {isEasy
                  ? 'Escolhe os 3 objetos seguros e úteis para levar na mochila do passeio:'
                  : 'Planeia a mochila: escolhe os 4 itens certos (e deixa brinquedos pesados no quarto):'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'agua', label: 'Garrafa de Água', ok: true },
                  { id: 'mapa', label: 'Caderno-Mapa', ok: true },
                  { id: 'bussola', label: 'Bússola', ok: true },
                  { id: 'maca', label: 'Maçã Lavada', ok: true },
                  { id: 'bola', label: 'Bola Pesada', ok: false },
                  { id: 'almofada', label: 'Almofada Grande', ok: false },
                ].map((item) => {
                  const picked = packedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!item.ok) {
                          sound.playGentleTryAgain();
                          setMessage(
                            `"${item.label}" fica melhor no quarto para a mochila não ficar pesada!`
                          );
                          return;
                        }
                        if (picked) return;
                        sound.playTap();
                        const next = [...packedItems, item.id];
                        setPackedItems(next);
                        const goalCount = isEasy ? 3 : 4;
                        if (next.length >= goalCount) {
                          completeCastleChallenge(
                            'mochila',
                            'Mochila leve, segura e completa para explorar com a Esmeralda!'
                          );
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm cursor-pointer ${
                        picked
                          ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                          : 'bg-white hover:bg-[#ECFDF5] border-[#CBD5E1]'
                      }`}
                    >
                      {item.label} {picked ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedChallenge === 'mesa_livros' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Parte 1 · Padrão dos Livros na Estante:
                </h3>
                <p className="text-sm font-semibold text-[#4B5E5B] mb-3">
                  {isEasy
                    ? 'Sequência: Azul, Amarelo, Azul, ?'
                    : 'Sequência: Azul, Amarelo, Verde, Azul, Amarelo, ?'}
                </p>
                <div className="flex gap-3">
                  {['Azul', 'Amarelo', 'Verde'].map((color) => {
                    const expected = isEasy ? 'Amarelo' : 'Verde';
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (color === expected) {
                            sound.playSuccess();
                            setBookPatternAnswer(color);
                            setMessage('Livros em padrão! Agora confirma a contagem da mesa.');
                          } else {
                            sound.playGentleTryAgain();
                            setMessage('Observa a ordem das cores repetidas na estante!');
                          }
                        }}
                        className={`px-5 py-3 rounded-2xl border-2 font-bold cursor-pointer ${
                          bookPatternAnswer === color
                            ? 'bg-[#D1FAE5] border-[#10B981]'
                            : 'bg-white border-[#CBD5E1]'
                        }`}
                      >
                        Livro {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EFE9D8]">
                <h3 className="font-display text-xl font-bold mb-2">
                  Parte 2 · Contagem da Mesa &amp; Tigelas:
                </h3>
                <p className="text-sm font-semibold text-[#4B5E5B] mb-3">
                  {isEasy
                    ? 'Quantos pratos precisamos para a Esmeralda e a Larissa?'
                    : 'Precisamos de 2 pratos na mesa e 2 tigelas de água para Athenas e Lucky. Quantas peças são ao todo?'}
                </p>
                <div className="flex gap-3">
                  {(isEasy ? [1, 2, 3] : [3, 4, 5]).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        const target = isEasy ? 2 : 4;
                        if (n === target) {
                          setTableCountOk(true);
                          completeCastleChallenge(
                            'mesa_livros',
                            'Estante em padrão e mesa completa para todos!'
                          );
                        } else {
                          sound.playGentleTryAgain();
                          setMessage('Conta as meninas e os cães com calma!');
                        }
                      }}
                      className={`min-w-[74px] min-h-[54px] rounded-2xl border-2 font-display text-2xl font-bold cursor-pointer ${
                        tableCountOk && n === (isEasy ? 2 : 4)
                          ? 'bg-[#D1FAE5] border-[#10B981]'
                          : 'bg-white border-[#0D9488]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedChallenge === 'noite' && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">
                {isEasy
                  ? 'Antes de ler a história de dormir, o que falta fazer se os brinquedos ainda estão no chão?'
                  : 'Lê o resumo da noite: cortinas fechadas, tigelas dos cães com água, dentes escovados... O que ainda falta antes de dormir?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'ok', label: 'Arrumar os brinquedos e escolher uma história calma', ok: true },
                  { id: 'no1', label: 'Ir correr lá fora no escuro sem avisar', ok: false },
                  { id: 'no2', label: 'Deixar a água dos cães vazia até amanhã', ok: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (opt.ok) {
                        setNightStepOk(true);
                        completeCastleChallenge(
                          'noite',
                          'Boa noite tranquila! Tudo arrumado e seguro no Castelo das Bonecas.'
                        );
                      } else {
                        sound.playGentleTryAgain();
                        setMessage('Isso não é seguro nem acolhedor para a hora de dormir. Escolhe outra opção!');
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 font-bold text-left cursor-pointer ${
                      nightStepOk && opt.ok
                        ? 'bg-[#D1FAE5] border-[#10B981]'
                        : 'bg-white hover:bg-[#EDE9FE]/40 border-[#CBD5E1]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CASTLE CUSTOMIZATION */}
      {activeTab === 'decorar' && (
        <div className="rounded-3xl bg-white border-2 border-[#E2DAC3] p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Wall colors */}
            <div className="space-y-2.5">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#0D9488]" />
                <span>Cor das Paredes do Castelo</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(WALL_COLOR_THEMES) as CastleWallColor[]).map((colorKey) => {
                  const t = WALL_COLOR_THEMES[colorKey];
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        onUpdateCastle((prev) => ({ ...prev, wallColor: colorKey }));
                        setMessage(`Pintaste o castelo de ${t.label}!`);
                      }}
                      className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center gap-2 cursor-pointer ${
                        castle.wallColor === colorKey
                          ? 'border-[#0D9488] bg-[#F0FDFA]'
                          : 'border-[#E2DAC3] bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/15"
                        style={{ backgroundColor: t.border }}
                      />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Furniture theme */}
            <div className="space-y-2.5">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
                <span>Estilo dos Móveis &amp; Tapetes</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'estrelas', label: 'Móveis Estrelas' },
                    { id: 'jardim', label: 'Móveis Jardim' },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onUpdateCastle((prev) => ({ ...prev, furnitureTheme: style.id }));
                      setMessage(`Mudaste a decoração para ${style.label}!`);
                    }}
                    className={`p-3 rounded-xl border-2 font-bold text-sm cursor-pointer ${
                      castle.furnitureTheme === style.id
                        ? 'border-[#F59E0B] bg-[#FFFBEB]'
                        : 'border-[#E2DAC3] bg-white'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Place earned Stickers in selected room */}
          <div className="pt-4 border-t border-[#EFE9D8] space-y-3">
            <h3 className="font-display text-lg font-bold text-[#1E2B2A]">
              Colar Autocolantes Conquistados em:{' '}
              <span className="text-[#0F766E]">
                {CASTLE_ROOMS.find((r) => r.id === activeRoom)?.name}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {CHAPTERS.map((ch) => {
                const unlocked = unlockedStickers.includes(ch.sticker.id);
                const placedHere = (castle.placedStickers[activeRoom] ?? []).includes(
                  ch.sticker.id
                );
                return (
                  <button
                    key={ch.sticker.id}
                    type="button"
                    onClick={() => toggleStickerInRoom(ch.sticker.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 min-w-[116px] cursor-pointer ${
                      placedHere
                        ? 'bg-[#D1FAE5] border-[#10B981]'
                        : unlocked
                        ? 'bg-white hover:bg-[#FFFBEB] border-[#F59E0B]/50'
                        : 'bg-[#F4EFE2] border-[#E2DAC3] opacity-75'
                    }`}
                  >
                    <StickerBadgeArt
                      stickerId={ch.sticker.id}
                      size={48}
                      unlocked={unlocked}
                    />
                    <span className="text-xs font-bold text-[#1E2B2A]">
                      {ch.sticker.name}
                    </span>
                    <span className="text-[11px] font-bold text-[#4B5E5B]">
                      {!unlocked
                        ? `Cap. ${ch.id}`
                        : placedHere
                        ? 'Na parede ✓'
                        : 'Colar aqui'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
