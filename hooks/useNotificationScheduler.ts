import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ITimer } from '@/api/types';
import { useNotifications } from '@/contexts/notificationsContext';
import i18n from '@/i18n';

export function useNotificationScheduler(time: ITimer | undefined) {
  const {
    notificationsEnabled,
    preNotif30,
    preNotif20,
    preNotif10,
  } = useNotifications();

  const currentTimeRef = useRef(0);

  // Keep ref in sync with every SSE tick
  useEffect(() => {
    if (time) {
      currentTimeRef.current = time.current_time;
    }
  }, [time]);

  // Set up Android notification channel
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('timer', {
        name: 'Timer',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

  // Schedule/cancel notifications when settings or total_time change.
  // IMPORTANT: the ref-update effect above must stay first so currentTimeRef
  // is up-to-date by the time this effect reads it.
  useEffect(() => {
    if (!notificationsEnabled || !time || time.total_time === 0) {
      Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }

    const remaining = time.total_time - currentTimeRef.current;
    if (remaining <= 0) {
      Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }

    // Capture before the async closure so we never need a non-null assertion
    // inside schedule() after awaits.
    const totalTime = time.total_time;

    // Abort flag: if this effect re-runs before the async work finishes,
    // the cleanup sets cancelled=true and the stale schedule() bails out
    // after each await, preventing double-scheduling.
    let cancelled = false;

    async function schedule() {
      await Notifications.cancelAllScheduledNotificationsAsync();
      if (cancelled) return;

      // Timer finished notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('Notifications.TimerFinished'),
          body: i18n.t('Notifications.TimerFinishedBody'),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: remaining,
          repeats: false,
          channelId: Platform.OS === 'android' ? 'timer' : undefined,
        },
      });
      if (cancelled) return;

      // Pre-notifications
      const preNotifs = [
        { enabled: preNotif30, offset: 1800, minutes: 30 },
        { enabled: preNotif20, offset: 1200, minutes: 20 },
        { enabled: preNotif10, offset: 600, minutes: 10 },
      ];

      for (const { enabled, offset, minutes } of preNotifs) {
        if (!enabled) continue;
        if (totalTime <= offset) continue;
        const triggerSeconds = remaining - offset;
        if (triggerSeconds <= 0) continue;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('Notifications.PreNotification'),
            body: i18n.t('Notifications.MinutesRemaining', { minutes }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: triggerSeconds,
            repeats: false,
            channelId: Platform.OS === 'android' ? 'timer' : undefined,
          },
        });
        if (cancelled) return;
      }
    }

    schedule();

    return () => {
      cancelled = true;
    };
  // `time` is intentionally excluded — only total_time changes should trigger
  // rescheduling. Including `time` would re-run every SSE tick (~1s), cancelling
  // and recreating all notifications continuously.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time?.total_time, notificationsEnabled, preNotif30, preNotif20, preNotif10]);
}
