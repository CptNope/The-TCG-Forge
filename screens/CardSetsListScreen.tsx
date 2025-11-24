import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../src/hooks/useCards';
import { useSets } from '../src/hooks/useSets';
import { useAppContext } from '../src/context/AppContext';
import { CardPreview } from '../src/components/CardPreview';

const CardSetsListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId, currentSetId } = useAppContext();
  const { cards, loading } = useCards(currentProjectId || undefined);
  const { sets } = useSets(currentProjectId || undefined);

  // Get current set and filter cards
  const currentSet = sets.find(s => s.id === currentSetId);
  const setCards = cards.filter(c => c.projectId === currentProjectId && c.setId === currentSetId);

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

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-black/5 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold">{currentSet?.name || 'Cards'}</h1>
            <p className="text-xs text-slate-500">{setCards.length} cards</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/card-editor')}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="text-sm font-bold">New Card</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">Loading cards...</p>
          </div>
        ) : setCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">style</span>
            <h3 className="text-lg font-bold mb-2">No Cards Yet</h3>
            <p className="text-slate-500 mb-6">Create your first card for this set</p>
            <button
              onClick={() => navigate('/card-editor')}
              className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              Create First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {setCards.map((card) => (
              <div key={card.id} className="group">
                <CardPreview
                  card={card}
                  className="w-full cursor-pointer hover:scale-105 transition-transform"
                  showStats={true}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium truncate">{card.name}</p>
                  <p className="text-xs text-slate-500">{card.rarity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
             onClick={() => navigate('/card-editor')}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default CardSetsListScreen;
