import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../src/context/AppContext';
import { useCards } from '../src/hooks/useCards';
import { useSets } from '../src/hooks/useSets';
import { 
  simulatePack,
  simulateBox,
  DEFAULT_PACK_CONFIGS,
  DEFAULT_BOX_CONFIG,
  validateCardPool,
  calculateExpectedDistribution,
  PackConfiguration,
  SimulationResult,
  BoxSimulationResult
} from '../src/utils/packSimulator';

const PackSimulatorScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId, currentSetId } = useAppContext();
  const { cards } = useCards(currentProjectId || undefined);
  const { sets } = useSets(currentProjectId || undefined);
  
  const [packConfig, setPackConfig] = useState<PackConfiguration>(DEFAULT_PACK_CONFIGS.standard);
  const [boxConfig] = useState(DEFAULT_BOX_CONFIG);
  const [currentPack, setCurrentPack] = useState<SimulationResult | null>(null);
  const [boxSimulation, setBoxSimulation] = useState<BoxSimulationResult | null>(null);
  const [view, setView] = useState<'pack' | 'box'>('pack');

  const currentSet = sets.find(s => s.setId === currentSetId);
  const setCards = cards.filter(c => c.setId === currentSetId);

  const handleSimulatePack = () => {
    if (setCards.length === 0) {
      alert('No cards in this set to simulate');
      return;
    }

    const validation = validateCardPool(setCards, packConfig);
    if (!validation.valid) {
      alert(`Cannot simulate pack:\n${validation.errors.join('\n')}`);
      return;
    }

    const result = simulatePack(setCards, packConfig);
    setCurrentPack(result);
    setBoxSimulation(null);
  };

  const handleSimulateBox = () => {
    if (setCards.length === 0) {
      alert('No cards in this set to simulate');
      return;
    }

    const validation = validateCardPool(setCards, packConfig);
    if (!validation.valid) {
      alert(`Cannot simulate box:\n${validation.errors.join('\n')}`);
      return;
    }

    const result = simulateBox(setCards, boxConfig);
    setBoxSimulation(result);
    setCurrentPack(null);
  };

  if (!currentProjectId || !currentSetId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No set selected</p>
          <button onClick={() => navigate('/sets-grid')} className="px-4 py-2 bg-primary text-white rounded-lg">
            Go to Sets
          </button>
        </div>
      </div>
    );
  }

  const expectedDist = calculateExpectedDistribution(boxConfig);

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-black/5 dark:border-white/5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">Pack Simulator</h1>
        <div className="w-10"></div>
      </header>

      {/* Set Info */}
      <div className="p-4 bg-slate-100 dark:bg-panel-dark border-b border-black/5 dark:border-white/5">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Simulating: {currentSet?.name}</p>
        <p className="text-xs text-slate-500">Available cards: {setCards.length}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 px-4">
        <button
          onClick={() => setView('pack')}
          className={`flex-1 py-3 border-b-2 font-bold transition-colors ${
            view === 'pack' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500'
          }`}
        >
          Single Pack
        </button>
        <button
          onClick={() => setView('box')}
          className={`flex-1 py-3 border-b-2 font-bold transition-colors ${
            view === 'box' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500'
          }`}
        >
          Full Box
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Pack Configuration */}
        <div className="mb-6 p-4 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
          <h3 className="font-bold mb-3">Pack Configuration</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Cards per pack:</strong> {packConfig.cardsPerPack}</p>
            <div>
              <strong>Rarity distribution:</strong>
              <ul className="ml-4 mt-1">
                {packConfig.rarityDistribution.map(slot => (
                  <li key={slot.rarity}>
                    {slot.count}x {slot.rarity}
                  </li>
                ))}
              </ul>
            </div>
            {view === 'box' && (
              <p><strong>Packs per box:</strong> {boxConfig.packsPerBox}</p>
            )}
          </div>
        </div>

        {/* Simulate Buttons */}
        <div className="flex gap-3 mb-6">
          {view === 'pack' ? (
            <button
              onClick={handleSimulatePack}
              className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              🎴 Open Pack
            </button>
          ) : (
            <button
              onClick={handleSimulateBox}
              className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              📦 Open Box ({boxConfig.packsPerBox} Packs)
            </button>
          )}
        </div>

        {/* Pack Results */}
        {currentPack && view === 'pack' && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>✨ Pack #{currentPack.packNumber}</span>
              </h3>
              <div className="text-sm space-y-1">
                {Object.entries(currentPack.rarityBreakdown).map(([rarity, count]) => (
                  <p key={rarity}>
                    <span className="font-medium">{rarity}:</span> {count} cards
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {currentPack.cards.map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className="p-4 bg-white dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10 hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold">{card.name}</p>
                      <p className="text-sm text-slate-500">{card.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      card.rarity === 'Legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      card.rarity === 'Epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      card.rarity === 'Rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      card.rarity === 'Uncommon' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {card.rarity}
                    </span>
                  </div>
                  {card.abilityText && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {card.abilityText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Box Results */}
        {boxSimulation && view === 'box' && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="font-bold mb-2">📦 Box Summary</h3>
              <div className="text-sm space-y-1">
                <p><strong>Total Packs:</strong> {boxSimulation.totalPacks}</p>
                <p><strong>Total Cards:</strong> {boxSimulation.totalCards}</p>
                <div className="mt-3">
                  <p className="font-medium mb-1">Overall Rarity Breakdown:</p>
                  {Object.entries(boxSimulation.overallRarityBreakdown).map(([rarity, count]) => (
                    <p key={rarity} className="ml-2">
                      {rarity}: {count} cards (Expected: {expectedDist[rarity] || 0})
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {boxSimulation.packs.map((pack) => (
                <details key={pack.packNumber} className="p-3 bg-white dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10">
                  <summary className="cursor-pointer font-bold hover:text-primary">
                    Pack #{pack.packNumber} - {pack.cards.length} cards
                    <span className="ml-2 text-xs text-slate-500">
                      ({Object.entries(pack.rarityBreakdown).map(([r, c]) => `${c} ${r}`).join(', ')})
                    </span>
                  </summary>
                  <div className="mt-3 space-y-2">
                    {pack.cards.map((card, index) => (
                      <div key={`${card.id}-${index}`} className="text-sm py-1 flex justify-between">
                        <span>{card.name}</span>
                        <span className="text-slate-500">{card.rarity}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PackSimulatorScreen;
