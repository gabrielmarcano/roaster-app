import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getInternalConfig, updateInternalConfig } from '@/api/api';
import { IConfigMap } from '@/api/types';
import { useLocalConfigs } from '@/contexts/localConfigContext';

// Finds the first available name slot on the server for a conflicting config.
// e.g. "Medium Roast" taken → tries "Medium Roast (2)", "(3)", etc.
function findAvailableName(base: string, serverConfigs: IConfigMap): string {
  let attempt = 2;
  while (serverConfigs[`${base} (${attempt})`]) attempt++;
  return `${base} (${attempt})`;
}

export function useSyncPendingConfigs(isConnected: boolean) {
  const { localPendingConfigs, pendingNames, removePendingConfig } = useLocalConfigs();
  const queryClient = useQueryClient();

  // Always-current ref so the effect closure never goes stale
  const stateRef = useRef({ localPendingConfigs, pendingNames, removePendingConfig });
  useEffect(() => {
    stateRef.current = { localPendingConfigs, pendingNames, removePendingConfig };
  });

  useEffect(() => {
    if (!isConnected) return;

    const { pendingNames, localPendingConfigs, removePendingConfig } = stateRef.current;
    if (pendingNames.length === 0) return;

    async function sync() {
      try {
        const response = await getInternalConfig();
        const serverConfigs = response.data;

        for (const name of pendingNames) {
          const localConfig = localPendingConfigs[name];
          if (!localConfig) {
            // Was removed locally before sync — just clean up
            removePendingConfig(name);
            continue;
          }

          if (serverConfigs[name]) {
            const serverConfig = serverConfigs[name];
            const identical =
              serverConfig.starting_temperature === localConfig.starting_temperature &&
              serverConfig.time === localConfig.time;

            if (identical) {
              // Already on the server with the same values (synced by another device)
              removePendingConfig(name);
            } else {
              // Name conflict with different values → rename and POST
              const newName = findAvailableName(name, serverConfigs);
              await updateInternalConfig({ name: newName, ...localConfig });
              removePendingConfig(name);
            }
          } else {
            // Name is free on server → POST as-is
            await updateInternalConfig({ name, ...localConfig });
            removePendingConfig(name);
          }
        }

        queryClient.invalidateQueries({ queryKey: ['fetchInternalConfig'] });
      } catch (err) {
        console.error('Config sync failed:', err);
      }
    }

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // queryClient is stable. pendingNames/localPendingConfigs are read via ref
    // to avoid re-running on every change — sync only triggers on reconnect.
  }, [isConnected, queryClient]);
}
