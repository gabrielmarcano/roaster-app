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
  useGetControllerConfig,
  useUpdateControllerConfig,
} from '@/api/queries';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useState } from 'react';

export default function ControllersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [mode, setMode] = useState<'cafe' | 'cacao' | 'mani' | undefined>(
    undefined,
  );
  const [startingTemperature, setStartingTemperature] = useState<number | undefined>(0);
  const [time, setTime] = useState<number | undefined>(0);

  const {
    data: controllerConfigData,
    isLoading: isControllerConfigLoading,
    refetch,
  } = useGetControllerConfig();

  const updateControllerConfig = useUpdateControllerConfig({
    mode,
    starting_temperature: startingTemperature,
    time,
  });

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const onSave = () => {
    updateControllerConfig.mutate();
  };

  const onToggleSwitch = () => {
    return setIsSwitchOn(!isSwitchOn);
  };

  useRefreshOnFocus(refetch);

  if (isControllerConfigLoading)
    return (
      <View
        style={{
          ...styles.wrapper,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );

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
            onChangeText={(text) =>
              setMode(
                ['cafe', 'cacao', 'mani'].includes(text)
                  ? (text as 'cafe' | 'cacao' | 'mani')
                  : undefined,
              )
            }
          />
          <HelperText type="info">e.g. cafe</HelperText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            value={String(startingTemperature)}
            onChangeText={(text) =>
              setStartingTemperature(text ? Number(text) : undefined)
            }
          />
          <HelperText type="info">e.g. 120</HelperText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            value={String(time)}
            onChangeText={(text) => setTime(text ? Number(text) : undefined)}
          />
          <HelperText type="info">e.g. 40</HelperText>
        </View>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
        <Button mode="contained" onPress={onSave}>
          Save controller configuration
        </Button>
        <Text variant="displaySmall">
          Mode: {controllerConfigData?.data.mode}
        </Text>
        <Text variant="displaySmall">
          str_temperature: {controllerConfigData?.data.starting_temperature}
        </Text>
        <Text variant="displaySmall">
          time: {controllerConfigData?.data.time}
        </Text>
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
    width: '80%',
  },
});
