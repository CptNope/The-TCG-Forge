import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../types';
import { Storage, STORAGE_KEYS } from '../storage/localStorage';

/**
 * Custom hook for managing cards with localStorage persistence
 */
export function useCards(projectId?: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cards on mount
  useEffect(() => {
    const loadedCards = Storage.load<Card[]>(STORAGE_KEYS.CARDS, []);
    setCards(loadedCards);
    setLoading(false);
  }, []);

  // Save cards whenever they change
  useEffect(() => {
    if (!loading) {
      Storage.save(STORAGE_KEYS.CARDS, cards);
    }
  }, [cards, loading]);

  /**
   * Get filtered cards by project
   */
  const filteredCards = projectId 
    ? cards.filter(card => card.projectId === projectId)
    : cards;

  /**
   * Create a new card
   */
  const createCard = useCallback((cardData: Omit<Card, 'id' | 'dateCreated' | 'dateModified'>) => {
    const now = new Date().toISOString();
    const newCard: Card = {
      ...cardData,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: now,
      dateModified: now,
    };
    setCards(prev => [...prev, newCard]);
    return newCard;
  }, []);

  /**
   * Update an existing card
   */
  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    setCards(prev => prev.map(card => 
      card.id === id 
        ? { ...card, ...updates, dateModified: new Date().toISOString() }
        : card
    ));
  }, []);

  /**
   * Delete a card
   */
  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  }, []);

  /**
   * Get a single card by ID
   */
  const getCard = useCallback((id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  /**
   * Duplicate a card
   */
  const duplicateCard = useCallback((id: string) => {
    const original = getCard(id);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicate: Card = {
      ...original,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${original.name} (Copy)`,
      dateCreated: now,
      dateModified: now,
    };
    setCards(prev => [...prev, duplicate]);
    return duplicate;
  }, [getCard]);

  /**
   * Get cards by set
   */
  const getCardsBySet = useCallback((setId: string): Card[] => {
    return filteredCards.filter(card => card.setId === setId);
  }, [filteredCards]);

  /**
   * Get cards by rarity
   */
  const getCardsByRarity = useCallback((rarity: string): Card[] => {
    return filteredCards.filter(card => card.rarity === rarity);
  }, [filteredCards]);

  /**
   * Search cards
   */
  const searchCards = useCallback((query: string): Card[] => {
    const lowerQuery = query.toLowerCase();
    return filteredCards.filter(card => 
      card.name.toLowerCase().includes(lowerQuery) ||
      card.type.toLowerCase().includes(lowerQuery) ||
      card.abilityText.toLowerCase().includes(lowerQuery) ||
      card.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [filteredCards]);

  return {
    cards: filteredCards,
    allCards: cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    getCard,
    duplicateCard,
    getCardsBySet,
    getCardsByRarity,
    searchCards,
  };
}
