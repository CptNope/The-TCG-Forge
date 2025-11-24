import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Attribute } from '../types';

const attributes: Attribute[] = [
  { id: '1', name: 'Strength', type: 'Number', weight: 5.0, icon: 'swords', color: 'blue' },
  { id: '2', name: 'Mana Cost', type: 'Number', weight: 8.0, icon: 'water_drop', color: 'blue' },
  { id: '3', name: 'Element', type: 'Icon', weight: 3.5, icon: 'local_fire_department', color: 'green' },
  { id: '4', name: 'Rarity', type: 'Tag', weight: 1.0, icon: 'star', color: 'purple' },
];

const AttributesScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
       {/* Top App Bar */}
       <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 justify-between border-b border-black/5 dark:border-white/5">
         <div className="flex size-12 shrink-0 items-center">
            <button onClick={() => navigate(-1)}>
               <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-2xl">arrow_back</span>
            </button>
         </div>
         <h1 className="text-lg font-bold leading-tight flex-1 text-center">Custom Attributes</h1>
         <div className="flex w-12 items-center justify-end"></div>
       </header>

       <main className="flex-1 p-4 space-y-4 pb-28 overflow-y-auto">
         {attributes.map((attr) => (
             <div key={attr.id} className="flex flex-col gap-3 bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-black/5 dark:border-transparent">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                        <span className="material-symbols-outlined text-primary text-2xl">{attr.icon}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-medium leading-normal">{attr.name}</p>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 bg-${attr.color}-500/20 text-${attr.color}-400`}>
                            {attr.type}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 w-12">Weight</label>
                    <input 
                       type="range"
                       min="0"
                       max="10"
                       step="0.5"
                       defaultValue={attr.weight}
                       className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-semibold w-12 text-center">{attr.weight.toFixed(1)}x</span>
                </div>
             </div>
         ))}
       </main>

       {/* FAB */}
       <div className="fixed bottom-6 right-6 z-20">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

    </div>
  );
};

export default AttributesScreen;
