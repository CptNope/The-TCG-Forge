import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../src/hooks/useCards';
import { useAppContext } from '../src/context/AppContext';
import { CardPreview } from '../src/components/CardPreview';
import { AVATAR_STYLES } from '../src/utils/placeholderImages';

const CardEditorScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId, currentSetId } = useAppContext();
  const { createCard } = useCards(currentProjectId || undefined);
  
  const [activeTab, setActiveTab] = useState('General');
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('');
  const [cost, setCost] = useState(0);
  const [power, setPower] = useState(0);
  const [health, setHealth] = useState(0);
  const [abilityText, setAbilityText] = useState('');
  const [rarity, setRarity] = useState('Common');
  const [avatarStyle, setAvatarStyle] = useState<'identicon' | 'bottts' | 'avataaars' | 'shapes' | 'pixel-art' | 'monsters' | 'initials' | 'gradients'>('identicon');

  const handleSave = () => {
    if (!cardName.trim() || !currentProjectId || !currentSetId) {
      alert('Please fill in at least the card name');
      return;
    }

    createCard({
      projectId: currentProjectId,
      setId: currentSetId,
      name: cardName,
      type: cardType || 'Creature',
      cost: cost || 0,
      power: power,
      health: health,
      abilityText: abilityText,
      flavorText: '',
      artwork: '',
      rarity: rarity,
      attributes: {},
      tags: [],
    });

    // Show success and navigate to cards list
    alert(`Card "${cardName}" created successfully!`);
    navigate('/sets-list');
  };

  if (!currentProjectId || !currentSetId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No set selected</p>
          <button
            onClick={() => navigate('/sets-grid')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go to Sets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm p-4 pb-2 justify-between border-b border-black/5 dark:border-white/5">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center">Create New Card</h2>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={handleSave}
            className="text-primary text-base font-bold hover:text-primary-dark transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Preview Area */}
        <div className="p-4 bg-gray-100 dark:bg-[#20182b]">
          <CardPreview
            card={{
              name: cardName || 'Card Name',
              type: cardType || 'Type',
              rarity: rarity,
              cost: cost,
              power: power,
              health: health,
              abilityText: abilityText,
              artwork: '',
            }}
            avatarStyle={avatarStyle}
            className="w-full"
            showStats={true}
          />
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
            Live preview with auto-generated placeholder
          </p>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 bg-background-light dark:bg-background-dark z-10 pt-2">
          <div className="flex border-b border-black/10 dark:border-white/10 px-4 justify-between">
            {['General', 'Text', 'Attributes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 flex-1 transition-colors ${
                  activeTab === tab 
                    ? 'border-primary text-slate-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400'
                }`}
              >
                <p className="text-sm font-bold">{tab}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-col gap-6 p-4 pb-24">
          {activeTab === 'General' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">Card Name *</label>
                <input 
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white"
                  placeholder="Enter card name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">Card Type</label>
                <input 
                  type="text"
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white"
                  placeholder="e.g., Creature, Spell, Artifact"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">Rarity</label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none transition-all dark:text-white"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-base font-medium">Cost</label>
                  <input 
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-center text-base focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white"
                    placeholder="3"
                    min="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base font-medium">Power</label>
                  <input 
                    type="number"
                    value={power || ''}
                    onChange={(e) => setPower(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-center text-base focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white"
                    placeholder="5"
                    min="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base font-medium">Health</label>
                  <input 
                    type="number"
                    value={health || ''}
                    onChange={(e) => setHealth(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-center text-base focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white"
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">Placeholder Style</label>
                <select
                  value={avatarStyle}
                  onChange={(e) => setAvatarStyle(e.target.value as any)}
                  className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none transition-all dark:text-white"
                  title="Choose placeholder avatar style"
                >
                  {AVATAR_STYLES.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label} - {style.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">Auto-generated image style when no artwork is uploaded</p>
              </div>

              <button className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors mt-4">
                <span className="material-symbols-outlined">upload_file</span>
                <span className="text-base font-bold">Upload Custom Artwork (Coming Soon)</span>
              </button>
            </>
          )}

          {activeTab === 'Text' && (
             <div className="flex flex-col gap-2">
               <label className="text-base font-medium">Ability Text</label>
               <textarea 
                 rows={8}
                 value={abilityText}
                 onChange={(e) => setAbilityText(e.target.value)}
                 className="w-full rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-base focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white resize-none"
                 placeholder="Enter abilities, effects, and rules text..."
               />
               <p className="text-xs text-slate-500">Describe what this card does when played or activated</p>
             </div>
          )}

          {activeTab === 'Attributes' && (
             <div className="text-center py-10 text-gray-500">
               <span className="material-symbols-outlined text-4xl mb-2">construction</span>
               <p>No custom attributes defined yet.</p>
               <button onClick={() => navigate('/attributes')} className="text-primary font-bold mt-2">Manage Attributes</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardEditorScreen;
