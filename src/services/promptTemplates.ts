/**
 * Prompt Template System
 * Customizable prompts for consistent AI generation
 */

export interface PromptTemplate {
  id: string;
  name: string;
  type: 'artwork' | 'ability' | 'flavor' | 'name' | 'bulk_ideas';
  systemPrompt: string;
  userPrompt: string;
  variables: string[]; // Available variables like {name}, {type}, {power}, etc.
  category?: string;
  dateCreated: string;
  dateModified: string;
}

// Default artwork prompt templates
export const DEFAULT_ARTWORK_TEMPLATES: Omit<PromptTemplate, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    name: 'Fantasy Trading Card (Default)',
    type: 'artwork',
    category: 'General',
    systemPrompt: '',
    userPrompt: `Fantasy trading card game artwork for "{name}", {type_article} {type}. {element_theme}{rarity_theme}Highly detailed digital art, vibrant colors, professional game card illustration, centered composition, dramatic lighting.`,
    variables: ['name', 'type', 'type_article', 'element', 'element_theme', 'rarity', 'rarity_theme', 'power', 'health', 'cost', 'abilityText'],
  },
  {
    name: 'Realistic Photo Style',
    type: 'artwork',
    category: 'Style',
    systemPrompt: '',
    userPrompt: `Photorealistic image of {name}, {type_article} {type}. {element_theme}Ultra realistic, professional photography, dramatic lighting, shallow depth of field, 8K quality.`,
    variables: ['name', 'type', 'type_article', 'element', 'element_theme'],
  },
  {
    name: 'Anime/Manga Style',
    type: 'artwork',
    category: 'Style',
    systemPrompt: '',
    userPrompt: `Anime-style illustration of {name}, {type_article} {type}. {element_theme}Vibrant colors, dynamic pose, professional anime art, clean linework, dramatic shading, by studio trigger.`,
    variables: ['name', 'type', 'type_article', 'element', 'element_theme'],
  },
  {
    name: 'Dark Fantasy',
    type: 'artwork',
    category: 'Theme',
    systemPrompt: '',
    userPrompt: `Dark fantasy artwork of {name}, {type_article} {type}. {element_theme}Gothic atmosphere, ominous lighting, dark colors, dramatic shadows, horror elements, by Zdzisław Beksiński style.`,
    variables: ['name', 'type', 'type_article', 'element', 'element_theme'],
  },
  {
    name: 'Cute & Colorful',
    type: 'artwork',
    category: 'Theme',
    systemPrompt: '',
    userPrompt: `Cute and colorful illustration of {name}, {type_article} adorable {type}. {element_theme}Pastel colors, friendly appearance, kawaii style, big eyes, cheerful, by Studio Ghibli style.`,
    variables: ['name', 'type', 'type_article', 'element', 'element_theme'],
  },
];

// Default ability text templates
export const DEFAULT_ABILITY_TEMPLATES: Omit<PromptTemplate, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    name: 'Balanced Ability (Default)',
    type: 'ability',
    category: 'General',
    systemPrompt: `You are an expert game designer creating ability text for a trading card game. Generate creative, balanced, and thematic abilities that fit the card's properties. Use clear game terminology. Keep it concise (1-3 sentences). The ability should be fun, playable, and appropriately powered for the card's stats.`,
    userPrompt: `Generate an ability for "{name}", {type_article} {type} card.
Stats: Power {power}, Health {health}, Cost {cost}
{element_context}
Create a unique, balanced ability that fits this card's theme and power level.`,
    variables: ['name', 'type', 'type_article', 'power', 'health', 'cost', 'element', 'element_context'],
  },
  {
    name: 'Aggressive/Offensive',
    type: 'ability',
    category: 'Style',
    systemPrompt: `You are a game designer creating aggressive, offensive abilities for a card game. Focus on damage-dealing, attacking, and aggressive mechanics. Keep it concise and impactful.`,
    userPrompt: `Generate an aggressive, attack-focused ability for "{name}" (Power {power}, Cost {cost}). The ability should deal damage or enable aggressive plays.`,
    variables: ['name', 'power', 'cost', 'type'],
  },
  {
    name: 'Defensive/Control',
    type: 'ability',
    category: 'Style',
    systemPrompt: `You are a game designer creating defensive, controlling abilities for a card game. Focus on protection, healing, blocking, and defensive mechanics. Keep it concise.`,
    userPrompt: `Generate a defensive, protective ability for "{name}" (Health {health}, Cost {cost}). The ability should protect, heal, or control the battlefield.`,
    variables: ['name', 'health', 'cost', 'type'],
  },
  {
    name: 'Complex/Advanced',
    type: 'ability',
    category: 'Complexity',
    systemPrompt: `You are a game designer creating complex, strategic abilities for experienced players. Use advanced mechanics, combos, and strategic depth. Can be 2-4 sentences for complexity.`,
    userPrompt: `Generate a complex, strategic ability for "{name}". Stats: Power {power}, Health {health}, Cost {cost}. Create an ability with interesting decision points and combo potential.`,
    variables: ['name', 'power', 'health', 'cost', 'element'],
  },
  {
    name: 'Simple/Beginner',
    type: 'ability',
    category: 'Complexity',
    systemPrompt: `You are a game designer creating simple, easy-to-understand abilities for new players. Use straightforward mechanics and clear language. Keep it very brief (1 sentence).`,
    userPrompt: `Generate a simple, beginner-friendly ability for "{name}". Keep it very straightforward and easy to understand.`,
    variables: ['name', 'type', 'power'],
  },
];

// Default flavor text templates
export const DEFAULT_FLAVOR_TEMPLATES: Omit<PromptTemplate, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    name: 'Atmospheric Quote (Default)',
    type: 'flavor',
    category: 'General',
    systemPrompt: `You are a creative writer crafting atmospheric flavor text for trading cards. Write evocative, memorable quotes or descriptions that add lore and character. Keep it brief (1-2 sentences). Make it thematic and enhance the card's identity.`,
    userPrompt: `Write flavor text for "{name}", {type_article} {type}. {ability_context}Create atmospheric text that enhances the card's theme.`,
    variables: ['name', 'type', 'type_article', 'abilityText', 'ability_context', 'element'],
  },
  {
    name: 'Lore/Worldbuilding',
    type: 'flavor',
    category: 'Style',
    systemPrompt: `You are a worldbuilder creating lore for a trading card game. Write flavor text that reveals world history, culture, or mythology. Make it feel like part of a larger narrative.`,
    userPrompt: `Write worldbuilding flavor text for "{name}". Reveal something about the world, history, or culture this card belongs to.`,
    variables: ['name', 'type', 'element'],
  },
  {
    name: 'Character Quote',
    type: 'flavor',
    category: 'Style',
    systemPrompt: `You are a dialogue writer creating memorable character quotes for cards. Write a quote that reveals personality, motivation, or attitude. Make it punchy and memorable.`,
    userPrompt: `Write a character quote for "{name}". The quote should reveal their personality or philosophy. Format as: "Quote" -Character Name`,
    variables: ['name', 'type'],
  },
  {
    name: 'Poetic/Mystical',
    type: 'flavor',
    category: 'Tone',
    systemPrompt: `You are a poet creating mystical, poetic flavor text for cards. Use metaphor, imagery, and lyrical language. Make it beautiful and evocative.`,
    userPrompt: `Write poetic, mystical flavor text for "{name}". Use metaphor and beautiful imagery.`,
    variables: ['name', 'element'],
  },
];

// Default name generation templates
export const DEFAULT_NAME_TEMPLATES: Omit<PromptTemplate, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    name: 'Fantasy Name (Default)',
    type: 'name',
    category: 'General',
    systemPrompt: `You are a creative naming specialist for trading card games. Generate unique, memorable names that fit the theme. Return ONLY the name, nothing else. No explanations, no quotes, just the name.`,
    userPrompt: `Generate a fantasy {type} name with theme: {theme}. {element_context}`,
    variables: ['type', 'theme', 'element', 'element_context'],
  },
  {
    name: 'Epic/Legendary',
    type: 'name',
    category: 'Style',
    systemPrompt: `You are naming legendary, epic entities for a card game. Create powerful, grand names that sound impressive. Return ONLY the name.`,
    userPrompt: `Generate an epic, legendary name for a {type}. Theme: {theme}. Make it sound powerful and memorable.`,
    variables: ['type', 'theme'],
  },
  {
    name: 'Cute/Friendly',
    type: 'name',
    category: 'Style',
    systemPrompt: `You are naming cute, friendly characters for a card game. Create adorable, approachable names. Return ONLY the name.`,
    userPrompt: `Generate a cute, friendly name for a {type}. Theme: {theme}. Make it sound adorable and approachable.`,
    variables: ['type', 'theme'],
  },
];

/**
 * Process prompt template with card data
 */
export function processPromptTemplate(
  template: string,
  cardData: Record<string, any>
): string {
  let processed = template;

  // Helper to get article (a/an)
  const getArticle = (word: string): string => {
    if (!word) return 'a';
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes(word[0]?.toLowerCase()) ? 'an' : 'a';
  };

  // Process special computed variables
  const computedVars: Record<string, string> = {
    type_article: getArticle(cardData.type || ''),
    element_theme: cardData.element ? `${cardData.element} element themed. ` : '',
    element_context: cardData.element ? `Element: ${cardData.element}` : '',
    rarity_theme: ['Legendary', 'Epic'].includes(cardData.rarity) ? 'Epic and powerful. ' : '',
    ability_context: cardData.abilityText ? `Ability: ${cardData.abilityText}. ` : '',
  };

  // Replace computed variables first
  Object.entries(computedVars).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    processed = processed.replace(regex, value);
  });

  // Replace direct card data variables
  Object.entries(cardData).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    processed = processed.replace(regex, String(value || ''));
  });

  // Clean up any remaining unreplaced variables
  processed = processed.replace(/\{[^}]+\}/g, '');

  // Clean up extra spaces
  processed = processed.replace(/\s+/g, ' ').trim();

  return processed;
}

/**
 * Save custom templates to localStorage
 */
export function saveCustomTemplates(templates: PromptTemplate[]): void {
  localStorage.setItem('custom_prompt_templates', JSON.stringify(templates));
}

/**
 * Load custom templates from localStorage
 */
export function loadCustomTemplates(): PromptTemplate[] {
  const stored = localStorage.getItem('custom_prompt_templates');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get all templates (default + custom)
 */
export function getAllTemplates(): PromptTemplate[] {
  const custom = loadCustomTemplates();
  
  const defaultTemplates = [
    ...DEFAULT_ARTWORK_TEMPLATES,
    ...DEFAULT_ABILITY_TEMPLATES,
    ...DEFAULT_FLAVOR_TEMPLATES,
    ...DEFAULT_NAME_TEMPLATES,
  ].map((t, idx) => ({
    ...t,
    id: `default_${t.type}_${idx}`,
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  }));

  return [...defaultTemplates, ...custom];
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: PromptTemplate['type']): PromptTemplate[] {
  return getAllTemplates().filter(t => t.type === type);
}
