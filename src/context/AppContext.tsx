/**
 * Global app context for sharing state across screens
 * Used to pass current project/set between screens
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentProjectId: string | null;
  currentSetId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  setCurrentSetId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        currentProjectId,
        currentSetId,
        setCurrentProjectId,
        setCurrentSetId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
