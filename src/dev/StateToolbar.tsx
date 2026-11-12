import { useEffect, useState } from 'react';
import { usePrototypeState, type ScreenState } from './prototype-state';

const screenStates: ScreenState[] = ['default', 'loading', 'empty', 'error', 'no-permission', 'long-content'];

export function StateToolbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [motion, setMotion] = useState(false);
  const { screenState, setScreenState } = usePrototypeState();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.reducedMotion = motion ? 'true' : 'false';
  }, [theme, motion]);
  return <div className="ds-toolbar" aria-label="Debug state toolbar">
    <label className="ds-toolbar__field">Theme<select value={theme} onChange={e => setTheme(e.target.value as 'light' | 'dark')} aria-label="Theme"><option value="light">Light</option><option value="dark">Dark</option></select></label>
    <label className="ds-toolbar__field">Screen state<select value={screenState} onChange={e => setScreenState(e.target.value as ScreenState)} aria-label="Screen state">{screenStates.map(state => <option value={state} key={state}>{state}</option>)}</select></label>
    <label className="ds-muted"><input type="checkbox" checked={motion} onChange={e => setMotion(e.target.checked)} /> Reduce motion</label>
  </div>;
}
