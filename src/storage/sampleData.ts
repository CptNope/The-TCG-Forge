/**
 * Sample/Demo data for initial app load
 * Users can edit or delete these
 */

import { Project, CardSet, Card } from '../../types';

export const SAMPLE_PROJECTS: Omit<Project, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    name: 'Cosmic Wanderers',
    details: 'A space exploration trading card game with alien species and starships',
    edited: '2 days ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHAG-e-s6ohNSAstw8t3-o9Y6ZzU0dfQ7q7gogN4Nm236z7kQj7-VTUdwPB5eBQcxciN4vUBHPLJSsOIF5j045AatnSWkVepGgieTmAlV162bQ5mcAM-KGmXt1lnNuP5K5oYnyp8JqumXPwFzMnC_QyIUSu6ugit2XhlgAErtJdPopj87Ba5pNKLohjUC5w1fwWRUg-4cEKwjYG0CCLCCtBaVcsPBqQbnJgKNAn592NOdas3IrY6kRHqb_qrNKtmRSo0f9BUhZZKQ',
    cardCount: 150,
    setCount: 3,
  },
  {
    name: 'Aetherium Chronicles',
    details: 'Fantasy realm battles with magic, creatures, and legendary heroes',
    edited: '5 days ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsNnX0gdY9KuuZ1-pqeb-ov2GgF8_1mjLqEy_s1MAdznEh2NUhyaOwT-cFHUYAO-sbNIZVW-VL4RZux2IN6_ikVYWndM97G14gYfEciSXgPptd6-EmXQvPTX7anl0tdOHG2sqJrKWasp7M0EyWRVxX2H3ON1ge8fnHuAaEaxfj39p2l54891Mz7GHWAJxoaOmudb1JyTvgmRLUEZx_QsD-sNBE8DSv0kk4cwcMNLOOvZyK226aWMPW3gfhsFC7lnXr2xNyf9YL4uE',
    cardCount: 212,
    setCount: 5,
  },
];

export const SAMPLE_SETS: Omit<CardSet, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    projectId: '', // Will be filled in
    name: 'Starter Set',
    count: '50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHAG-e-s6ohNSAstw8t3-o9Y6ZzU0dfQ7q7gogN4Nm236z7kQj7-VTUdwPB5eBQcxciN4vUBHPLJSsOIF5j045AatnSWkVepGgieTmAlV162bQ5mcAM-KGmXt1lnNuP5K5oYnyp8JqumXPwFzMnC_QyIUSu6ugit2XhlgAErtJdPopj87Ba5pNKLohjUC5w1fwWRUg-4cEKwjYG0CCLCCtBaVcsPBqQbnJgKNAn592NOdas3IrY6kRHqb_qrNKtmRSo0f9BUhZZKQ',
    description: 'Beginner-friendly cards to start your journey',
  },
  {
    projectId: '',
    name: 'Advanced Collection',
    count: '100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsNnX0gdY9KuuZ1-pqeb-ov2GgF8_1mjLqEy_s1MAdznEh2NUhyaOwT-cFHUYAO-sbNIZVW-VL4RZux2IN6_ikVYWndM97G14gYfEciSXgPptd6-EmXQvPTX7anl0tdOHG2sqJrKWasp7M0EyWRVxX2H3ON1ge8fnHuAaEaxfj39p2l54891Mz7GHWAJxoaOmudb1JyTvgmRLUEZx_QsD-sNBE8DSv0kk4cwcMNLOOvZyK226aWMPW3gfhsFC7lnXr2xNyf9YL4uE',
    description: 'Powerful cards for experienced players',
  },
];

export const SAMPLE_CARDS: Omit<Card, 'id' | 'dateCreated' | 'dateModified'>[] = [
  {
    projectId: '',
    setId: '',
    name: 'Stellar Dragon',
    type: 'Creature',
    cost: 5,
    power: 6,
    health: 5,
    abilityText: 'Flying, Cosmic Breath: Deal 3 damage to any target when this enters play.',
    flavorText: 'It soars between the stars, leaving trails of cosmic dust.',
    artwork: '',
    rarity: 'Rare',
    attributes: {},
    tags: ['Dragon', 'Space', 'Flying'],
  },
  {
    projectId: '',
    setId: '',
    name: 'Arcane Bolt',
    type: 'Spell',
    cost: 2,
    abilityText: 'Deal 3 damage to target creature or player. Draw a card.',
    flavorText: 'Pure magical energy, concentrated into a single strike.',
    artwork: '',
    rarity: 'Common',
    attributes: {},
    tags: ['Spell', 'Damage', 'Draw'],
  },
  {
    projectId: '',
    setId: '',
    name: 'Mystic Guardian',
    type: 'Creature',
    cost: 3,
    power: 2,
    health: 5,
    abilityText: 'Defender, Ward: This creature cannot be targeted by opponent spells.',
    flavorText: 'Silent sentinel of the ancient temples.',
    artwork: '',
    rarity: 'Uncommon',
    attributes: {},
    tags: ['Guardian', 'Defender', 'Magic'],
  },
];

/**
 * Initialize sample data if localStorage is empty
 */
export function shouldLoadSampleData(storageKey: string): boolean {
  const existing = localStorage.getItem(storageKey);
  return !existing || existing === '[]';
}

/**
 * Generate sample projects with proper IDs and timestamps
 */
export function generateSampleProjects(): Project[] {
  const now = new Date().toISOString();
  return SAMPLE_PROJECTS.map((project, index) => ({
    ...project,
    id: `sample_project_${index + 1}`,
    dateCreated: new Date(Date.now() - (index + 1) * 86400000 * 2).toISOString(), // 2, 4 days ago
    dateModified: new Date(Date.now() - (index + 1) * 86400000 * 2).toISOString(),
  }));
}

/**
 * Generate sample sets for a project
 */
export function generateSampleSets(projectId: string): CardSet[] {
  const now = new Date().toISOString();
  return SAMPLE_SETS.map((set, index) => ({
    ...set,
    id: `sample_set_${projectId}_${index + 1}`,
    projectId,
    dateCreated: now,
    dateModified: now,
  }));
}

/**
 * Generate sample cards for a set
 */
export function generateSampleCards(projectId: string, setId: string): Card[] {
  const now = new Date().toISOString();
  return SAMPLE_CARDS.map((card, index) => ({
    ...card,
    id: `sample_card_${setId}_${index + 1}`,
    projectId,
    setId,
    dateCreated: now,
    dateModified: now,
  }));
}
