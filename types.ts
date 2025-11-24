export interface Project {
  id: string;
  name: string;
  details: string;
  edited: string;
  image: string;
}

export interface CardSet {
  id: string;
  name: string;
  count: string;
  image: string;
  icon?: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: 'Number' | 'Icon' | 'Tag';
  weight: number;
  icon: string;
  color: string;
}

export interface RaritySlot {
  id: string;
  rarity: string;
  count: number;
  total: number;
}
