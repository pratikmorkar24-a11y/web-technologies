import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast-bubble ${toast ? 'show' : ''}`}>{toast}</div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
