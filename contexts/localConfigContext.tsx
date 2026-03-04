import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useStorageState } from '@/contexts/useStorageState';
import { IConfigMap, IInternalConfig } from '@/api/types';

interface LocalConfigStore {
  configs: IConfigMap;
  pending: string[];
}

const EMPTY_STORE: LocalConfigStore = { configs: {}, pending: [] };

function parseStore(stored: string | null): LocalConfigStore {
  if (!stored) return EMPTY_STORE;
  try {
    return JSON.parse(stored);
  } catch {
    return EMPTY_STORE;
  }
}

type LocalConfigContextValue = {
  localPendingConfigs: IConfigMap;
  pendingNames: string[];
  addPendingConfig: (config: IInternalConfig) => void;
  removePendingConfig: (name: string) => void;
};

const LocalConfigContext = createContext<LocalConfigContextValue>({
  localPendingConfigs: {},
  pendingNames: [],
  addPendingConfig: () => {},
  removePendingConfig: () => {},
});

export function LocalConfigProvider({ children }: { children: React.ReactNode }) {
  const [[, stored], setStored] = useStorageState('local_config_store');

  const store = useMemo(() => parseStore(stored), [stored]);

  const save = useCallback(
    (next: LocalConfigStore) => setStored(JSON.stringify(next)),
    [setStored],
  );

  const addPendingConfig = useCallback(
    (config: IInternalConfig) => {
      save({
        configs: {
          ...store.configs,
          [config.name]: {
            starting_temperature: config.starting_temperature,
            time: config.time,
          },
        },
        pending: store.pending.includes(config.name)
          ? store.pending
          : [...store.pending, config.name],
      });
    },
    [store, save],
  );

  const removePendingConfig = useCallback(
    (name: string) => {
      const { [name]: _removed, ...remainingConfigs } = store.configs;
      save({
        configs: remainingConfigs,
        pending: store.pending.filter((n) => n !== name),
      });
    },
    [store, save],
  );

  return (
    <LocalConfigContext.Provider
      value={{
        localPendingConfigs: store.configs,
        pendingNames: store.pending,
        addPendingConfig,
        removePendingConfig,
      }}
    >
      {children}
    </LocalConfigContext.Provider>
  );
}

export function useLocalConfigs() {
  return useContext(LocalConfigContext);
}
