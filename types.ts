export interface Project {
  id: string;
  name: string;
  details: string;
  edited: string;
  image: string;
  dateCreated: string;
  dateModified: string;
  cardCount?: number;
  setCount?: number;
}

export interface CardSet {
  id: string;
  projectId: string;
  name: string;
  count: string;
  image: string;
  icon?: string;
  description?: string;
  dateCreated: string;
  dateModified: string;
}

export interface Card {
  id: string;
  projectId: string;
  setId: string;
  name: string;
  type: string;
  cost: number;
  power?: number;
  health?: number;
  abilityText: string;
  flavorText?: string;
  artwork: string; // Base64 or URL
  rarity: string;
  attributes: Record<string, any>;
  artist?: string;
  cardNumber?: string;
  tags?: string[];
  dateCreated: string;
  dateModified: string;
}

export interface Attribute {
  id: string;
  projectId: string;
  name: string;
  type: 'Number' | 'Icon' | 'Tag' | 'Text';
  weight: number;
  icon: string;
  color: string;
  defaultValue?: any;
  dateCreated: string;
}

export interface RaritySlot {
  id: string;
  rarity: string;
  count: number;
  total: number;
}

export interface Deck {
  id: string;
  projectId: string;
  name: string;
  description: string;
  cards: DeckCard[];
  format?: string;
  tags?: string[];
  dateCreated: string;
  dateModified: string;
}

export interface DeckCard {
  cardId: string;
  quantity: number;
  isSideboard?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultProject?: string;
  autoSave: boolean;
  exportQuality: 'low' | 'medium' | 'high';
}
