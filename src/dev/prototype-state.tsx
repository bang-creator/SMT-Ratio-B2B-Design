import { createContext, useContext, useState, type ReactNode } from 'react';

export type ScreenState = 'default' | 'loading' | 'empty' | 'error' | 'no-permission' | 'long-content';

type PrototypeStateValue = {
  screenState: ScreenState;
  setScreenState: (state: ScreenState) => void;
};

const PrototypeStateContext = createContext<PrototypeStateValue | null>(null);

export function PrototypeStateProvider({ children }: { children: ReactNode }) {
  const [screenState, setScreenState] = useState<ScreenState>('default');
  return <PrototypeStateContext.Provider value={{ screenState, setScreenState }}>{children}</PrototypeStateContext.Provider>;
}

export function usePrototypeState() {
  const value = useContext(PrototypeStateContext);
  if (!value) throw new Error('usePrototypeState must be used inside PrototypeStateProvider');
  return value;
}

export function ScreenStateBanner() {
  const { screenState } = usePrototypeState();
  if (screenState === 'default') return null;
  const copy: Record<Exclude<ScreenState, 'default'>, string> = {
    loading: 'Loading state: data is being fetched.',
    empty: 'Empty state: no records are available.',
    error: 'Error state: the request could not be completed.',
    'no-permission': 'No-permission state: ask an owner for access.',
    'long-content': 'Long-content state: overflow and wrapping are enabled.',
  };
  return <div className={`ds-state-banner ds-state-banner--${screenState}`} role="status">{copy[screenState]}</div>;
}
