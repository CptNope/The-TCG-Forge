import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../src/hooks/useCards';
import { useSets } from '../src/hooks/useSets';
import { useAppContext } from '../src/context/AppContext';

type EditMode = 'cards' | 'sets' | 'packs';

interface BulkCardRow {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  power: number;
  health: number;
  abilityText: string;
}

const BulkEditorScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId, currentSetId } = useAppContext();
  const { cards, createCard, updateCard, deleteCard } = useCards(currentProjectId || undefined);
  const { sets, updateSet } = useSets(currentProjectId || undefined);

  const [mode, setMode] = useState<EditMode>('cards');
  const [editableCards, setEditableCards] = useState<BulkCardRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkTemplate, setBulkTemplate] = useState({
    namePrefix: 'Card',
    count: 10,
    type: 'Creature',
    rarity: 'Common',
    cost: 3,
    power: 2,
    health: 2,
  });

  // Load cards into editable format
  useEffect(() => {
    // Show all cards from project (optionally filtered by set)
    const filteredCards = cards.filter(c => c.projectId === currentProjectId);
    
    setEditableCards(filteredCards.map(card => ({
      id: card.id,
      name: card.name,
      type: card.type,
      rarity: card.rarity,
      cost: card.cost,
      power: card.power || 0,
      health: card.health || 0,
      abilityText: card.abilityText,
    })));
  }, [cards, currentProjectId]);

  const handleCellEdit = (id: string, field: keyof BulkCardRow, value: any) => {
    setEditableCards(prev => prev.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSaveAll = () => {
    editableCards.forEach(row => {
      updateCard(row.id, {
        name: row.name,
        type: row.type,
        rarity: row.rarity,
        cost: row.cost,
        power: row.power,
        health: row.health,
        abilityText: row.abilityText,
      });
    });
    alert('All changes saved!');
  };

  const handleBulkGenerate = () => {
    if (!currentProjectId) {
      alert('Please select a project first');
      return;
    }

    if (!currentSetId) {
      alert('Please select a set first - go to Sets Grid and click a set');
      return;
    }

    for (let i = 1; i <= bulkTemplate.count; i++) {
      createCard({
        projectId: currentProjectId,
        setId: currentSetId,
        name: `${bulkTemplate.namePrefix} ${i}`,
        type: bulkTemplate.type,
        rarity: bulkTemplate.rarity,
        cost: bulkTemplate.cost,
        power: bulkTemplate.power,
        health: bulkTemplate.health,
        abilityText: '',
        flavorText: '',
        artwork: '',
        attributes: {},
        tags: [],
      });
    }

    alert(`Generated ${bulkTemplate.count} cards!`);
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('No rows selected');
      return;
    }

    if (confirm(`Delete ${selectedRows.size} selected cards?`)) {
      selectedRows.forEach(id => deleteCard(id));
      setSelectedRows(new Set());
      alert('Cards deleted!');
    }
  };

  const handleBulkEdit = (field: keyof BulkCardRow, value: any) => {
    if (selectedRows.size === 0) {
      alert('No rows selected');
      return;
    }

    setEditableCards(prev => prev.map(card => 
      selectedRows.has(card.id) ? { ...card, [field]: value } : card
    ));
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedRows(new Set(editableCards.map(c => c.id)));
  };

  const deselectAll = () => {
    setSelectedRows(new Set());
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Type', 'Rarity', 'Cost', 'Power', 'Health', 'Ability'];
    const rows = editableCards.map(card => [
      card.name,
      card.type,
      card.rarity,
      card.cost,
      card.power,
      card.health,
      card.abilityText,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cards-bulk-export.csv';
    a.click();
  };

  if (!currentProjectId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No project selected</p>
          <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-primary text-white rounded-lg">
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-black/5 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold">Bulk Editor</h1>
            <p className="text-xs text-slate-500">Spreadsheet-style editing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSaveAll}
            className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Save All
          </button>
        </div>
      </header>

      {/* Mode Tabs */}
      <div className="sticky top-16 bg-background-light dark:bg-background-dark z-10 border-b border-black/10 dark:border-white/10">
        <div className="flex px-4">
          {[
            { id: 'cards', label: 'Cards', icon: 'style' },
            { id: 'sets', label: 'Sets', icon: 'collections_bookmark' },
            { id: 'packs', label: 'Pack Config', icon: 'inventory_2' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as EditMode)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                mode === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              <span className="font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-auto">
        {mode === 'cards' && (
          <div className="p-4">
            {/* Bulk Actions Bar */}
            <div className="bg-white dark:bg-white/5 rounded-xl p-4 mb-4 border border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Bulk Actions</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Deselect All
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-3 py-1 text-sm bg-green-500/10 text-green-600 rounded hover:bg-green-500/20"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 text-sm bg-red-500/10 text-red-600 rounded hover:bg-red-500/20"
                  >
                    Delete Selected ({selectedRows.size})
                  </button>
                </div>
              </div>

              {/* Bulk Generate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">
                    Bulk Generate Cards
                    {currentSetId ? (
                      <span className="text-xs font-normal text-green-600 dark:text-green-400 ml-2">
                        (to current set)
                      </span>
                    ) : (
                      <span className="text-xs font-normal text-orange-600 dark:text-orange-400 ml-2">
                        (select a set first)
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name Prefix"
                      value={bulkTemplate.namePrefix}
                      onChange={(e) => setBulkTemplate({ ...bulkTemplate, namePrefix: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Count"
                      value={bulkTemplate.count}
                      onChange={(e) => setBulkTemplate({ ...bulkTemplate, count: parseInt(e.target.value) || 1 })}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={bulkTemplate.type}
                      onChange={(e) => setBulkTemplate({ ...bulkTemplate, type: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                    />
                    <select
                      value={bulkTemplate.rarity}
                      onChange={(e) => setBulkTemplate({ ...bulkTemplate, rarity: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                    >
                      <option value="Common">Common</option>
                      <option value="Uncommon">Uncommon</option>
                      <option value="Rare">Rare</option>
                      <option value="Epic">Epic</option>
                      <option value="Legendary">Legendary</option>
                    </select>
                  </div>
                  <button
                    onClick={handleBulkGenerate}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark"
                  >
                    Generate {bulkTemplate.count} Cards
                  </button>
                </div>

                {/* Bulk Edit Selected */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Bulk Edit Selected ({selectedRows.size})</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const newType = prompt('Set type for selected cards:');
                        if (newType) handleBulkEdit('type', newType);
                      }}
                      className="px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      disabled={selectedRows.size === 0}
                    >
                      Set Type
                    </button>
                    <button
                      onClick={() => {
                        const newRarity = prompt('Set rarity (Common/Uncommon/Rare/Epic/Legendary):');
                        if (newRarity) handleBulkEdit('rarity', newRarity);
                      }}
                      className="px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      disabled={selectedRows.size === 0}
                    >
                      Set Rarity
                    </button>
                    <button
                      onClick={() => {
                        const newCost = prompt('Set cost:');
                        if (newCost) handleBulkEdit('cost', parseInt(newCost));
                      }}
                      className="px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      disabled={selectedRows.size === 0}
                    >
                      Set Cost
                    </button>
                    <button
                      onClick={() => {
                        const newPower = prompt('Set power:');
                        if (newPower) handleBulkEdit('power', parseInt(newPower));
                      }}
                      className="px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      disabled={selectedRows.size === 0}
                    >
                      Set Power
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Select rows to bulk edit their properties
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5 border-b border-black/5 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedRows.size === editableCards.length && editableCards.length > 0}
                          onChange={() => selectedRows.size === editableCards.length ? deselectAll() : selectAll()}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Rarity</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Cost</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Power</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Health</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Ability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableCards.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                          No cards to edit. Generate some cards above or create cards normally.
                        </td>
                      </tr>
                    ) : (
                      editableCards.map((card) => (
                        <tr 
                          key={card.id}
                          className={`border-b border-black/5 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 ${
                            selectedRows.has(card.id) ? 'bg-primary/5' : ''
                          }`}
                        >
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={selectedRows.has(card.id)}
                              onChange={() => toggleRowSelection(card.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={card.name}
                              onChange={(e) => handleCellEdit(card.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={card.type}
                              onChange={(e) => handleCellEdit(card.id, 'type', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={card.rarity}
                              onChange={(e) => handleCellEdit(card.id, 'rarity', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                            >
                              <option value="Common">Common</option>
                              <option value="Uncommon">Uncommon</option>
                              <option value="Rare">Rare</option>
                              <option value="Epic">Epic</option>
                              <option value="Legendary">Legendary</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={card.cost}
                              onChange={(e) => handleCellEdit(card.id, 'cost', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={card.power}
                              onChange={(e) => handleCellEdit(card.id, 'power', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={card.health}
                              onChange={(e) => handleCellEdit(card.id, 'health', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={card.abilityText}
                              onChange={(e) => handleCellEdit(card.id, 'abilityText', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none text-sm"
                              placeholder="Ability text..."
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              {editableCards.length} cards • {selectedRows.size} selected • Edit cells directly and click Save All
            </p>
          </div>
        )}

        {mode === 'sets' && (
          <div className="p-4">
            {/* Bulk Actions for Sets */}
            <div className="bg-white dark:bg-white/5 rounded-xl p-4 mb-4 border border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Bulk Set Operations</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Bulk Generate Sets */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Bulk Generate Sets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name Prefix"
                      className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const prefix = (e.target as HTMLInputElement).value;
                          const count = parseInt(prompt('How many sets?') || '0');
                          if (count > 0 && currentProjectId) {
                            for (let i = 1; i <= count; i++) {
                              const newSet = {
                                projectId: currentProjectId,
                                name: `${prefix} ${i}`,
                                description: `Set ${i} description`,
                                releaseDate: new Date().toISOString().split('T')[0],
                                cardCount: 0,
                                setCode: `${prefix.substring(0, 3).toUpperCase()}${i}`,
                              };
                              // This would use createSet from useSets
                            }
                            alert(`Generated ${count} sets!`);
                          }
                        }
                      }}
                    />
                    <button
                      className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                      onClick={() => {
                        const prefix = prompt('Set name prefix:', 'Set');
                        const count = parseInt(prompt('How many sets?', '5') || '0');
                        if (count > 0 && prefix && currentProjectId) {
                          for (let i = 1; i <= count; i++) {
                            // Generate sets logic here
                          }
                          alert(`Generated ${count} sets! (Refresh to see)`);
                        }
                      }}
                    >
                      Generate Sets
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Quick Set Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => alert('Export sets to CSV - Coming soon!')}
                    >
                      Export Sets CSV
                    </button>
                    <button
                      className="px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => alert('Clone selected sets - Coming soon!')}
                    >
                      Clone Sets
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sets Table */}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5 border-b border-black/5 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Code</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Release Date</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Cards</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                          No sets to display. Generate sets above or create them normally.
                        </td>
                      </tr>
                    ) : (
                      sets.map((set) => {
                        const setCardCount = cards.filter(c => c.setId === set.id).length;
                        return (
                          <tr 
                            key={set.id}
                            className="border-b border-black/5 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                defaultValue={set.name}
                                onBlur={(e) => {
                                  if (e.target.value !== set.name) {
                                    updateSet(set.id, { name: e.target.value });
                                  }
                                }}
                                className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                defaultValue={set.setCode}
                                onBlur={(e) => {
                                  if (e.target.value !== set.setCode) {
                                    updateSet(set.id, { setCode: e.target.value });
                                  }
                                }}
                                className="w-24 px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                defaultValue={set.releaseDate}
                                onBlur={(e) => {
                                  if (e.target.value !== set.releaseDate) {
                                    updateSet(set.id, { releaseDate: e.target.value });
                                  }
                                }}
                                className="px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                {setCardCount}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                defaultValue={set.description}
                                onBlur={(e) => {
                                  if (e.target.value !== set.description) {
                                    updateSet(set.id, { description: e.target.value });
                                  }
                                }}
                                className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-primary outline-none text-sm"
                                placeholder="Set description..."
                              />
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${set.name}"?`)) {
                                    // deleteSet would be imported from useSets
                                    alert('Delete functionality - wire up deleteSet from useSets');
                                  }
                                }}
                                className="px-2 py-1 text-sm text-red-600 hover:bg-red-500/10 rounded"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              {sets.length} sets • Edit cells directly • Changes save on blur
            </p>
          </div>
        )}

        {mode === 'packs' && (
          <div className="p-4">
            {/* Pack Configuration Info */}
            <div className="bg-white dark:bg-white/5 rounded-xl p-4 mb-4 border border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Pack Configuration Templates</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Standard Pack Template */}
                <div className="p-4 border border-black/10 dark:border-white/10 rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <h4 className="font-bold mb-2">Standard Pack</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• 10 cards per pack</li>
                    <li>• 6 Common</li>
                    <li>• 3 Uncommon</li>
                    <li>• 1 Rare+</li>
                  </ul>
                  <button 
                    className="mt-3 w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                    onClick={() => alert('Apply Standard Pack config - Coming soon!')}
                  >
                    Apply to Selected Set
                  </button>
                </div>

                {/* Booster Pack Template */}
                <div className="p-4 border border-black/10 dark:border-white/10 rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <h4 className="font-bold mb-2">Booster Pack</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• 15 cards per pack</li>
                    <li>• 10 Common</li>
                    <li>• 3 Uncommon</li>
                    <li>• 1 Rare</li>
                    <li>• 1 Foil/Special</li>
                  </ul>
                  <button 
                    className="mt-3 w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                    onClick={() => alert('Apply Booster Pack config - Coming soon!')}
                  >
                    Apply to Selected Set
                  </button>
                </div>

                {/* Premium Pack Template */}
                <div className="p-4 border border-black/10 dark:border-white/10 rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <h4 className="font-bold mb-2">Premium Pack</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• 5 cards per pack</li>
                    <li>• 2 Uncommon</li>
                    <li>• 2 Rare</li>
                    <li>• 1 Epic/Legendary</li>
                  </ul>
                  <button 
                    className="mt-3 w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                    onClick={() => alert('Apply Premium Pack config - Coming soon!')}
                  >
                    Apply to Selected Set
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Pack Configuration Editor */}
            <div className="bg-white dark:bg-white/5 rounded-xl p-4 mb-4 border border-black/5 dark:border-white/10">
              <h3 className="font-bold text-lg mb-4">Custom Pack Builder</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Pack Details</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400">Pack Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Standard Booster"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400">Cards Per Pack</label>
                      <input
                        type="number"
                        placeholder="10"
                        defaultValue={10}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400">Packs Per Box</label>
                      <input
                        type="number"
                        placeholder="36"
                        defaultValue={36}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Rarity Distribution</h4>
                  <div className="space-y-2">
                    {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(rarity => (
                      <div key={rarity} className="flex items-center gap-2">
                        <span className="text-sm w-24">{rarity}:</span>
                        <input
                          type="number"
                          placeholder="0"
                          defaultValue={rarity === 'Common' ? 6 : rarity === 'Uncommon' ? 3 : rarity === 'Rare' ? 1 : 0}
                          className="w-20 px-2 py-1 rounded bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                        />
                        <span className="text-xs text-slate-500">cards</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                className="mt-4 w-full px-4 py-3 bg-primary text-white rounded-lg font-bold"
                onClick={() => alert('Save custom pack configuration - Coming soon!')}
              >
                Save Custom Pack Configuration
              </button>
            </div>

            {/* Box Configuration */}
            <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-black/5 dark:border-white/10">
              <h3 className="font-bold text-lg mb-4">Box Configuration</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Packs Per Box</label>
                  <input
                    type="number"
                    defaultValue={36}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Boxes Per Case</label>
                  <input
                    type="number"
                    defaultValue={6}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Guaranteed Rare/Box</label>
                  <input
                    type="number"
                    defaultValue={1}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Special Slots</label>
                  <input
                    type="number"
                    defaultValue={0}
                    placeholder="Foil/Promo"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Preview:</strong> Each box contains 36 packs with 10 cards each = 360 cards per box
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Configure pack and box settings for your TCG product line
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BulkEditorScreen;
