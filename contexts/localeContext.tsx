import React, { createContext, useContext } from 'react';
import { useStorageState } from '@/contexts/useStorageState';
import i18n, { deviceLocale } from '@/i18n';

type LocaleContextValue = {
  locale: string;
  isDeviceDefault: boolean;
  setLocale: (code: string | null) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: deviceLocale,
  isDeviceDefault: true,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [[, storedLocale], setStoredLocale] = useStorageState('locale');

  const locale = storedLocale ?? deviceLocale;

  // Keep i18n singleton in sync on every render
  i18n.locale = locale;

  return (
    <LocaleContext.Provider value={{ locale, isDeviceDefault: storedLocale === null, setLocale: setStoredLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
