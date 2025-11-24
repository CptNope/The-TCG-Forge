import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttributes } from '../src/hooks/useAttributes';
import { useAppContext } from '../src/context/AppContext';

const AttributeSchemaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentProjectId } = useAppContext();
  const { attributes, createAttribute, updateAttribute, deleteAttribute } = useAttributes(currentProjectId || undefined);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Text',
    icon: 'star',
    color: 'blue',
    defaultValue: '',
    required: false,
    isCore: false,
    displayInPreview: true,
    category: 'General',
    min: 0,
    max: 100,
    options: [] as string[],
  });

  // Predefined attribute templates
  const templates = [
    { name: 'Power', type: 'Number', icon: 'swords', category: 'Stats', min: 0, max: 20, defaultValue: 1 },
    { name: 'Health', type: 'Number', icon: 'favorite', category: 'Stats', min: 0, max: 20, defaultValue: 1 },
    { name: 'Cost', type: 'Number', icon: 'payments', category: 'Stats', min: 0, max: 10, defaultValue: 1 },
    { name: 'Rarity', type: 'Dropdown', icon: 'stars', category: 'Info', options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] },
    { name: 'Type', type: 'Dropdown', icon: 'category', category: 'Info', options: ['Creature', 'Spell', 'Artifact', 'Enchantment'] },
    { name: 'Element', type: 'Dropdown', icon: 'nature', category: 'Mechanics', options: ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'] },
    { name: 'Ability Text', type: 'Text', icon: 'description', category: 'Info', defaultValue: '' },
    { name: 'Foil', type: 'Boolean', icon: 'auto_awesome', category: 'Info', defaultValue: false },
    { name: 'Limited Edition', type: 'Boolean', icon: 'workspace_premium', category: 'Info', defaultValue: false },
    { name: 'Set Number', type: 'Text', icon: 'tag', category: 'Info', defaultValue: '' },
    { name: 'Flavor Text', type: 'Text', icon: 'format_quote', category: 'Info', defaultValue: '' },
    { name: 'Artist', type: 'Text', icon: 'brush', category: 'Info', defaultValue: '' },
    { name: 'Tags', type: 'List', icon: 'label', category: 'Mechanics', defaultValue: [] },
  ];

  const handleSubmit = () => {
    if (!formData.name.trim() || !currentProjectId) return;

    const attributeData = {
      projectId: currentProjectId,
      name: formData.name,
      type: formData.type as any,
      weight: 5.0,
      icon: formData.icon,
      color: formData.color,
      defaultValue: formData.defaultValue,
      required: formData.required,
      isCore: formData.isCore,
      displayInPreview: formData.displayInPreview,
      category: formData.category,
      ...(formData.type === 'Number' && { min: formData.min, max: formData.max }),
      ...(formData.type === 'Dropdown' || formData.type === 'List' ? { options: formData.options } : {}),
    };

    if (editingId) {
      updateAttribute(editingId, attributeData);
    } else {
      createAttribute(attributeData);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingId(null);
    setFormData({
      name: '',
      type: 'Text',
      icon: 'star',
      color: 'blue',
      defaultValue: '',
      required: false,
      isCore: false,
      displayInPreview: true,
      category: 'General',
      min: 0,
      max: 100,
      options: [],
    });
  };

  const handleEdit = (attr: any) => {
    setEditingId(attr.id);
    setFormData({
      name: attr.name,
      type: attr.type,
      icon: attr.icon || 'star',
      color: attr.color || 'blue',
      defaultValue: attr.defaultValue || '',
      required: attr.required || false,
      isCore: attr.isCore || false,
      displayInPreview: attr.displayInPreview !== false,
      category: attr.category || 'General',
      min: attr.min || 0,
      max: attr.max || 100,
      options: attr.options || [],
    });
    setShowDialog(true);
  };

  const applyTemplate = (template: any) => {
    setFormData({
      ...formData,
      ...template,
      options: template.options || [],
    });
    setShowDialog(true);
  };

  // Group attributes by category
  const groupedAttributes = attributes.reduce((acc, attr) => {
    const category = attr.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(attr);
    return acc;
  }, {} as Record<string, typeof attributes>);

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
            <h1 className="text-xl font-bold">Attribute Schema</h1>
            <p className="text-xs text-slate-500">Define your card's structure</p>
          </div>
        </div>
        <button 
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
        >
          New Attribute
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">info</span>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Dynamic Card System</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Create a completely custom card structure! All properties (power, cost, rarity, etc.) are attributes you define. 
                Add, remove, or modify attributes to match your TCG's unique mechanics.
              </p>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-black/5 dark:border-white/10">
          <h3 className="font-bold text-lg mb-3">Quick Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {templates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => applyTemplate(template)}
                className="p-3 border border-black/10 dark:border-white/10 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">{template.icon}</span>
                  <span className="font-bold text-sm">{template.name}</span>
                </div>
                <span className="text-xs text-slate-500">{template.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Attributes */}
        {Object.keys(groupedAttributes).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">schema</span>
            <h3 className="text-lg font-bold mb-2">No Attributes Defined</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Start by creating attributes that define your cards. Use templates above or create custom ones.
            </p>
            <button
              onClick={() => setShowDialog(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              Create First Attribute
            </button>
          </div>
        ) : (
          Object.entries(groupedAttributes).map(([category, attrs]) => (
            <div key={category} className="bg-white dark:bg-white/5 rounded-xl p-4 border border-black/5 dark:border-white/10">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">folder</span>
                {category}
                <span className="text-xs font-normal text-slate-500 ml-auto">{attrs.length} attributes</span>
              </h3>
              <div className="space-y-2">
                {attrs.map((attr) => (
                  <div key={attr.id} className="flex items-center gap-3 p-3 border border-black/5 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                      <span className="material-symbols-outlined text-primary text-xl">{attr.icon || 'star'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{attr.name}</p>
                        {attr.required && (
                          <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-600 rounded-full">Required</span>
                        )}
                        {attr.isCore && (
                          <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full">Core</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-full">
                          {attr.type}
                        </span>
                        {attr.defaultValue !== undefined && attr.defaultValue !== '' && (
                          <span className="text-xs text-slate-500">
                            Default: {String(attr.defaultValue)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(attr)}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete "${attr.name}"?`)) {
                            deleteAttribute(attr.id);
                          }
                        }}
                        className="p-2 hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={resetForm}>
          <div className="bg-white dark:bg-panel-dark rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Attribute</h2>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-primary"
                    placeholder="e.g., Power, Cost, Element"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                  >
                    <option value="Number">Number</option>
                    <option value="Text">Text</option>
                    <option value="Boolean">Boolean (Yes/No)</option>
                    <option value="Dropdown">Dropdown (Single Choice)</option>
                    <option value="List">List (Multiple Values)</option>
                    <option value="Color">Color Picker</option>
                    <option value="Date">Date</option>
                    <option value="Icon">Icon</option>
                    <option value="Tag">Tag</option>
                  </select>
                </div>
              </div>

              {/* Category & Icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-primary"
                    placeholder="General, Stats, Mechanics, Info"
                  />
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
                    <option value="favorite">Heart</option>
                    <option value="shield">Shield</option>
                    <option value="bolt">Lightning</option>
                    <option value="water_drop">Water Drop</option>
                    <option value="local_fire_department">Fire</option>
                    <option value="nature">Nature</option>
                    <option value="category">Category</option>
                    <option value="description">Description</option>
                    <option value="tag">Tag</option>
                  </select>
                </div>
              </div>

              {/* Number-specific options */}
              {formData.type === 'Number' && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Value</label>
                    <input
                      type="number"
                      value={formData.min}
                      onChange={(e) => setFormData({ ...formData, min: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Value</label>
                    <input
                      type="number"
                      value={formData.max}
                      onChange={(e) => setFormData({ ...formData, max: parseInt(e.target.value) || 100 })}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Dropdown/List options */}
              {(formData.type === 'Dropdown' || formData.type === 'List') && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="text-sm font-medium mb-2 block">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.options.join(', ')}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                    placeholder="Common, Uncommon, Rare, Epic, Legendary"
                  />
                </div>
              )}

              {/* Default Value */}
              <div>
                <label className="text-sm font-medium mb-2 block">Default Value</label>
                {formData.type === 'Boolean' ? (
                  <select
                    value={String(formData.defaultValue)}
                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value === 'true' })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                ) : formData.type === 'Number' ? (
                  <input
                    type="number"
                    value={formData.defaultValue}
                    onChange={(e) => setFormData({ ...formData, defaultValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.defaultValue}
                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none"
                    placeholder="Default value for new cards"
                  />
                )}
              </div>

              {/* Flags */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Required (must be filled)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCore}
                    onChange={(e) => setFormData({ ...formData, isCore: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Core attribute (always shown)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.displayInPreview}
                    onChange={(e) => setFormData({ ...formData, displayInPreview: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Display in card preview</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetForm}
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

export default AttributeSchemaScreen;
