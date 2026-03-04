import React, { createContext, useContext, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useStorageState } from '@/contexts/useStorageState';

// Show notifications even when the app is in the foreground (required on iOS).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type NotificationsContextValue = {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  preNotif30: boolean;
  setPreNotif30: (enabled: boolean) => void;
  preNotif20: boolean;
  setPreNotif20: (enabled: boolean) => void;
  preNotif10: boolean;
  setPreNotif10: (enabled: boolean) => void;
};

const NotificationsContext = createContext<NotificationsContextValue>({
  notificationsEnabled: false,
  setNotificationsEnabled: () => {},
  preNotif30: false,
  setPreNotif30: () => {},
  preNotif20: false,
  setPreNotif20: () => {},
  preNotif10: false,
  setPreNotif10: () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [[, storedEnabled], setStoredEnabled] = useStorageState('notif_enabled');
  const [[, storedPre30], setStoredPre30] = useStorageState('notif_pre30');
  const [[, storedPre20], setStoredPre20] = useStorageState('notif_pre20');
  const [[, storedPre10], setStoredPre10] = useStorageState('notif_pre10');

  const notificationsEnabled = storedEnabled === '1';
  const preNotif30 = storedPre30 === '1';
  const preNotif20 = storedPre20 === '1';
  const preNotif10 = storedPre10 === '1';

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          setStoredEnabled(null);
          return;
        }
        setStoredEnabled('1');
      } else {
        setStoredEnabled(null);
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    },
    [setStoredEnabled],
  );

  const setPreNotif30 = useCallback(
    (enabled: boolean) => setStoredPre30(enabled ? '1' : null),
    [setStoredPre30],
  );

  const setPreNotif20 = useCallback(
    (enabled: boolean) => setStoredPre20(enabled ? '1' : null),
    [setStoredPre20],
  );

  const setPreNotif10 = useCallback(
    (enabled: boolean) => setStoredPre10(enabled ? '1' : null),
    [setStoredPre10],
  );

  return (
    <NotificationsContext.Provider
      value={{
        notificationsEnabled,
        setNotificationsEnabled,
        preNotif30,
        setPreNotif30,
        preNotif20,
        setPreNotif20,
        preNotif10,
        setPreNotif10,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
