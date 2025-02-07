import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  ActivityIndicator,
  Button,
  DataTable,
  HelperText,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';

import {
  useControllerConfig,
  useManageController,
  useUpdateControllerConfig,
} from '@/api/queries';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import i18n from '@/translations';

export default function ControllersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  // const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [mode, setMode] = useState<string | undefined>(undefined);
  const [startingTemperature, setStartingTemperature] = useState<
    string | undefined
  >(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();

  const {
    data: controllerConfigData,
    isLoading: isControllerConfigLoading,
    refetch,
  } = useControllerConfig();

  const updateControllerConfig = useUpdateControllerConfig();

  const manageController = useManageController();

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const onSave = () => {
    console.log(mode, startingTemperature, time);

    if (mode !== 'cafe' && mode !== 'cacao' && mode !== 'mani')
      setMode(undefined);
    if (isNaN(Number(startingTemperature))) setStartingTemperature(undefined);
    if (isNaN(Number(time))) setTime(undefined);

    updateControllerConfig.mutate(
      {
        mode: mode as 'cafe' | 'cacao' | 'mani' | undefined,
        starting_temperature: Number(startingTemperature),
        time: Number(time),
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

  useRefreshOnFocus(refetch);

  useEffect(() => {
    setIsSwitchOn(controllerConfigData?.data.status === 'on' ? true : false);
  }, [controllerConfigData]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.textInputContainer}>
          <TextInput
            value={mode}
            onChangeText={(text) => setMode(text.toLowerCase())}
          />
          <HelperText type="info">e.g. cafe</HelperText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            value={startingTemperature}
            onChangeText={(text) => setStartingTemperature(text)}
          />
          <HelperText type="info">e.g. 120</HelperText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput value={time} onChangeText={(text) => setTime(text)} />
          <HelperText type="info">e.g. 40</HelperText>
        </View>
        <Button
          mode="contained"
          onPress={onSave}
          disabled={isControllerConfigLoading}
        >
          {i18n.t('Controller.Buttons.SaveControllerConfiguration')}
        </Button>
        <View style={styles.switchContainer}>
          <Text variant="labelLarge">
            {i18n.t('Controller.Buttons.ActivateController')}:
          </Text>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            disabled={isControllerConfigLoading}
            style={{
              transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }],
              marginHorizontal: 24,
            }}
          />
        </View>
        {isControllerConfigLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : (
          <>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{i18n.t('Controller.Status')}</DataTable.Title>
                <DataTable.Title>{i18n.t('Controller.Mode')}</DataTable.Title>
                <View>
                  <DataTable.Title
                    numeric
                    style={{
                      width: 120,
                    }}
                  >
                    {i18n.t('Controller.StartingTemperature')}
                  </DataTable.Title>
                </View>
                <DataTable.Title numeric>
                  {`${i18n.t('Controller.Time')} (s)`}
                </DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>
                  {controllerConfigData?.data.status}
                </DataTable.Cell>
                <DataTable.Cell>
                  {controllerConfigData?.data.mode ?? '-'}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {controllerConfigData?.data.starting_temperature}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {controllerConfigData?.data.time}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#353636',
    paddingTop: 32,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    width: '90%',
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
