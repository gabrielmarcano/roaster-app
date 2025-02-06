import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  ActivityIndicator,
  Button,
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

export default function ControllersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
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
        <Switch
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
          disabled={isControllerConfigLoading}
        />
        ;
        <Button
          mode="contained"
          onPress={onSave}
          disabled={isControllerConfigLoading}
        >
          Save controller configuration
        </Button>
        {isControllerConfigLoading ? (
          <View
            style={{
              paddingTop: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : (
          <>
            <Text variant="displaySmall">
              Mode: {controllerConfigData?.data.mode}
            </Text>
            <Text variant="displaySmall">
              str_temperature: {controllerConfigData?.data.starting_temperature}
            </Text>
            <Text variant="displaySmall">
              time: {controllerConfigData?.data.time}
            </Text>
            <Text variant="displaySmall">
              status: {controllerConfigData?.data.status}
            </Text>
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
});
