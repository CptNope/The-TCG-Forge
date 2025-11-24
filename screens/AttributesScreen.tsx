import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttributes } from '../src/hooks/useAttributes';
import { useAppContext } from '../src/context/AppContext';

const AttributesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId } = useAppContext();
  const { attributes, loading, createAttribute, updateAttribute, deleteAttribute } = useAttributes(currentProjectId || undefined);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Number',
    icon: 'star',
    color: 'blue',
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !currentProjectId) return;

    if (editingId) {
      updateAttribute(editingId, formData);
    } else {
      createAttribute({
        projectId: currentProjectId,
        name: formData.name,
        type: formData.type,
        weight: 5.0,
        icon: formData.icon,
        color: formData.color,
      });
    }

    setShowDialog(false);
    setEditingId(null);
    setFormData({ name: '', type: 'Number', icon: 'star', color: 'blue' });
  };

  const handleEdit = (attr: any) => {
    setEditingId(attr.id);
    setFormData({
      name: attr.name,
      type: attr.type,
      icon: attr.icon || 'star',
      color: attr.color || 'blue',
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this attribute?')) {
      deleteAttribute(id);
    }
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
         {loading ? (
           <div className="flex items-center justify-center h-64">
             <p className="text-slate-500">Loading attributes...</p>
           </div>
         ) : attributes.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-center">
             <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">tune</span>
             <h3 className="text-lg font-bold mb-2">No Custom Attributes</h3>
             <p className="text-slate-500 mb-6">Create attributes to customize your cards</p>
             <button
               onClick={() => setShowDialog(true)}
               className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
             >
               Create First Attribute
             </button>
           </div>
         ) : (
           attributes.map((attr) => (
             <div key={attr.id} className="flex flex-col gap-3 bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-black/5 dark:border-transparent">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                        <span className="material-symbols-outlined text-primary text-2xl">{attr.icon || 'star'}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-medium leading-normal">{attr.name}</p>
                        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 bg-blue-500/20 text-blue-400">
                            {attr.type}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <button 
                          onClick={() => handleEdit(attr)}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(attr.id)}
                          className="p-2 hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                        >
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
                       value={attr.weight}
                       onChange={(e) => updateAttribute(attr.id, { weight: parseFloat(e.target.value) })}
                       className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-semibold w-12 text-center">{attr.weight.toFixed(1)}x</span>
                </div>
             </div>
           ))
         )}
       </main>

       {/* FAB */}
       <div className="fixed bottom-6 right-6 z-20">
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', type: 'Number', icon: 'star', color: 'blue' });
            setShowDialog(true);
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDialog(false)}>
          <div className="bg-white dark:bg-panel-dark rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Attribute</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-primary"
                  placeholder="e.g., Element"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                >
                  <option value="Number">Number</option>
                  <option value="Text">Text</option>
                  <option value="Icon">Icon</option>
                  <option value="Tag">Tag</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                >
                  <option value="star">Star</option>
                  <option value="swords">Swords</option>
                  <option value="water_drop">Water Drop</option>
                  <option value="local_fire_department">Fire</option>
                  <option value="bolt">Lightning</option>
                  <option value="shield">Shield</option>
                  <option value="favorite">Heart</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AttributesScreen;
