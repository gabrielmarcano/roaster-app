import { ScrollView, StyleSheet, View } from 'react-native';

import { Dialog, FAB, Portal, RadioButton, Switch, Text } from 'react-native-paper';

import { useSession } from '@/contexts/sessionContext';
import { useLocale } from '@/contexts/localeContext';
import { useNotifications } from '@/contexts/notificationsContext';

import i18n, { availableLanguages, deviceLocale } from '@/i18n';
import {
  useControllerConfig,
  useManageController,
  useResetMicro,
} from '@/api/queries';
import { useEffect, useState } from 'react';

export default function SettingsScreen() {
  const { session, signOut } = useSession();
  const { locale, isDeviceDefault, setLocale } = useLocale();
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    preNotif30,
    setPreNotif30,
    preNotif20,
    setPreNotif20,
    preNotif10,
    setPreNotif10,
  } = useNotifications();

  const [isSystemOn, setIsSwitchOn] = useState(false);
  const [langDialogVisible, setLangDialogVisible] = useState(false);

  const manageController = useManageController();

  const restartMicro = useResetMicro();

  const { data: controllerConfigData, isLoading: isControllerConfigLoading } =
    useControllerConfig();

  const onStop = () => {
    manageController.mutate({ action: 'stop' });
  };

  const onRestart = () => {
    restartMicro.mutate();
  };

  const onToggleSystem = () => {
    manageController.mutate({
      action: isSystemOn ? 'deactivate' : 'activate',
    });
  };

  useEffect(() => {
    setIsSwitchOn(controllerConfigData?.data.status === 'on');
  }, [controllerConfigData]);

  const currentLanguageName = availableLanguages[locale] ?? locale;
  const deviceLanguageName = availableLanguages[deviceLocale] ?? deviceLocale;

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.ipContainer}>
            <Text variant="titleLarge">IP: </Text>
            <View style={styles.ipBox}>
              <Text variant="titleLarge" style={styles.ipText}>
                {session}
              </Text>
            </View>
          </View>
          <FAB
            mode="flat"
            variant="secondary"
            size="medium"
            icon="exit-to-app"
            onPress={() => {
              signOut();
            }}
          />
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge" style={styles.cardText}>
            {i18n.t('Settings.Language')}
          </Text>
          <FAB
            mode="flat"
            variant="secondary"
            size="medium"
            icon="translate"
            label={currentLanguageName}
            onPress={() => setLangDialogVisible(true)}
          />
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge" style={styles.cardText}>
            {i18n.t('Settings.Notifications.Enable')}
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            style={styles.switch}
          />
        </View>

        <View style={[styles.cardContainer, styles.preNotifContainer]}>
          <View style={styles.preNotifRow}>
            <Text variant="titleMedium" style={styles.cardText}>
              {i18n.t('Settings.Notifications.Pre30')}
            </Text>
            <Switch
              value={preNotif30}
              onValueChange={setPreNotif30}
              disabled={!notificationsEnabled}
            />
          </View>
          <View style={styles.preNotifRow}>
            <Text variant="titleMedium" style={styles.cardText}>
              {i18n.t('Settings.Notifications.Pre20')}
            </Text>
            <Switch
              value={preNotif20}
              onValueChange={setPreNotif20}
              disabled={!notificationsEnabled}
            />
          </View>
          <View style={styles.preNotifRow}>
            <Text variant="titleMedium" style={styles.cardText}>
              {i18n.t('Settings.Notifications.Pre10')}
            </Text>
            <Switch
              value={preNotif10}
              onValueChange={setPreNotif10}
              disabled={!notificationsEnabled}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge" style={styles.cardText}>
            {i18n.t('Settings.Buttons.ActivateSystem')}
          </Text>
          <FAB
            mode="flat"
            variant="tertiary"
            style={isSystemOn ? styles.systemOnIcon : {}}
            color={isSystemOn ? 'rgb(114, 169, 124)' : undefined}
            label={isSystemOn ? 'On' : 'Off'}
            size="medium"
            icon={isSystemOn ? 'sync-circle' : 'power-sleep'}
            disabled={isControllerConfigLoading}
            onPress={onToggleSystem}
          />
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge" style={styles.cardText}>
            {i18n.t('Settings.Buttons.ForceStop')}
          </Text>
          <FAB
            mode="flat"
            variant="tertiary"
            size="medium"
            icon="stop"
            disabled={isControllerConfigLoading}
            onPress={onStop}
          />
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge" style={styles.cardText}>{i18n.t('Settings.Buttons.Restart')}</Text>
          <FAB
            mode="flat"
            variant="primary"
            style={styles.restartButton}
            color="rgb(224, 195, 163)"
            size="medium"
            icon="restore-alert"
            onPress={onRestart}
          />
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={langDialogVisible}
          onDismiss={() => setLangDialogVisible(false)}
        >
          <Dialog.Title>{i18n.t('Settings.Language')}</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={isDeviceDefault ? '__device__' : locale}
              onValueChange={(value) => {
                if (value === '__device__') {
                  setLocale(null);
                } else {
                  setLocale(value);
                }
                setLangDialogVisible(false);
              }}
            >
              <RadioButton.Item
                label={`${i18n.t('Settings.DeviceDefault')} (${deviceLanguageName})`}
                value="__device__"
              />
              {Object.entries(availableLanguages).map(([code, name]) => (
                <RadioButton.Item key={code} label={name} value={code} />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(53, 54, 54, 1)',
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '90%',
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  restartButton: {
    backgroundColor: 'rgb(83, 59, 19)',
  },
  ipContainer: { flex: 1, flexShrink: 1, flexDirection: 'row', alignItems: 'center' },
  ipBox: {
    backgroundColor: 'rgba(13, 15, 8, 0.22)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'grey',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 6,
  },
  ipText: {
    fontSize: 19,
    fontFamily: 'monospace',
  },
  cardText: {
    flex: 1,
    flexShrink: 1,
  },
  systemOnIcon: {
    backgroundColor: 'rgb(19, 73, 29)',
  },
  preNotifContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  preNotifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
