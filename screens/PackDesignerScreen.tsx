import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RaritySlot } from '../types';

const PackDesignerScreen: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'Pack' | 'Box'>('Pack');
  
  const [slots, setSlots] = useState<RaritySlot[]>([
    { id: '1', rarity: 'Rare', count: 1, total: 40 },
    { id: '2', rarity: 'Uncommon', count: 3, total: 30 },
    { id: '3', rarity: 'Common', count: 8, total: 100 },
  ]);

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-black/5 dark:border-white/5">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => navigate(-1)}>
             <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-lg font-bold flex-1 text-center">Pack & Box Designer</h1>
        <div className="flex w-12 items-center justify-end">
          <button className="text-primary text-base font-bold">Templates</button>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-white dark:bg-white/5 p-1 border border-black/5 dark:border-white/5">
          <button
            onClick={() => setMode('Pack')}
            className={`flex-1 flex items-center justify-center rounded-md text-sm font-medium transition-all h-full ${mode === 'Pack' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
          >
            Pack Design
          </button>
          <button
            onClick={() => setMode('Box')}
            className={`flex-1 flex items-center justify-center rounded-md text-sm font-medium transition-all h-full ${mode === 'Box' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
          >
            Box Design
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <section className="px-4">
          <h2 className="text-xl font-bold pb-3 pt-4">Pack Details</h2>
          
          {/* Header Image Uploader */}
          <div 
             className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end items-center overflow-hidden bg-white dark:bg-white/5 rounded-lg min-h-[200px] border border-dashed border-black/10 dark:border-white/10" 
             style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDb18m3caFlxnC8T3Y9MoADUTk14m-NP4vXbFjl6sf7p7hsnLBP-TIbIlJ2i-zywu0ZP5A2DKQBTAVHgOEb3oq_8_CDx9oZ4dKLT-JcLzBrlnRVN0-j_X2q8-FbZl1_ArQN57xV7P9BqTVAzIb7nTodIsj4lFlH2XMso1jqz7talJODY3TJ3GIur5eq5uiF9fqLW9FrjdcfpcmnrZ1VEiCpDOkrv-hqAmngwrbU5ZZStAHabFsL1dHaL_REb06f6MdgMq4Cy4dZatw")' }}
          >
            <button className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm hover:bg-black/70 transition-colors">
              <span className="material-symbols-outlined text-base">upload</span>
              <span>Upload Artwork</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 py-4">
             <div className="flex flex-col gap-2">
                <label className="text-base font-medium">Pack Name</label>
                <input 
                  defaultValue="Chrono Shards"
                  className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none dark:text-white"
                />
             </div>
             
             <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label className="text-base font-medium">Total Cards per Pack</label>
                    <span className="text-base font-bold text-primary">12</span>
                </div>
                <input 
                  readOnly
                  defaultValue="12"
                  className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none dark:text-white opacity-60"
                />
             </div>
          </div>
        </section>

        <section className="px-4">
            <h2 className="text-xl font-bold pb-3 pt-2">Pack Contents</h2>
            <div className="flex flex-col gap-3">
                {slots.map((slot) => (
                    <div key={slot.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-3">
                        <span className="material-symbols-outlined cursor-grab text-gray-400">drag_indicator</span>
                        <div className="flex-grow">
                             <div className="flex justify-between items-center mb-2">
                                <select 
                                    className="bg-transparent text-lg font-bold border-0 focus:ring-0 p-0 text-slate-900 dark:text-white cursor-pointer"
                                    defaultValue={slot.rarity}
                                >
                                    <option className="text-black">Rare</option>
                                    <option className="text-black">Uncommon</option>
                                    <option className="text-black">Common</option>
                                    <option className="text-black">Foil</option>
                                </select>
                                <div className="flex items-center gap-3 bg-gray-100 dark:bg-black/20 p-1 rounded-full">
                                    <button className="flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary hover:bg-primary/30">-</button>
                                    <span className="font-bold w-4 text-center text-sm">{slot.count}</span>
                                    <button className="flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary hover:bg-primary/30">+</button>
                                </div>
                             </div>
                             
                             <div className={`w-full text-left text-xs font-bold px-3 py-2 rounded-md ${
                                 slot.count === 0 ? 'bg-red-500/10 text-red-500' : 'bg-[#25D3B8]/10 text-[#25D3B8]'
                             }`}>
                                 {slot.rarity === 'Common' ? '0' : '25'} / {slot.total} Cards Assigned
                             </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-400 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-black/10 dark:border-white/10 text-primary font-bold py-3.5 rounded-lg hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    Add Rarity Slot
                </button>
            </div>
        </section>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-black/5 dark:border-white/5 flex gap-4">
        <button className="flex-1 py-4 px-4 rounded-xl bg-primary/10 text-primary font-bold text-center hover:bg-primary/20 transition-colors">
            Simulate Unboxing
        </button>
        <button className="flex-1 py-4 px-4 rounded-xl bg-primary text-white font-bold text-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
            Save Pack
        </button>
      </div>

    </div>
  );
};

export default PackDesignerScreen;
