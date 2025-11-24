import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardSet } from '../types';

const cardSets: CardSet[] = [
  { id: '1', name: 'Whispers of the Void', count: '78 Cards', image: '', icon: 'auto_awesome' },
  { id: '2', name: 'Chrono Nexus', count: '124 Cards', image: '', icon: 'stadia_controller' },
  { id: '3', name: "Inferno's Reach", count: '95 Cards', image: '', icon: 'local_fire_department' },
];

const CardSetsListScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-black/5 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="flex items-center justify-center">
                 <span className="material-symbols-outlined">arrow_back</span>
             </button>
            <h1 className="text-xl font-bold">Card Sets</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {cardSets.map((set) => (
            <div 
              key={set.id}
              onClick={() => navigate('/pack-designer')}
              className="group flex cursor-pointer items-center gap-4 rounded-xl bg-white dark:bg-white/5 p-4 transition-all hover:bg-gray-50 dark:hover:bg-white/10 border border-black/5 dark:border-transparent shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <span className="material-symbols-outlined text-primary text-2xl">{set.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{set.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{set.count}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 transition-transform group-hover:translate-x-1">chevron_right</span>
            </div>
          ))}
        </div>
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
