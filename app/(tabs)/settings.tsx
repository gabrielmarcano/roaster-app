import { ScrollView, StyleSheet, View } from 'react-native';

import { FAB, Text } from 'react-native-paper';

import { useSession } from '@/contexts/sessionContext';

import i18n from '@/i18n';
import {
  useControllerConfig,
  useManageController,
  useResetMicro,
} from '@/api/queries';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

export default function SettingsScreen() {
  const { session, signOut } = useSession();

  const [isSystemOn, setIsSwitchOn] = useState(false);

  const queryClient = useQueryClient();

  const manageController = useManageController();

  const restartMicro = useResetMicro();

  const { data: controllerConfigData, isLoading: isControllerConfigLoading } =
    useControllerConfig();

  const onStop = () => {
    manageController.mutate(
      {
        action: 'stop',
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchControllerConfig'],
          });
        },
      },
    );
  };

  const onRestart = () => {
    restartMicro.mutate();
  };

  const onToggleSystem = () => {
    manageController.mutate(
      {
        action: isSystemOn ? 'deactivate' : 'activate',
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['fetchControllerConfig'],
          });
        },
      },
    );
  };

  useEffect(() => {
    setIsSwitchOn(controllerConfigData?.data.status === 'on' ? true : false);
  }, [controllerConfigData]);

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
          <Text variant="titleLarge">
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
          <Text variant="titleLarge">
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
          <Text variant="titleLarge">{i18n.t('Settings.Buttons.Restart')}</Text>
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
    padding: 32,
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
  ipContainer: { flexDirection: 'row', alignItems: 'center' },
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
  systemOnIcon: {
    backgroundColor: 'rgb(19, 73, 29)',
  },
});
