/**
 * LocalStorage utility functions for TCG Forge
 * Handles all data persistence operations
 */

const STORAGE_KEYS = {
  PROJECTS: 'tcg_forge_projects',
  CARDS: 'tcg_forge_cards',
  SETS: 'tcg_forge_sets',
  ATTRIBUTES: 'tcg_forge_attributes',
  DECKS: 'tcg_forge_decks',
  SETTINGS: 'tcg_forge_settings',
} as const;

/**
 * Generic storage operations
 */
export class Storage {
  /**
   * Save data to localStorage
   */
  static save<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      throw new Error(`Storage save failed: ${error}`);
    }
  }

  /**
   * Load data from localStorage
   */
  static load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all TCG Forge data
   */
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  }

  /**
   * Export all data as JSON
   */
  static exportAll(): string {
    const data: Record<string, any> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      if (item) {
        data[name] = JSON.parse(item);
      }
    });
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON
   */
  static importAll(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        if (data[name]) {
          localStorage.setItem(key, JSON.stringify(data[name]));
        }
      });
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid import data format');
    }
  }

  /**
   * Get storage size in bytes
   */
  static getStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Get storage size as human-readable string
   */
  static getStorageSizeFormatted(): string {
    const bytes = this.getStorageSize();
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

export { STORAGE_KEYS };
