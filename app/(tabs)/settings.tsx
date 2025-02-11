import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Text } from 'react-native-paper';

import { useSession } from '@/contexts/sessionContext';

import i18n from '@/i18n';
import { useSSE } from '@/contexts/sseContext';

export default function SettingsScreen() {
  const { session, signOut } = useSession();
  const { eventSource, sensors, time, states, controller } = useSSE();

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text variant="displaySmall">IP: {session}</Text>

        <Button
          mode="contained"
          onPress={() => {
            console.log(session);
            signOut();
          }}
        >
          {i18n.t('SignOut')}
        </Button>
        <Text variant="displaySmall">
          sensors event: {JSON.stringify(sensors)}
        </Text>
        <Text variant="displaySmall">time event: {JSON.stringify(time)}</Text>
        <Text variant="displaySmall">
          states event: {JSON.stringify(states)}
        </Text>
        <Text variant="displaySmall">
          controller event: {JSON.stringify(controller)}
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            eventSource?.close();
          }}
        >
          Close event source
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
