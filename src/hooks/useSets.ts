import { useState, useEffect, useCallback } from 'react';
import { CardSet } from '../../types';
import { Storage, STORAGE_KEYS } from '../storage/localStorage';

/**
 * Custom hook for managing card sets with localStorage persistence
 */
export function useSets(projectId?: string) {
  const [sets, setSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sets on mount
  useEffect(() => {
    const loadedSets = Storage.load<CardSet[]>(STORAGE_KEYS.SETS, []);
    
    // If no sets exist for this project, load sample data
    if (projectId && loadedSets.filter(s => s.projectId === projectId).length === 0) {
      const { generateSampleSets } = require('../storage/sampleData');
      const sampleSets = generateSampleSets(projectId);
      const allSets = [...loadedSets, ...sampleSets];
      setSets(allSets);
      Storage.save(STORAGE_KEYS.SETS, allSets);
    } else {
      setSets(loadedSets);
    }
    
    setLoading(false);
  }, [projectId]);

  // Save sets whenever they change
  useEffect(() => {
    if (!loading) {
      Storage.save(STORAGE_KEYS.SETS, sets);
    }
  }, [sets, loading]);

  /**
   * Get filtered sets by project
   */
  const filteredSets = projectId 
    ? sets.filter(set => set.projectId === projectId)
    : sets;

  /**
   * Create a new set
   */
  const createSet = useCallback((setData: Omit<CardSet, 'id' | 'dateCreated' | 'dateModified'>) => {
    const now = new Date().toISOString();
    const newSet: CardSet = {
      ...setData,
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: now,
      dateModified: now,
    };
    setSets(prev => [...prev, newSet]);
    return newSet;
  }, []);

  /**
   * Update an existing set
   */
  const updateSet = useCallback((id: string, updates: Partial<CardSet>) => {
    setSets(prev => prev.map(set => 
      set.id === id 
        ? { ...set, ...updates, dateModified: new Date().toISOString() }
        : set
    ));
  }, []);

  /**
   * Delete a set
   */
  const deleteSet = useCallback((id: string) => {
    setSets(prev => prev.filter(set => set.id !== id));
    // TODO: Handle cards in this set (delete or reassign)
  }, []);

  /**
   * Get a single set by ID
   */
  const getSet = useCallback((id: string): CardSet | undefined => {
    return sets.find(set => set.id === id);
  }, [sets]);

  /**
   * Duplicate a set
   */
  const duplicateSet = useCallback((id: string) => {
    const original = getSet(id);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicate: CardSet = {
      ...original,
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${original.name} (Copy)`,
      dateCreated: now,
      dateModified: now,
    };
    setSets(prev => [...prev, duplicate]);
    return duplicate;
  }, [getSet]);

  return {
    sets: filteredSets,
    allSets: sets,
    loading,
    createSet,
    updateSet,
    deleteSet,
    getSet,
    duplicateSet,
  };
}
