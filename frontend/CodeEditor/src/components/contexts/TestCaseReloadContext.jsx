// TestcaseReloadContext.jsx
import React, { createContext, useState, useCallback } from 'react';

export const TestcaseReloadContext = createContext();

export const TestcaseReloadProvider = ({ children }) => {
  const [reloadFlag, setReloadFlag] = useState(false);

  const triggerReload = useCallback(() => {
    setReloadFlag(prev => !prev);
  }, []);

  return (
    <TestcaseReloadContext.Provider value={{ reloadFlag, triggerReload }}>
      {children}
    </TestcaseReloadContext.Provider>
  );
};
