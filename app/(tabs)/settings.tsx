import { ScrollView, StyleSheet, View } from 'react-native';

import { FAB, Switch, Text } from 'react-native-paper';

import { useSession } from '@/contexts/sessionContext';

import i18n from '@/i18n';
import { useControllerConfig, useManageController } from '@/api/queries';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

export default function SettingsScreen() {
  const { session, signOut } = useSession();

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const queryClient = useQueryClient();

  const manageController = useManageController();

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

  const onToggleSwitch = () => {
    manageController.mutate(
      {
        action: isSwitchOn ? 'deactivate' : 'activate',
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="titleLarge">IP: </Text>
            <View
              style={{
                backgroundColor: 'rgba(13, 15, 8, 0.22)',
                borderRadius: 12,
                borderWidth: 2,
                borderColor: 'grey',
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginLeft: 6,
              }}
            >
              <Text
                variant="titleLarge"
                style={{
                  fontFamily: 'monospace',
                }}
              >
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
              console.log(session);
              signOut();
            }}
          />
        </View>

        <View style={styles.cardContainer}>
          <Text variant="titleLarge">
            {i18n.t('Settings.Buttons.ActivateSystem')}
          </Text>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            disabled={isControllerConfigLoading}
            style={styles.switch}
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
            onPress={onStop}
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
});
