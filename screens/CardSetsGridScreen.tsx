import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSets } from '../src/hooks/useSets';
import { useCards } from '../src/hooks/useCards';
import { useAppContext } from '../src/context/AppContext';
import { useProjects } from '../src/hooks/useProjects';
import { exportAllFormats } from '../src/utils/exportFormats';

const CardSetsGridScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId, setCurrentSetId } = useAppContext();
  const { sets, loading, createSet, deleteSet } = useSets(currentProjectId || undefined);
  const { cards } = useCards(currentProjectId || undefined);
  const { getProject } = useProjects();
  const [showNewSetDialog, setShowNewSetDialog] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetTarget, setNewSetTarget] = useState('100');

  const handleExportAll = () => {
    const project = getProject(currentProjectId!);
    if (!project) return;
    exportAllFormats(project, sets, cards);
    setShowExportMenu(false);
    alert('Export files downloaded! Check your Downloads folder.');
  };

  const handleCreateSet = () => {
    if (!newSetName.trim() || !currentProjectId) return;
    
    createSet({
      projectId: currentProjectId,
      name: newSetName,
      count: `0/${newSetTarget}`,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMAeVo0THX0WngFxV6NEpfoCAokuzfNjQ6t2l2juVusNW7iTFIcZHyYWokXgCdO51PAgD1GOPK04rt1iLnRelYyf2LztR6yZS1HjFPIDkJvKT14al-f8szxDtEl-We3h9Fq3Hw0rYHnloHnfkJtb7coxrmnYNxKu96ASYVpy2xUTd22MbsJorOd17HYb8B-a4vblezkckZmBinIJK312LPymtVLbTbo_napaOhSZSLj7QPl46-BQZ8QWSGDHoPiHdAfNSjlbka--8',
      description: 'New card set',
    });
    
    setNewSetName('');
    setNewSetTarget('100');
    setShowNewSetDialog(false);
  };

  const getCardCount = (setId: string) => {
    const setCards = cards.filter(c => c.setId === setId);
    return setCards.length;
  };

  if (!currentProjectId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No project selected</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-transparent">
        <div className="flex size-12 shrink-0 items-center justify-start cursor-pointer" onClick={() => navigate('/projects')}>
          <span className="material-symbols-outlined text-zinc-800 dark:text-white text-2xl">widgets</span>
        </div>
        <h1 className="text-zinc-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">My Card Sets</h1>
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => {
              if (cards.length === 0) {
                alert('Create some cards first!');
                return;
              }
              if (sets.length > 0) {
                setCurrentSetId(sets[0].id);
                navigate('/pack-simulator');
              }
            }}
            className="flex items-center justify-center h-10 px-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">shuffle</span>
          </button>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center justify-center h-10 px-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">download</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[64px] bg-background-light dark:bg-background-dark z-10">
        <div className="flex border-b border-zinc-200 dark:border-zinc-700/50 px-4 gap-8">
          <button className="flex flex-col items-center justify-center border-b-[3px] border-primary text-zinc-900 dark:text-white pb-3 pt-4 flex-1">
            <p className="text-sm font-bold">All Sets</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-zinc-500 dark:text-zinc-400 pb-3 pt-4 flex-1">
            <p className="text-sm font-bold">Official</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-zinc-500 dark:text-zinc-400 pb-3 pt-4 flex-1">
            <p className="text-sm font-bold">Custom</p>
          </button>
        </div>
      </nav>

      {/* Grid Content */}
      <main className="flex-grow overflow-y-auto pb-32">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">Loading sets...</p>
          </div>
        ) : sets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">inventory_2</span>
            <p className="text-lg font-medium mb-2">No card sets yet</p>
            <p className="text-sm text-slate-500 mb-4">Create your first set to start adding cards</p>
            <button
              onClick={() => setShowNewSetDialog(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-bold"
            >
              Create First Set
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {sets.map((set) => {
              const cardCount = getCardCount(set.id);
              const [current, target] = set.count.split('/').map(s => s.replace(' Cards', '').trim());
              const displayCount = `${cardCount}/${target || current} Cards`;
              
              return (
                <div key={set.id} className="flex flex-col gap-3 group">
                  <div 
                    className="w-full aspect-[3/4] bg-center bg-no-repeat bg-cover rounded-xl shadow-md group-hover:shadow-lg transition-all group-active:scale-[0.98] cursor-pointer bg-slate-200 dark:bg-slate-700"
                    style={{ backgroundImage: `url("${set.image}")` }}
                    onClick={() => {
                      setCurrentSetId(set.id);
                      navigate('/sets-list');
                    }}
                  ></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-zinc-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{set.name}</p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">{displayCount}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${set.name}"?`)) {
                          deleteSet(set.id);
                        }
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FABs */}
      <div className="fixed bottom-24 right-4 z-20 flex flex-col items-center gap-4">
        <button 
          onClick={() => {
            if (sets.length === 0) {
              alert('Please create a set first');
              return;
            }
            setCurrentSetId(sets[0].id);
            navigate('/card-editor');
          }}
          className="flex h-12 w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white dark:bg-zinc-700 px-4 py-3 text-zinc-900 dark:text-white shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">note_add</span>
          <span className="text-sm font-bold">Add New Card</span>
        </button>
        <button 
           onClick={() => setShowNewSetDialog(true)}
           className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* Export Menu */}
      {showExportMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowExportMenu(false)}>
          <div className="bg-white dark:bg-panel-dark rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Export for Production</h2>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Export your cards in professional formats for manufacturers and print services.
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                <p className="text-sm font-medium">📄 CSV for Print Shops</p>
                <p className="text-xs text-slate-500 mt-1">Standard format for most manufacturers</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                <p className="text-sm font-medium">📋 JSON Full Data</p>
                <p className="text-xs text-slate-500 mt-1">Complete backup with all information</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                <p className="text-sm font-medium">📝 Manufacturing Specs</p>
                <p className="text-xs text-slate-500 mt-1">Detailed specifications document</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                <p className="text-sm font-medium">🎴 MakePlayingCards Format</p>
                <p className="text-xs text-slate-500 mt-1">Ready for print-on-demand service</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExportMenu(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportAll}
                disabled={cards.length === 0}
                className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                Export All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Set Dialog */}
      {showNewSetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-panel-dark rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Set</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Set Name
                </label>
                <input
                  type="text"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="e.g., Core Set"
                  className="w-full rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-base focus:border-primary focus:ring-primary outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Target Card Count
                </label>
                <input
                  type="number"
                  value={newSetTarget}
                  onChange={(e) => setNewSetTarget(e.target.value)}
                  placeholder="100"
                  className="w-full rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-base focus:border-primary focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewSetDialog(false);
                  setNewSetName('');
                  setNewSetTarget('100');
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSet}
                disabled={!newSetName.trim()}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <footer className="flex gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pb-4 pt-2 fixed bottom-0 w-full z-10">
        <button onClick={() => navigate('/')} className="flex flex-1 flex-col items-center justify-end gap-1 text-zinc-500 dark:text-zinc-400">
          <span className="material-symbols-outlined text-2xl">home</span>
          <p className="text-[10px] font-medium uppercase tracking-wider">Home</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
          <span className="material-symbols-outlined text-2xl filled">inventory</span>
          <p className="text-[10px] font-bold uppercase tracking-wider">Sets</p>
        </button>
        <button onClick={() => navigate('/attributes')} className="flex flex-1 flex-col items-center justify-end gap-1 text-zinc-500 dark:text-zinc-400">
          <span className="material-symbols-outlined text-2xl">style</span>
          <p className="text-[10px] font-medium uppercase tracking-wider">Attrs</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-end gap-1 text-zinc-500 dark:text-zinc-400">
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <p className="text-[10px] font-medium uppercase tracking-wider">Profile</p>
        </button>
      </footer>
    </div>
  );
};

export default CardSetsGridScreen;
