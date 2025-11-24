/**
 * Pack and Box Simulation System
 * Simulates opening packs based on rarity distribution
 */

import { Card } from '../../types';

export interface PackConfiguration {
  cardsPerPack: number;
  rarityDistribution: {
    rarity: string;
    count: number;
  }[];
}

export interface BoxConfiguration {
  packsPerBox: number;
  packConfig: PackConfiguration;
}

export interface SimulationResult {
  packNumber: number;
  cards: Card[];
  rarityBreakdown: Record<string, number>;
}

export interface BoxSimulationResult {
  totalPacks: number;
  packs: SimulationResult[];
  totalCards: number;
  overallRarityBreakdown: Record<string, number>;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get cards by rarity
 */
function getCardsByRarity(cards: Card[], rarity: string): Card[] {
  return cards.filter(card => card.rarity === rarity);
}

/**
 * Simulate opening a single pack
 */
export function simulatePack(
  availableCards: Card[],
  packConfig: PackConfiguration,
  packNumber: number = 1
): SimulationResult {
  const pulledCards: Card[] = [];
  const rarityBreakdown: Record<string, number> = {};

  // For each rarity slot in the pack
  for (const slot of packConfig.rarityDistribution) {
    const cardsOfRarity = getCardsByRarity(availableCards, slot.rarity);
    
    if (cardsOfRarity.length === 0) {
      console.warn(`No cards available for rarity: ${slot.rarity}`);
      continue;
    }

    // Pull the required number of cards for this rarity
    for (let i = 0; i < slot.count; i++) {
      const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
      pulledCards.push(randomCard);
      rarityBreakdown[slot.rarity] = (rarityBreakdown[slot.rarity] || 0) + 1;
    }
  }

  // Shuffle the pack so rarity order isn't predictable
  const shuffledCards = shuffleArray(pulledCards);

  return {
    packNumber,
    cards: shuffledCards,
    rarityBreakdown,
  };
}

/**
 * Simulate opening a box (multiple packs)
 */
export function simulateBox(
  availableCards: Card[],
  boxConfig: BoxConfiguration
): BoxSimulationResult {
  const packs: SimulationResult[] = [];
  const overallRarityBreakdown: Record<string, number> = {};
  let totalCards = 0;

  // Simulate each pack in the box
  for (let i = 1; i <= boxConfig.packsPerBox; i++) {
    const pack = simulatePack(availableCards, boxConfig.packConfig, i);
    packs.push(pack);
    totalCards += pack.cards.length;

    // Update overall breakdown
    Object.entries(pack.rarityBreakdown).forEach(([rarity, count]) => {
      overallRarityBreakdown[rarity] = (overallRarityBreakdown[rarity] || 0) + count;
    });
  }

  return {
    totalPacks: boxConfig.packsPerBox,
    packs,
    totalCards,
    overallRarityBreakdown,
  };
}

/**
 * Default pack configurations
 */
export const DEFAULT_PACK_CONFIGS = {
  standard: {
    cardsPerPack: 10,
    rarityDistribution: [
      { rarity: 'Common', count: 6 },
      { rarity: 'Uncommon', count: 3 },
      { rarity: 'Rare', count: 1 },
    ],
  },
  premium: {
    cardsPerPack: 15,
    rarityDistribution: [
      { rarity: 'Common', count: 7 },
      { rarity: 'Uncommon', count: 5 },
      { rarity: 'Rare', count: 2 },
      { rarity: 'Epic', count: 1 },
    ],
  },
  starter: {
    cardsPerPack: 50,
    rarityDistribution: [
      { rarity: 'Common', count: 35 },
      { rarity: 'Uncommon', count: 12 },
      { rarity: 'Rare', count: 3 },
    ],
  },
};

/**
 * Default box configuration
 */
export const DEFAULT_BOX_CONFIG: BoxConfiguration = {
  packsPerBox: 24,
  packConfig: DEFAULT_PACK_CONFIGS.standard,
};

/**
 * Calculate expected rarity distribution
 */
export function calculateExpectedDistribution(
  boxConfig: BoxConfiguration
): Record<string, number> {
  const expected: Record<string, number> = {};
  
  boxConfig.packConfig.rarityDistribution.forEach(slot => {
    const total = slot.count * boxConfig.packsPerBox;
    expected[slot.rarity] = total;
  });
  
  return expected;
}

/**
 * Validate if we have enough cards for simulation
 */
export function validateCardPool(
  availableCards: Card[],
  packConfig: PackConfiguration
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const slot of packConfig.rarityDistribution) {
    const cardsOfRarity = getCardsByRarity(availableCards, slot.rarity);
    if (cardsOfRarity.length === 0) {
      errors.push(`No ${slot.rarity} cards available`);
    } else if (cardsOfRarity.length < slot.count) {
      errors.push(`Only ${cardsOfRarity.length} ${slot.rarity} cards available, need at least ${slot.count}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
