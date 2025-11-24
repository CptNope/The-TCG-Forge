/**
 * Professional Export Formats for TCG Production
 * Supports various formats needed by manufacturers and platforms
 */

import { Card, CardSet, Project } from '../../types';

/**
 * Export cards as CSV for print shops
 * Standard format used by many manufacturers
 */
export function exportAsCSV(cards: Card[]): string {
  const headers = [
    'Card ID',
    'Card Name',
    'Type',
    'Rarity',
    'Cost',
    'Power',
    'Health',
    'Ability Text',
    'Flavor Text',
    'Artist',
    'Card Number',
    'Set ID',
    'Tags',
  ];

  const rows = cards.map(card => [
    card.id,
    `"${card.name}"`,
    card.type,
    card.rarity,
    card.cost,
    card.power || '',
    card.health || '',
    `"${card.abilityText.replace(/"/g, '""')}"`, // Escape quotes
    `"${card.flavorText || ''}"`,
    card.artist || '',
    card.cardNumber || '',
    card.setId,
    card.tags?.join(';') || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}

/**
 * Export as JSON (full data)
 * For digital platforms and backup
 */
export function exportAsJSON(data: {
  project?: Project;
  sets?: CardSet[];
  cards: Card[];
}): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Export for Tabletop Simulator
 * Custom deck format
 */
export function exportForTabletopSimulator(cards: Card[], deckName: string): string {
  const deck = {
    ObjectStates: [
      {
        Name: 'DeckCustom',
        ContainedObjects: cards.map((card, index) => ({
          Name: 'Card',
          Nickname: card.name,
          Description: card.abilityText,
          CardID: index + 100,
          Transform: {
            posX: 0,
            posY: 0,
            posZ: 0,
            rotX: 0,
            rotY: 180,
            rotZ: 180,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
        })),
        DeckIDs: cards.map((_, index) => index + 100),
        CustomDeck: {
          '1': {
            FaceURL: 'https://your-card-images.com/sheet.png',
            BackURL: 'https://your-card-images.com/back.png',
            NumWidth: 10,
            NumHeight: 7,
          },
        },
      },
    ],
  };

  return JSON.stringify(deck, null, 2);
}

/**
 * Export as print sheet layout
 * For professional printing (8.5x11 with 9 cards per sheet)
 */
export interface PrintSheetConfig {
  cardsPerRow: number;
  cardsPerColumn: number;
  pageWidth: number; // in inches
  pageHeight: number; // in inches
  bleedSize: number; // in inches
}

export const DEFAULT_PRINT_CONFIG: PrintSheetConfig = {
  cardsPerRow: 3,
  cardsPerColumn: 3,
  pageWidth: 8.5,
  pageHeight: 11,
  bleedSize: 0.125, // 1/8 inch bleed
};

export function generatePrintSheetManifest(
  cards: Card[],
  config: PrintSheetConfig = DEFAULT_PRINT_CONFIG
): {
  totalSheets: number;
  cardsPerSheet: number;
  sheets: Array<{
    sheetNumber: number;
    cards: Card[];
  }>;
} {
  const cardsPerSheet = config.cardsPerRow * config.cardsPerColumn;
  const totalSheets = Math.ceil(cards.length / cardsPerSheet);
  const sheets = [];

  for (let i = 0; i < totalSheets; i++) {
    const startIndex = i * cardsPerSheet;
    const endIndex = Math.min(startIndex + cardsPerSheet, cards.length);
    sheets.push({
      sheetNumber: i + 1,
      cards: cards.slice(startIndex, endIndex),
    });
  }

  return {
    totalSheets,
    cardsPerSheet,
    sheets,
  };
}

/**
 * Export manufacturing specification document
 * Detailed specs for print shops
 */
export function generateManufacturingSpec(
  project: Project,
  sets: CardSet[],
  cards: Card[]
): string {
  const rarityBreakdown: Record<string, number> = {};
  cards.forEach(card => {
    rarityBreakdown[card.rarity] = (rarityBreakdown[card.rarity] || 0) + 1;
  });

  const spec = `
# Manufacturing Specifications
## ${project.name}

### Project Overview
- **Total Sets**: ${sets.length}
- **Total Unique Cards**: ${cards.length}
- **Date Generated**: ${new Date().toLocaleDateString()}

### Card Specifications
- **Card Size**: Standard TCG (2.5" x 3.5" / 63mm x 88mm)
- **Card Stock**: 300gsm linen finish (recommended)
- **Finish**: Matte or gloss (specify preference)
- **Corners**: Rounded 3mm radius
- **Bleed**: 1/8" (3mm) all sides

### Rarity Distribution
${Object.entries(rarityBreakdown)
    .map(([rarity, count]) => `- **${rarity}**: ${count} cards (${((count / cards.length) * 100).toFixed(1)}%)`)
    .join('\n')}

### Sets Breakdown
${sets.map(set => `
#### ${set.name}
- **Set ID**: ${set.id}
- **Target Count**: ${set.count}
- **Description**: ${set.description || 'N/A'}
`).join('\n')}

### File Delivery Requirements
1. **Card Faces**: High-resolution PNG (300 DPI minimum)
2. **Card Backs**: Single unified back design
3. **File Naming**: [CardID]_[CardName]_[Rarity].png
4. **Color Profile**: CMYK (for offset printing) or RGB (for digital)
5. **Bleed**: Include 1/8" bleed on all artwork

### Packaging Specifications
- **Packs**: 10-15 cards per booster pack
- **Boxes**: 24-36 packs per display box
- **Cases**: 6 boxes per master case

### Quality Control
- Color calibration required
- Print test sheet before full run
- Check for alignment and cut accuracy
- Verify card back alignment

### Contact Information
Generated from The TCG Forge
Export Date: ${new Date().toISOString()}
`;

  return spec.trim();
}

/**
 * Export as MakePlayingCards.com format
 * Popular print-on-demand service
 */
export function exportForMakePlayingCards(cards: Card[]): string {
  // MPC uses specific CSV format
  const headers = ['Front', 'Back', 'Quantity'];
  const rows = cards.map(card => [
    `${card.id}_front.png`,
    'card_back.png',
    '1',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}

/**
 * Download helper function
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all formats at once
 */
export function exportAllFormats(
  project: Project,
  sets: CardSet[],
  cards: Card[]
) {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseName = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  // CSV for manufacturers
  const csv = exportAsCSV(cards);
  downloadFile(csv, `${baseName}_cards_${timestamp}.csv`, 'text/csv');

  // JSON for backup
  const json = exportAsJSON({ project, sets, cards });
  downloadFile(json, `${baseName}_full_data_${timestamp}.json`, 'application/json');

  // Manufacturing specs
  const specs = generateManufacturingSpec(project, sets, cards);
  downloadFile(specs, `${baseName}_manufacturing_spec_${timestamp}.md`, 'text/markdown');

  // MakePlayingCards format
  const mpc = exportForMakePlayingCards(cards);
  downloadFile(mpc, `${baseName}_makeplayingcards_${timestamp}.csv`, 'text/csv');

  // Print sheet manifest
  const printManifest = generatePrintSheetManifest(cards);
  downloadFile(
    JSON.stringify(printManifest, null, 2),
    `${baseName}_print_sheets_${timestamp}.json`,
    'application/json'
  );
}
