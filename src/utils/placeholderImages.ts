/**
 * Placeholder Image Generation
 * Generate placeholder images for cards without artwork
 */

export type AvatarStyle = 
  | 'identicon'    // Geometric patterns (like GitHub)
  | 'bottts'       // Robot avatars
  | 'avataaars'    // Cartoon people
  | 'shapes'       // Abstract shapes
  | 'pixel-art'    // 8-bit pixel art
  | 'initials'     // Letter-based
  | 'monsters'     // Fun monsters
  | 'gradients';   // Colorful gradients

/**
 * Generate a placeholder image URL using DiceBear Avatars API
 * Free, open-source avatar generation
 */
export function generatePlaceholderImage(
  seed: string,
  style: AvatarStyle = 'identicon',
  size: number = 400
): string {
  const encodedSeed = encodeURIComponent(seed);
  
  switch (style) {
    case 'identicon':
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodedSeed}&size=${size}`;
    
    case 'bottts':
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedSeed}&size=${size}`;
    
    case 'avataaars':
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedSeed}&size=${size}`;
    
    case 'shapes':
      return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodedSeed}&size=${size}`;
    
    case 'pixel-art':
      return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodedSeed}&size=${size}`;
    
    case 'monsters':
      return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodedSeed}&size=${size}`;
    
    case 'initials':
      // UI Avatars for initials
      const initials = getInitials(seed);
      const color = stringToColor(seed);
      return `https://ui-avatars.com/api/?name=${encodedSeed}&size=${size}&background=${color}&color=fff&bold=true&font-size=0.5`;
    
    case 'gradients':
      // Gradient avatars
      return `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodedSeed}&size=${size}`;
    
    default:
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodedSeed}&size=${size}`;
  }
}

/**
 * Generate a gradient background based on card name/type
 */
export function generateGradientBackground(seed: string): string {
  const colors = generateColorPalette(seed);
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
}

/**
 * Get initials from a string
 */
function getInitials(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Generate a consistent color from a string
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = hash % 360;
  const s = 65 + (hash % 20); // 65-85%
  const l = 50 + (hash % 15); // 50-65%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Generate a color palette based on seed
 */
function generateColorPalette(seed: string): string[] {
  const baseColor = stringToColor(seed);
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Parse HSL
  const match = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [baseColor, baseColor];
  
  const [, h, s, l] = match.map(Number);
  
  // Generate complementary color
  const h2 = (h + 60 + (hash % 120)) % 360;
  const color2 = `hsl(${h2}, ${s}%, ${l}%)`;
  
  return [baseColor, color2];
}

/**
 * Rarity-based gradient presets
 */
export const RARITY_GRADIENTS: Record<string, string> = {
  Common: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
  Uncommon: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
  Rare: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
  Epic: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
  Legendary: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
};

/**
 * Get rarity color
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    Common: '#9CA3AF',
    Uncommon: '#10B981',
    Rare: '#3B82F6',
    Epic: '#8B5CF6',
    Legendary: '#F59E0B',
  };
  return colors[rarity] || colors.Common;
}

/**
 * Generate a complete card placeholder with stats overlay
 */
export interface CardPlaceholderOptions {
  name: string;
  type?: string;
  rarity?: string;
  cost?: number;
  power?: number;
  health?: number;
  style?: AvatarStyle;
}

export function generateCardPlaceholder(options: CardPlaceholderOptions): {
  backgroundImage: string;
  gradient: string;
  avatarUrl: string;
} {
  const seed = options.name + (options.type || '');
  const gradient = options.rarity 
    ? RARITY_GRADIENTS[options.rarity] || RARITY_GRADIENTS.Common
    : generateGradientBackground(seed);
  
  const avatarUrl = generatePlaceholderImage(seed, options.style || 'identicon', 300);
  
  return {
    backgroundImage: avatarUrl,
    gradient,
    avatarUrl,
  };
}

/**
 * Popular avatar styles with descriptions
 */
export const AVATAR_STYLES: Array<{ value: AvatarStyle; label: string; description: string }> = [
  { value: 'identicon', label: 'Identicon', description: 'Geometric patterns (GitHub style)' },
  { value: 'bottts', label: 'Robots', description: 'Cute robot avatars' },
  { value: 'avataaars', label: 'Avatars', description: 'Cartoon people' },
  { value: 'shapes', label: 'Shapes', description: 'Abstract geometric shapes' },
  { value: 'pixel-art', label: 'Pixel Art', description: '8-bit retro style' },
  { value: 'monsters', label: 'Monsters', description: 'Friendly monsters' },
  { value: 'initials', label: 'Initials', description: 'Letter-based' },
  { value: 'gradients', label: 'Gradients', description: 'Colorful abstract' },
];
