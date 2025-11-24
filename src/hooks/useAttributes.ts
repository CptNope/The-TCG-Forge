import { useState, useEffect, useCallback } from 'react';
import { Attribute } from '../../types';
import { Storage, STORAGE_KEYS } from '../storage/localStorage';

/**
 * Custom hook for managing custom attributes with localStorage persistence
 */
export function useAttributes(projectId?: string) {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);

  // Load attributes on mount
  useEffect(() => {
    const loadedAttributes = Storage.load<Attribute[]>(STORAGE_KEYS.ATTRIBUTES, []);
    setAttributes(loadedAttributes);
    setLoading(false);
  }, []);

  // Save attributes whenever they change
  useEffect(() => {
    if (!loading) {
      Storage.save(STORAGE_KEYS.ATTRIBUTES, attributes);
    }
  }, [attributes, loading]);

  /**
   * Get filtered attributes by project
   */
  const filteredAttributes = projectId 
    ? attributes.filter(attr => attr.projectId === projectId)
    : attributes;

  /**
   * Create a new attribute
   */
  const createAttribute = useCallback((attributeData: Omit<Attribute, 'id' | 'dateCreated' | 'dateModified'>) => {
    const now = new Date().toISOString();
    const newAttribute: Attribute = {
      ...attributeData,
      id: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: now,
      dateModified: now,
    };
    setAttributes(prev => [...prev, newAttribute]);
    return newAttribute;
  }, []);

  /**
   * Update an existing attribute
   */
  const updateAttribute = useCallback((id: string, updates: Partial<Attribute>) => {
    setAttributes(prev => prev.map(attr => 
      attr.id === id 
        ? { ...attr, ...updates, dateModified: new Date().toISOString() }
        : attr
    ));
  }, []);

  /**
   * Delete an attribute
   */
  const deleteAttribute = useCallback((id: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id));
  }, []);

  /**
   * Get a single attribute by ID
   */
  const getAttribute = useCallback((id: string) => {
    return attributes.find(attr => attr.id === id);
  }, [attributes]);

  return {
    attributes: filteredAttributes,
    allAttributes: attributes,
    loading,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    getAttribute,
  };
}
