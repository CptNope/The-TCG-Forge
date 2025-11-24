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
  const [boxConfig, setBoxConfig] = useState(DEFAULT_BOX_CONFIG);
  const [currentPack, setCurrentPack] = useState<SimulationResult | null>(null);
  const [boxSimulation, setBoxSimulation] = useState<BoxSimulationResult | null>(null);
  const [bulkResults, setBulkResults] = useState<BoxSimulationResult[]>([]);
  const [view, setView] = useState<'pack' | 'box' | 'bulk'>('pack');
  const [selectedConfig, setSelectedConfig] = useState<'standard' | 'premium' | 'starter'>('standard');
  const [bulkCount, setBulkCount] = useState(5);

  const currentSet = sets.find(s => s.id === currentSetId);
  // Filter cards by BOTH project AND set for proper isolation
  const setCards = cards.filter(c => c.projectId === currentProjectId && c.setId === currentSetId);

  // Update pack config when selection changes
  const handleConfigChange = (configName: 'standard' | 'premium' | 'starter') => {
    setSelectedConfig(configName);
    setPackConfig(DEFAULT_PACK_CONFIGS[configName]);
    setBoxConfig({
      ...boxConfig,
      packConfig: DEFAULT_PACK_CONFIGS[configName],
    });
  };

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

  const handleBulkSimulation = () => {
    if (setCards.length === 0) {
      alert('No cards in this set to simulate');
      return;
    }

    const validation = validateCardPool(setCards, packConfig);
    if (!validation.valid) {
      alert(`Cannot simulate boxes:\n${validation.errors.join('\n')}`);
      return;
    }

    // Simulate multiple boxes
    const results: BoxSimulationResult[] = [];
    for (let i = 0; i < bulkCount; i++) {
      const result = simulateBox(setCards, boxConfig);
      results.push(result);
    }
    
    setBulkResults(results);
    setCurrentPack(null);
    setBoxSimulation(null);
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
          className={`flex-1 py-3 border-b-2 font-bold text-sm transition-colors ${
            view === 'pack' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500'
          }`}
        >
          Single Pack
        </button>
        <button
          onClick={() => setView('box')}
          className={`flex-1 py-3 border-b-2 font-bold text-sm transition-colors ${
            view === 'box' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500'
          }`}
        >
          Full Box
        </button>
        <button
          onClick={() => setView('bulk')}
          className={`flex-1 py-3 border-b-2 font-bold text-sm transition-colors ${
            view === 'bulk' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500'
          }`}
        >
          Bulk Test
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Pack Configuration Selector */}
        <div className="mb-4 p-4 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
          <h3 className="font-bold mb-3">Pack Type</h3>
          <div className="flex gap-2">
            {(['standard', 'premium', 'starter'] as const).map(config => (
              <button
                key={config}
                onClick={() => handleConfigChange(config)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
                  selectedConfig === config
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {config.charAt(0).toUpperCase() + config.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pack Configuration Details */}
        <div className="mb-6 p-4 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
          <h3 className="font-bold mb-3">Configuration</h3>
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
            {(view === 'box' || view === 'bulk') && (
              <p><strong>Packs per box:</strong> {boxConfig.packsPerBox}</p>
            )}
            {view === 'bulk' && (
              <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                <label className="block mb-2 font-medium">Number of boxes to simulate:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-2 text-sm"
                />
              </div>
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
          ) : view === 'box' ? (
            <button
              onClick={handleSimulateBox}
              className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              📦 Open Box ({boxConfig.packsPerBox} Packs)
            </button>
          ) : (
            <button
              onClick={handleBulkSimulation}
              className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              🎲 Simulate {bulkCount} Boxes ({bulkCount * boxConfig.packsPerBox} Packs)
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

        {/* Bulk Results */}
        {bulkResults.length > 0 && view === 'bulk' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="font-bold mb-3 text-lg">📊 Bulk Simulation Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total Boxes:</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bulkResults.length}</p>
                </div>
                <div>
                  <p className="font-medium">Total Packs:</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {bulkResults.reduce((sum, box) => sum + box.totalPacks, 0)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total Cards:</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {bulkResults.reduce((sum, box) => sum + box.totalCards, 0)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Config:</p>
                  <p className="text-lg font-bold capitalize">{selectedConfig}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                <p className="font-medium mb-2">Average Rarity Per Box:</p>
                {Object.keys(bulkResults[0].overallRarityBreakdown).map(rarity => {
                  const avg = bulkResults.reduce((sum, box) => 
                    sum + (box.overallRarityBreakdown[rarity] || 0), 0
                  ) / bulkResults.length;
                  const expected = expectedDist[rarity] || 0;
                  const variance = ((avg - expected) / expected * 100).toFixed(1);
                  
                  return (
                    <div key={rarity} className="flex justify-between items-center py-1">
                      <span>{rarity}:</span>
                      <span className="font-mono">
                        {avg.toFixed(1)} 
                        <span className="text-xs ml-2 text-slate-500">
                          (exp: {expected}, {variance}%)
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Box Results */}
            <div className="space-y-2">
              <h4 className="font-bold">Individual Box Results:</h4>
              {bulkResults.map((box, index) => (
                <details key={index} className="p-3 bg-white dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10">
                  <summary className="cursor-pointer font-bold hover:text-primary">
                    Box #{index + 1} - {box.totalCards} cards
                    <span className="ml-2 text-xs text-slate-500">
                      ({Object.entries(box.overallRarityBreakdown).map(([r, c]) => `${c} ${r}`).join(', ')})
                    </span>
                  </summary>
                  <div className="mt-2 text-sm space-y-1">
                    {Object.entries(box.overallRarityBreakdown).map(([rarity, count]) => (
                      <div key={rarity} className="flex justify-between">
                        <span>{rarity}:</span>
                        <span className="font-mono">{count} (exp: {expectedDist[rarity] || 0})</span>
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
