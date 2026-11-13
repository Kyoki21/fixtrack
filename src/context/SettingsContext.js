import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme/themes';
import { translations } from '../i18n/translations';
import { KEYS, loadJson, saveJson } from '../storage/storage';

const FONT_SCALES = { small: 0.9, medium: 1, large: 1.18 };

const FONT_FAMILIES = {
  system: undefined,
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

export const defaultSettings = {
  themeMode: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  language: 'ru',
  avatarUri: null,
  profile: {
    name: 'Алексей Смирнов',
    techId: '#100500',
    phone: '+7 (999) 123-45-67',
    email: 'aleksey.s@fixtrack.ru',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, profile: { ...state.profile, ...(action.payload.profile || {}) } };
    case 'set':
      return { ...state, [action.key]: action.value };
    case 'profile':
      return { ...state, profile: { ...state.profile, ...action.value } };
    case 'reset':
      return { ...defaultSettings, avatarUri: state.avatarUri, profile: state.profile };
    default:
      return state;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultSettings);
  const [ready, setReady] = useState(false);
  const systemScheme = useColorScheme();

  useEffect(() => {
    loadJson(KEYS.settings, null).then((saved) => {
      if (saved) dispatch({ type: 'hydrate', payload: saved });
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveJson(KEYS.settings, state);
  }, [state, ready]);

  const value = useMemo(() => {
    const isDark = state.themeMode === 'system' ? systemScheme === 'dark' : state.themeMode === 'dark';
    const dict = translations[state.language];
    return {
      ready,
      settings: state,
      theme: isDark ? darkTheme : lightTheme,
      scale: FONT_SCALES[state.fontSize],
      fontFamily: FONT_FAMILIES[state.fontFamily],
      t: (key) => dict[key] || translations.ru[key] || key,
      setSetting: (key, val) => dispatch({ type: 'set', key, value: val }),
      updateProfile: (val) => dispatch({ type: 'profile', value: val }),
      resetSettings: () => dispatch({ type: 'reset' }),
    };
  }, [state, ready, systemScheme]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
