import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { useGetControllerConfig } from '@/api/queries';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/contexts/ctx';

export default function ControllersScreen() {
  const { data: controllerConfigData, isLoading: isControllerConfigLoading, refetch } =
    useGetControllerConfig();

  useRefreshOnFocus(refetch)

  const { session } = useSession();

  if (isControllerConfigLoading)
    return (
      <View
        style={{
          ...styles.content,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );

  return (
    <View style={styles.content}>
      {/* <Text variant="displaySmall">
        Time total: {readingsData?.data.time_values.total_time}
      </Text>
      <Text variant="displaySmall">
        Time current: {readingsData?.data.time_values.current_time}
      </Text>
      <Text variant="displaySmall">
        Temperature: {readingsData?.data.sensor_values.temperature}
      </Text>
      <Text variant="displaySmall">
        Humidity: {readingsData?.data.sensor_values.humidity}
      </Text>
      <Text variant="displaySmall">
        Motor 1 state: {String(readingsData?.data.motor_states.motor_a)}
      </Text>
      <Text variant="displaySmall">
        Motor 2 state: {String(readingsData?.data.motor_states.motor_b)}
      </Text>
      <Text variant="displaySmall">
        Motor 3 state: {String(readingsData?.data.motor_states.motor_c)}
      </Text> */}
      <Text variant="displaySmall">
        Mode: {controllerConfigData?.data.mode}
      </Text>
      <Text variant="displaySmall">
        str_temperature: {controllerConfigData?.data.starting_temperature}
      </Text>
      <Text variant="displaySmall">
        time: {controllerConfigData?.data.time}
      </Text>
      <Button
        mode="contained"
        onPress={() => {
          console.log('clicked');
          console.log(controllerConfigData?.data);
          console.log(session);
        }}
      >
        Click
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
    backgroundColor: '#353636',
  },
});
