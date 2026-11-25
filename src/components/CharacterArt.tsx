import React from 'react';
import { CharacterId } from '../types/game';

interface AvatarProps {
  character: CharacterId;
  size?: number;
  className?: string;
}

export const CharacterAvatar: React.FC<AvatarProps> = ({
  character,
  size = 64,
  className = '',
}) => {
  switch (character) {
    case 'esmeralda':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 96 96"
          fill="none"
          className={className}
          aria-label="Esmeralda"
        >
          <circle cx="48" cy="48" r="45" fill="#D8F3EF" stroke="#14B8A6" strokeWidth="4" />
          {/* Pink backpack straps */}
          <rect x="24" y="62" width="48" height="24" rx="12" fill="#EC4899" />
          {/* Turquoise dress */}
          <path d="M27 65C27 56 36 53 48 53C60 53 69 56 69 65L72 85H24L27 65Z" fill="#06B6D4" />
          <path d="M29 66C31 61 33 59 35 59V82H29V66Z" fill="#F472B6" />
          <path d="M61 59C63 59 65 61 67 66V82H61V59Z" fill="#F472B6" />
          {/* Neck & Head */}
          <rect x="42" y="50" width="12" height="10" rx="5" fill="#7C4A2D" />
          <circle cx="48" cy="39" r="19" fill="#8D5534" />
          {/* Braided twists */}
          <path d="M28 36C27 23 36 16 48 16C60 16 69 23 68 36" fill="#231712" />
          <rect x="25" y="29" width="7" height="20" rx="3.5" fill="#231712" />
          <rect x="64" y="29" width="7" height="20" rx="3.5" fill="#231712" />
          <rect x="30" y="20" width="6" height="14" rx="3" fill="#231712" />
          <rect x="60" y="20" width="6" height="14" rx="3" fill="#231712" />
          <circle cx="34" cy="21" r="2.5" fill="#F472B6" />
          <circle cx="62" cy="21" r="2.5" fill="#F472B6" />
          {/* Eyes & cheerful smile */}
          <circle cx="41" cy="39" r="3" fill="#1F1612" />
          <circle cx="55" cy="39" r="3" fill="#1F1612" />
          <circle cx="42" cy="38" r="1" fill="#FFFFFF" />
          <circle cx="56" cy="38" r="1" fill="#FFFFFF" />
          <circle cx="35" cy="44" r="3" fill="#E07A5F" opacity="0.45" />
          <circle cx="61" cy="44" r="3" fill="#E07A5F" opacity="0.45" />
          <path d="M41 47C44 51 52 51 55 47" stroke="#2D160C" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );

    case 'larissa':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 96 96"
          fill="none"
          className={className}
          aria-label="Larissa"
        >
          <circle cx="48" cy="48" r="45" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="4" />
          {/* Two curly space-bun puffs */}
          <circle cx="27" cy="24" r="10" fill="#5C3A21" />
          <circle cx="69" cy="24" r="10" fill="#5C3A21" />
          <circle cx="31" cy="26" r="2.5" fill="#FBBF24" />
          <circle cx="65" cy="26" r="2.5" fill="#FBBF24" />
          {/* Coral shirt + Yellow overalls */}
          <path d="M26 65C26 56 35 53 48 53C61 53 70 56 70 65L73 85H23L26 65Z" fill="#FB7185" />
          <rect x="33" y="57" width="30" height="28" rx="6" fill="#FACC15" />
          <rect x="35" y="55" width="6" height="10" rx="2" fill="#EAB308" />
          <rect x="55" y="55" width="6" height="10" rx="2" fill="#EAB308" />
          {/* Head */}
          <rect x="42" y="50" width="12" height="10" rx="5" fill="#C68652" />
          <circle cx="48" cy="39" r="19" fill="#D99B66" />
          <path d="M29 36C29 24 38 19 48 19C58 19 67 24 67 36C62 29 55 27 48 27C41 27 34 29 29 36Z" fill="#5C3A21" />
          {/* Eyes & smile */}
          <circle cx="41" cy="39" r="3" fill="#231712" />
          <circle cx="55" cy="39" r="3" fill="#231712" />
          <circle cx="42" cy="38" r="1" fill="#FFFFFF" />
          <circle cx="56" cy="38" r="1" fill="#FFFFFF" />
          <circle cx="35" cy="44" r="3" fill="#F43F5E" opacity="0.35" />
          <circle cx="61" cy="44" r="3" fill="#F43F5E" opacity="0.35" />
          <path d="M41 46C44 51 52 51 55 46" stroke="#422006" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );

    case 'athenas':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 96 96"
          fill="none"
          className={className}
          aria-label="Athenas"
        >
          <circle cx="48" cy="48" r="45" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="4" />
          {/* Chest & White Patch */}
          <path d="M27 64C27 55 36 51 48 51C60 51 69 55 69 64L72 85H24L27 64Z" fill="#8A8F99" />
          <path d="M48 56L56 68L48 82L40 68L48 56Z" fill="#F8FAFC" />
          {/* Floppy ears */}
          <path d="M27 30C20 33 19 45 25 49C29 47 31 39 30 31Z" fill="#6B7280" />
          <path d="M69 30C76 33 77 45 71 49C67 47 65 39 66 31Z" fill="#6B7280" />
          {/* Head */}
          <ellipse cx="48" cy="40" rx="20" ry="18" fill="#9CA3AF" />
          {/* Muzzle */}
          <ellipse cx="48" cy="46" rx="11" ry="8" fill="#D1D5DB" />
          {/* Hazel eyes */}
          <circle cx="39" cy="36" r="3.4" fill="#451A03" />
          <circle cx="57" cy="36" r="3.4" fill="#451A03" />
          <circle cx="40" cy="34.8" r="1.1" fill="#FFFFFF" />
          <circle cx="58" cy="34.8" r="1.1" fill="#FFFFFF" />
          {/* Nose & happy mouth */}
          <ellipse cx="48" cy="44" rx="4.5" ry="3.2" fill="#374151" />
          <path d="M43 49C45 52 51 52 53 49" stroke="#374151" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'lucky':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 96 96"
          fill="none"
          className={className}
          aria-label="Lucky"
        >
          <circle cx="48" cy="48" r="45" fill="#FFEDD5" stroke="#F97316" strokeWidth="4" />
          {/* Body */}
          <path d="M28 65C28 55 37 52 48 52C59 52 68 55 68 65L71 85H25L28 65Z" fill="#D98A3C" />
          <path d="M37 54H59L54 78H42L37 54Z" fill="#27272A" opacity="0.2" />
          {/* Pointed German Shepherd ears */}
          <path d="M29 36L26 14L41 26Z" fill="#27272A" />
          <path d="M31 33L29 19L38 27Z" fill="#E5A25D" />
          <path d="M67 36L70 14L55 26Z" fill="#27272A" />
          <path d="M65 33L67 19L58 27Z" fill="#E5A25D" />
          {/* Head */}
          <ellipse cx="48" cy="41" rx="18" ry="17" fill="#E5A25D" />
          {/* Black mask */}
          <path d="M36 33C40 27 56 27 60 33C58 43 55 52 48 52C41 52 38 43 36 33Z" fill="#27272A" opacity="0.88" />
          {/* Eyes */}
          <circle cx="40" cy="37" r="3.2" fill="#18181B" />
          <circle cx="56" cy="37" r="3.2" fill="#18181B" />
          <circle cx="41" cy="35.8" r="1.1" fill="#FFFFFF" />
          <circle cx="57" cy="35.8" r="1.1" fill="#FFFFFF" />
          {/* Nose & happy pink tongue */}
          <ellipse cx="48" cy="44" rx="4.2" ry="3" fill="#09090B" />
          <path d="M45 49C45 54 51 54 51 49Z" fill="#FB7185" />
          <path d="M42 48C45 51 51 51 54 48" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
};

export type NatureIconId =
  | 'leaf_gold'
  | 'leaf_green'
  | 'mushroom_red'
  | 'mushroom_blue'
  | 'compass'
  | 'acorn'
  | 'flower_pink'
  | 'flower_sun'
  | 'duckling'
  | 'frog'
  | 'butterfly'
  | 'ladybug'
  | 'star'
  | 'lantern'
  | 'apple'
  | 'strawberry'
  | 'banana'
  | 'bell'
  | 'squirrel'
  | 'rabbit'
  | 'hedgehog'
  | 'fox'
  | 'rainbow'
  | 'pinecone'
  | 'water_drop';

export const NatureItemIcon: React.FC<{
  id: NatureIconId;
  size?: number;
  className?: string;
}> = ({ id, size = 44, className = '' }) => {
  switch (id) {
    case 'leaf_gold':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M14 48C14 24 30 12 52 12C52 34 40 50 16 50" fill="#FBBF24" stroke="#B45309" strokeWidth="3" />
          <path d="M12 52L42 22" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'leaf_green':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M14 48C14 24 30 12 52 12C52 34 40 50 16 50" fill="#34D399" stroke="#047857" strokeWidth="3" />
          <path d="M12 52L42 22" stroke="#065F46" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'mushroom_red':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <rect x="24" y="34" width="16" height="20" rx="6" fill="#FEF3C7" stroke="#92400E" strokeWidth="3" />
          <path d="M10 36C10 20 20 12 32 12C44 12 54 20 54 36H10Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
          <circle cx="23" cy="24" r="3.5" fill="#FFFFFF" />
          <circle cx="38" cy="20" r="3" fill="#FFFFFF" />
          <circle cx="44" cy="29" r="3" fill="#FFFFFF" />
        </svg>
      );
    case 'mushroom_blue':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <rect x="24" y="34" width="16" height="20" rx="6" fill="#FEF3C7" stroke="#1E3A8A" strokeWidth="3" />
          <path d="M10 36C10 20 20 12 32 12C44 12 54 20 54 36H10Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3" />
          <circle cx="24" cy="24" r="3.5" fill="#E0F2FE" />
          <circle cx="39" cy="22" r="3" fill="#E0F2FE" />
        </svg>
      );
    case 'compass':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="34" r="21" fill="#FDE68A" stroke="#B45309" strokeWidth="3.5" />
          <circle cx="32" cy="34" r="15" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" />
          <path d="M32 21L37 34L32 47L27 34Z" fill="#EF4444" />
          <path d="M32 34L37 34L32 47L27 34Z" fill="#3B82F6" />
          <circle cx="32" cy="34" r="2.5" fill="#FFFFFF" />
          <circle cx="32" cy="10" r="4" stroke="#B45309" strokeWidth="3" />
        </svg>
      );
    case 'acorn':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M18 30H46C46 44 39 54 32 56C25 54 18 44 18 30Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
          <path d="M14 30C14 20 22 16 32 16C42 16 50 20 50 30H14Z" fill="#92400E" stroke="#451A03" strokeWidth="3" />
          <path d="M32 16V9" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'flower_pink':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="16" r="9" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <circle cx="47" cy="27" r="9" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <circle cx="41" cy="44" r="9" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <circle cx="23" cy="44" r="9" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <circle cx="17" cy="27" r="9" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <circle cx="32" cy="31" r="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
        </svg>
      );
    case 'flower_sun':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="20" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" strokeDasharray="8 4" />
          <circle cx="32" cy="32" r="14" fill="#FDE047" />
          <circle cx="32" cy="32" r="9" fill="#78350F" />
        </svg>
      );
    case 'duckling':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <ellipse cx="32" cy="40" rx="16" ry="13" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
          <circle cx="38" cy="23" r="11" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
          <path d="M47 22L56 25L47 28Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
          <circle cx="41" cy="21" r="2" fill="#1F2937" />
        </svg>
      );
    case 'frog':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <ellipse cx="32" cy="38" rx="18" ry="14" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
          <circle cx="22" cy="23" r="6" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
          <circle cx="42" cy="23" r="6" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
          <circle cx="22" cy="23" r="2.5" fill="#111827" />
          <circle cx="42" cy="23" r="2.5" fill="#111827" />
          <path d="M24 39C28 43 36 43 40 39" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'butterfly':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <ellipse cx="20" cy="24" rx="11" ry="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
          <ellipse cx="44" cy="24" rx="11" ry="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
          <ellipse cx="22" cy="42" rx="8" ry="9" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
          <ellipse cx="42" cy="42" rx="8" ry="9" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
          <rect x="29" y="18" width="6" height="28" rx="3" fill="#374151" />
        </svg>
      );
    case 'ladybug':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="35" r="17" fill="#EF4444" stroke="#7F1D1D" strokeWidth="3" />
          <path d="M22 22C25 16 39 16 42 22Z" fill="#1F2937" />
          <line x1="32" y1="22" x2="32" y2="52" stroke="#1F2937" strokeWidth="3" />
          <circle cx="24" cy="34" r="3" fill="#1F2937" />
          <circle cx="40" cy="34" r="3" fill="#1F2937" />
          <circle cx="25" cy="43" r="2.5" fill="#1F2937" />
          <circle cx="39" cy="43" r="2.5" fill="#1F2937" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path
            d="M32 8L39.4 23L56 25.4L44 37.1L46.8 53.6L32 45.8L17.2 53.6L20 37.1L8 25.4L24.6 23L32 8Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="31" r="2" fill="#78350F" />
          <circle cx="36" cy="31" r="2" fill="#78350F" />
          <path d="M29 36C31 38 33 38 35 36" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'lantern':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <line x1="32" y1="6" x2="32" y2="14" stroke="#78350F" strokeWidth="3" />
          <rect x="18" y="16" width="28" height="32" rx="12" fill="#FB923C" stroke="#9A3412" strokeWidth="3" />
          <ellipse cx="32" cy="32" rx="7" ry="12" fill="#FEF08A" />
          <rect x="22" y="13" width="20" height="5" rx="2" fill="#78350F" />
          <rect x="22" y="46" width="20" height="5" rx="2" fill="#78350F" />
        </svg>
      );
    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M32 18C22 15 14 23 14 34C14 46 23 54 32 52C41 54 50 46 50 34C50 23 42 15 32 18Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
          <path d="M32 18V10" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 13C38 9 43 12 42 17C38 18 34 16 32 13Z" fill="#22C55E" />
        </svg>
      );
    case 'strawberry':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M18 24C18 18 46 18 46 24C46 40 37 54 32 54C27 54 18 40 18 24Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="3" />
          <path d="M22 20L32 13L42 20L32 24Z" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
          <circle cx="27" cy="32" r="1.5" fill="#FEF08A" />
          <circle cx="37" cy="32" r="1.5" fill="#FEF08A" />
          <circle cx="32" cy="41" r="1.5" fill="#FEF08A" />
        </svg>
      );
    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M14 42C24 52 46 46 50 18C44 28 28 38 14 36Z" fill="#FACC15" stroke="#A16207" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M20 42C20 25 24 16 32 16C40 16 44 25 44 42L49 47H15L20 42Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="32" cy="51" r="4" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
        </svg>
      );
    case 'squirrel':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M16 46C8 36 12 18 24 18C26 26 24 38 24 46Z" fill="#EA580C" stroke="#9A3412" strokeWidth="2.5" />
          <circle cx="36" cy="34" r="13" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
          <path d="M28 24L31 15L36 22Z" fill="#F97316" stroke="#9A3412" strokeWidth="2" />
          <path d="M39 22L44 15L46 24Z" fill="#F97316" stroke="#9A3412" strokeWidth="2" />
          <circle cx="32" cy="32" r="2.2" fill="#1F2937" />
          <circle cx="41" cy="32" r="2.2" fill="#1F2937" />
          <circle cx="36.5" cy="36" r="2.5" fill="#431407" />
        </svg>
      );
    case 'rabbit':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <ellipse cx="26" cy="18" rx="4.5" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
          <ellipse cx="38" cy="18" rx="4.5" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="32" cy="38" r="14" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
          <circle cx="27" cy="36" r="2.2" fill="#1E293B" />
          <circle cx="37" cy="36" r="2.2" fill="#1E293B" />
          <circle cx="32" cy="40" r="2.5" fill="#FB7185" />
        </svg>
      );
    case 'hedgehog':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M12 44C12 25 24 16 38 18C48 20 52 32 52 44H12Z" fill="#78350F" />
          <ellipse cx="40" cy="40" rx="13" ry="10" fill="#FDE68A" stroke="#92400E" strokeWidth="2.5" />
          <circle cx="43" cy="38" r="2" fill="#1F2937" />
          <circle cx="52" cy="40" r="2.5" fill="#1F2937" />
        </svg>
      );
    case 'fox':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M16 26L20 12L30 22Z" fill="#EA580C" stroke="#9A3412" strokeWidth="2.5" />
          <path d="M48 26L44 12L34 22Z" fill="#EA580C" stroke="#9A3412" strokeWidth="2.5" />
          <path d="M16 30C16 22 48 22 48 30L32 50Z" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
          <circle cx="26" cy="32" r="2.2" fill="#1F2937" />
          <circle cx="38" cy="32" r="2.2" fill="#1F2937" />
          <circle cx="32" cy="46" r="3" fill="#1F2937" />
        </svg>
      );
    case 'rainbow':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M10 44C10 26 20 18 32 18C44 18 54 26 54 44" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
          <path d="M16 44C16 30 23 24 32 24C41 24 48 30 48 44" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
          <path d="M22 44C22 34 26 30 32 30C38 30 42 34 42 44" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case 'pinecone':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <ellipse cx="32" cy="34" rx="14" ry="18" fill="#92400E" stroke="#451A03" strokeWidth="3" />
          <path d="M22 28L32 34L42 28" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 38L32 44L44 38" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'water_drop':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M32 10C32 10 48 29 48 40C48 49 41 55 32 55C23 55 16 49 16 40C16 29 32 10 32 10Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <path d="M24 39C24 44 27 47 30 48" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
};

export const StickerBadgeArt: React.FC<{
  stickerId: string;
  size?: number;
  unlocked?: boolean;
}> = ({ stickerId, size = 76, unlocked = true }) => {
  const map: Record<string, NatureIconId> = {
    'sticker-folha': 'leaf_gold',
    'sticker-patinho': 'duckling',
    'sticker-borboleta': 'butterfly',
    'sticker-passaro': 'bell',
    'sticker-estrela': 'star',
  };
  const iconId = map[stickerId] || 'star';

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full flex items-center justify-center border-4 transition-transform duration-200 ${
        unlocked
          ? 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border-[#F59E0B] shadow-md'
          : 'bg-[#EDE9DF] border-dashed border-[#CBD5E1] opacity-55 grayscale'
      }`}
    >
      {stickerId === 'sticker-passaro' ? (
        <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="36" rx="16" ry="13" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <circle cx="42" cy="24" r="9" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <path d="M50 23L57 25L50 28Z" fill="#F59E0B" />
          <circle cx="44" cy="22" r="2" fill="#0F172A" />
          <path d="M22 34C27 30 34 32 36 38C29 40 24 38 22 34Z" fill="#BAE6FD" />
        </svg>
      ) : (
        <NatureItemIcon id={iconId} size={size * 0.68} />
      )}
    </div>
  );
};
