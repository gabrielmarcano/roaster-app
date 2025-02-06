import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { useControllerConfig } from '@/api/queries';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/contexts/ctx';

import { useState } from 'react';

export default function TimerScreen() {
  const { session } = useSession();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: controllerConfigData,
    isLoading: isControllerConfigLoading,
    refetch,
  } = useControllerConfig();

  useRefreshOnFocus(refetch);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

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
  },
});
